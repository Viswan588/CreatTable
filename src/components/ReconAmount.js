import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import swal from 'sweetalert';
import {titleCase, numberWithCommas, numberWithCommasAmount} from '../utils/dateCalculator';



const ReconAmount = ({ selectedCusip }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [flightData, setFlightData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState(null);
    const [exceptionData, setExceptionData] = useState(null);
  // const dt1 = useRef(null);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
    const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

    const handleTabChange = (e) => {
        setActiveIndex(e.index);
        fetchData(e.index  === 0 ? 'transaction' : 'fund_holdings');
       
    }

    useEffect(() => {
        fetchData('transaction');
    }, [])

    const fetchData = async(tableName) => {
        setIsLoading(true);
        const flightData = 
        await axios.get(`http://172.20.3.113:9009/api/get_exception?exception_type=source&table_name=${tableName}&fund_cusip=${selectedCusip}`);
        if(flightData.data && flightData.data.response){
           
            const dataRes = flightData.data.response;
            if(tableName === 'fund_holdings'){
                dataRes.forEach(rec => {
                    rec.issue_market_value = numberWithCommasAmount(rec.issue_market_value);
                    rec.notional_value = numberWithCommasAmount(rec.notional_value);
                    rec.price = numberWithCommasAmount(rec.price);
                    rec.shares_quantity = numberWithCommas(rec.shares_quantity);
                   
                  });
            } else {
                dataRes.forEach(rec => {
                    rec.trade_principal_amount = numberWithCommasAmount(rec.trade_principal_amount);
                    rec.price = numberWithCommasAmount(rec.price);
                  });
            }

            setFlightData(dataRes);
            setIsLoading(false);
        } else {
            swal(`Failed to get data`,``,`error`);
            setIsLoading(false);
        }
    }
    console.log('selectedCusip', selectedCusip);

    
    const sortColumns = () => {
        const columns = Object.keys(flightData && flightData[0] || {});
        return columns;
    };

    const dynamicColumns = (sortColumns()).map((col, i) => {
        if (col !== 'id' && col !== 'execution_id' && col !== 'recon_break' && col !== 'recon_break_amount' &&
         col !== 'is_resolved' && col !== 'created_on' && col !== 'row_exception_details' ) {
            return <Column key={col} field={col} header={titleCase(col)} sortable
                headerStyle={{ width: '250px' }} />;
        }
    });
    
    
    const onRowExpand = (event) => {
        //toast.current.show({severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000});
    }

    const onRowCollapse = (event) => {
        //toast.current.show({severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000});
    }

    const expandAll = () => {
        let _expandedRows = {};
        flightData.forEach(p => _expandedRows[`${p.ide}`] = true);

        setExceptionData(_expandedRows);
    }

    const collapseAll = () => {
        setExpandedRows(null);
    }



    const rowExpansionTemplate = (data) => {
        const { id } = data;
        const { row_exception_details } = flightData.find(x => x.id === id);
        return (
            <div className="orders-subtable" style={{ display: 'table-cell', width: '500px' }}>
                <h5>Exception Details</h5>

                {/* originalData.forEach(rec => rec) */}
                <DataTable value={row_exception_details}>
                    <Column field="field_name" header="Field Name" ></Column>
                    <Column field="exception_name" header="Exception Name" ></Column>

                </DataTable>
            </div>
        );
    }

    const exportExcel = () => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(flightData);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'flightData');
        });
    }

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then(FileSaver => {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        });
    }


    return (
        <div>
        
            {/* Tab View */}
            {flightData && flightData.length > 0 &&
          <Button type="button" icon="pi pi-filter" 
            onClick={exportExcel} 
            style={{ width: '120px', float: 'right', marginRight: 20 }}
            className="p-button-info p-ml-auto"
             data-pr-tooltip="Selection Only" >Export Excel</Button>
        }
            
            <div>
                
                        <TabView activeIndex={activeIndex} onTabChange={(e) => handleTabChange(e)}>
                            <TabPanel header={`Transaction Entries`}>
                            
                            <div className="p-grid" style={{ overflowY: 'hidden' }}>
                                    <div className="p-col-12">
                                        <DataTable 
                                        scrollable  style={{ width: '1200px' }}
                                            dataKey="id"
                                            className="w-100"
                                            scrollHeight="450px"
                                            value={flightData} 
                                            paginator
                                        //    ref={dt1} 
                                            loading={isLoading}
                                                    expandedRows={expandedRows}
                                                    onRowToggle={(e) => setExpandedRows(e.data)}
                                                    onRowExpand={onRowExpand}
                                                    onRowCollapse={onRowCollapse}
                                                    rowExpansionTemplate={rowExpansionTemplate}
                                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
                                            rows={10} 
                                            rowsPerPageOptions={[10,20,50]}
                                            paginatorLeft={paginatorLeft} 
                                            paginatorRight={paginatorRight}
                                            sortMode="multiple">
                                            <Column expander style={{ width: '3em' }} />
                                            {dynamicColumns}
                                            
                                        </DataTable>
                                    </div>
                                </div>

                            </TabPanel>
                            <TabPanel header={`Fund Holding`}>
                            <div className="p-grid">
                                    <div className="p-col-12">
                                        <DataTable 
                                        scrollable  style={{ width: '1200px' }}
                                        scrollHeight="250px"
                                            dataKey="id"
                                            className="w-100"
                                            value={flightData} 
                                           // ref={dt1} 
                                            loading={isLoading}
                                                    expandedRows={expandedRows}
                                                    onRowToggle={(e) => setExpandedRows(e.data)}
                                                    onRowExpand={onRowExpand}
                                                    onRowCollapse={onRowCollapse}
                                                    rowExpansionTemplate={rowExpansionTemplate}
                                            paginator
                                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
                                            rows={10} 
                                            rowsPerPageOptions={[10,20,50]}
                                            paginatorLeft={paginatorLeft} 
                                            paginatorRight={paginatorRight}
                                            sortMode="multiple">
                                        <Column expander style={{ width: '3em' }} />
                                            {dynamicColumns}
                                            
                                        </DataTable>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
              
            
        </div>
    );
}

export default ReconAmount;

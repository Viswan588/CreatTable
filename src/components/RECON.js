import React, {useState, useEffect, useRef} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Ripple } from 'primereact/ripple';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import swal from 'sweetalert';
import {titleCase, numberWithCommas, numberWithCommasAmount} from '../utils/dateCalculator';
import ReconAmount from './ReconAmount';

const RECON = () => {
    
    const [flightData, setFlightData] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState('');
    const [unresolvedCount, setUnresolvedCount] = useState(147);
    const [resolvedCount, setResolvedCount] = useState(0);
    const [activeIndex, setActiveIndex] = useState(1);
    const [reconTableData, setReconTableData] = useState([]);
    const [reconSelection, setReconSelection] = useState(null);
    const [resolvedArray,setResolvedArray] = useState([]);
    const [unresolvedArray, setUnResolvedArray] = useState([]);
    const [hideReconBreak, setHideReconBreak] = useState(false);
    const [selectedCusip, setSelectCusip] = useState('');
    const [tranchName, setTranchName] = useState([]);
    const [selectedTranche, setSelectedTranche] = useState(null);

    const dt = useRef(null);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
    const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

    const handleShowEntries = () => {
        const trancheName = selectedFlight.name;
        axios.get(`http://172.20.3.113:9009/api/reconciliation?fund_name=${trancheName}`)
        .then(res => {
            const reconData = res.data.response;
            if(typeof reconData !== "string"){
                const unresolvedArr = [];
                const resolvedArr = [];
                if(reconData && reconData.length){
                    reconData.forEach(item => {
                        if(!item.is_resolved){
                            unresolvedArr.push(item);
                        } else {
                            resolvedArr.push(item)
                        }
                    });
                    reconData.forEach(rec => {
                        rec.recon_break = rec.recon_break ? 'True' : 'False';
                        rec.previous_shares_quantity = numberWithCommas( rec.previous_shares_quantity);
                        rec.recon_break_amount = numberWithCommasAmount(rec.recon_break_amount);
                        rec.total_trade_principal_amount_buy = numberWithCommasAmount( rec.total_trade_principal_amount_buy);
                        rec.total_issue_market_value = numberWithCommasAmount(rec.total_issue_market_value);
                        rec.total_shares_quantity = numberWithCommas(rec.total_shares_quantity);
                        rec.total_shares_quantity_buy = numberWithCommas(rec.total_shares_quantity_buy);
                        rec.total_shares_quantity_sell = numberWithCommas(rec.total_shares_quantity_sell);
                        rec.recon_break_quantity = numberWithCommas(rec.recon_break_quantity);
                    })
                    console.log('reconData', reconData);
                    setReconTableData(reconData);
                    setResolvedArray(resolvedArr);
                    setUnResolvedArray(unresolvedArr);
                    setResolvedCount(resolvedArr.length);
                    setUnresolvedCount(unresolvedArr.length);
                }
            } else {
                swal(`${reconData}`,``,`success`);
                setReconTableData([]);
            }
        })
    };

    const handleResolve = async() => {
        try {
            if(reconSelection && reconSelection.length){
                const data  = {
                    unique_field_column: "id",
                    records: reconSelection
                }
                const sendData = await axios.put(`http://172.20.3.113:9009/api/reconciliation`, data);
                swal('')
            }
        } catch(error){
            swal('There was an problem please try again','error')
        }
       
    }

    const onShow = (e) => {
        console.log(e);
        setSelectCusip(e);
        setHideReconBreak(true);
    }

    const transActionData = async() => {
        const flightData = await axios.get(`http://172.20.3.113:9009/api/get_exception?exception_type=source&table_name=fund_holdings&fund_cusip=464287127`);
        if(flightData.data && flightData.data.response){
            setFlightData(flightData.data.response)
        } else {
            swal(`Failed to get data`,``,`error`);
        }
    }

    const onHide = () => {
        setHideReconBreak(false);
    }

    const footer = (
        <div>
            <Button label="Ok" icon="pi pi-check" onClick={onHide} />
        </div>
    );

    const imageBodyTemplate = (rowData) => {         
        return !rowData.is_resolved ? <a href="#" onClick={() =>onShow(rowData.fund_cusip)}>{rowData.recon_break_quantity}</a> : 
        <p style={{'margin': '0'}}>{rowData.recon_break_quantity}</p>
    }

    const handleFlightChange = (e) => {
        setSelectedFlight(e.value);
    }

    useEffect(() => {
        setActiveIndex(0);
     

        axios.get(`http://172.20.3.113:9009/api/flight`)
        .then(res => {
            setTranchName(res.data.response.sort((a, b) => a.flight_name > b.flight_name ? 1 : -1));
        });

    }, []);

    const fetchData = async(cusip) => {
        const flightData = await axios.get(`http://172.20.3.113:9009/api/fund`);
        if(flightData.data && flightData.data.response){
          const selectedFlightfilter = flightData.data.response.filter(x => x.cusip === cusip)
            setFlightData(selectedFlightfilter);
        } else {
            setFlightData([]);
            swal(`Failed to get data`,``,`error`);
        }
    }
   

    const camelize = (str) => {
        return str;
     }

     const handleTrancheChange = (e) => {
         console.log('e', e);
       setSelectedTranche(e.target.value);
        fetchData(e.target.value.fund_cusip);
    }


    const sortColumns = () => {
        const columns = Object.keys(reconTableData && reconTableData[0] || {});
        return columns;
    };

    const dynamicColumns = (sortColumns()).map((col, i) => {
        if (col !== 'id' && col !== 'execution_id' && col !== 'recon_break' && col !== 'recon_break_amount' &&
         col !== 'is_resolved' && col !== 'created_on'
          && col !== 'total_trade_principal_amount_buy' 
          && col !== 'total_trade_principal_amount_sell'
          && col !== 'recon_break_quantity' 
          && col !== 'previous_issue_market_value') {
            return <Column key={col} field={col} header={titleCase(col)} sortable
                headerStyle={{ width: '250px' }} />;
        }
    });

    console.log('dynamicColumns', dynamicColumns);
    
    const exportExcel = () => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(reconTableData);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'reconTableData');
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
        <div id="exception">
            <h1 className="p-offset-1 mb-exception-head">Reconciliation</h1>
            <div className="p-grid">
            <div className="p-offset-1 p-col-2">
                    <Dropdown
                        className="p-mb-2 exception-input w-100"
                        value={selectedTranche}
                        options={tranchName}
                        onChange={ handleTrancheChange}
                        //  disabled={disableExceptionBtn}
                        optionLabel="flight_name"
                        placeholder="Select a flight" />
                </div>
                <div className=" p-col-2" >
                    <Dropdown 
                     className="p-mb-2 exception-input w-100"
                        value={selectedFlight} 
                        options={flightData} 
                        disabled={!selectedTranche}
                        onChange={handleFlightChange} 
                        optionLabel="name"
                    
                        placeholder="Select a Recon" />
                </div>
                <div className="p-col-2">
                    <Button 
                        label="Show Entries" 
                        className="p-button-outlined p-button-help btn-show-exception"
                        onClick={handleShowEntries}
                        />
                </div>
            </div>

            {reconTableData && reconTableData.length > 0 &&
          <Button type="button" icon="pi pi-filter" 
            onClick={exportExcel} 
            style={{ width: '120px', float: 'right', marginRight: 20 }}
            className="p-button-info p-ml-auto"
             data-pr-tooltip="Selection Only" >Export Excel</Button>
        }

            {/* Tab View */}
            <div className="p-grid mt-exception-table">
                <div className="p-offset-1">
                    <div className="p-col-11 card">
                        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                            <TabPanel header="Reconciliation">
                                <div className="p-grid">
                                    <div className="p-col-12">
                                    { !(reconTableData && reconTableData.length > 0) ?
                                    <div className="p-grid no-records">
                                        <div className="p-col-12">
                                            No records present in the table
                                        </div>
                                    </div>
                                        :
                                        <DataTable 
                                        scrollable  style={{ width: '1200px' }}
                                            dataKey="id"
                                            className="w-100"
                                            scrollHeight="450px"
                                            value={reconTableData} 
                                            ref={dt} 
                                            paginator
                                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
                                            rows={10} 
                                            rowsPerPageOptions={[10,20,50]}
                                            paginatorLeft={paginatorLeft} 
                                            paginatorRight={paginatorRight}
                                            sortMode="multiple">

                                            {dynamicColumns}
                                            
                                            <Column  key={unresolvedArray.id} body={imageBodyTemplate} header="Break Quantity" headerStyle={{ width: '260px' }} sortable></Column>
                                            
                                        </DataTable>
                                        }
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
            <Dialog header="Breaks"  visible={hideReconBreak} style={{ overflow: 'hidden' }} modal onHide={onHide}>
                <ReconAmount selectedCusip={selectedCusip}/>
            </Dialog>
        </div>
    );
}

export default RECON;

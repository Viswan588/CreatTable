import React, { useState, useEffect, useRef } from 'react';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import swal from 'sweetalert';
import { classNames } from 'primereact/utils';
import LOADER from './LOADER';
import { cloneDeep } from 'lodash';
import axios from 'axios';
import { titleCase, numberWithCommas, numberWithCommasAmount } from '../utils/dateCalculator';

const EXCEPTION = () => {

    const [tranchName, setTranchName] = useState([]);
    const [selectedTranche, setSelectedTranche] = useState(null);
    const [exceptionType, setExceptionType] = useState([]);
    const [selectedException, setSelectedException] = useState(null)
    const [unresolvedCount, setUnresolvedCount] = useState(0);
    const [resolvedCount, setResolvedCount] = useState(0);
    const [activeIndex, setActiveIndex] = useState(1);
    const [exceptionData, setExceptionData] = useState(null);
    const [exceptionSelection, setExceptionSelection] = useState([]);
    const [loading, setLoading] = useState(false);
    const [disableExceptionBtn, isDisabledExceptionBtn] = useState(false);
    const [tableFields, setTableFields] = useState([]);
    const [noRecordsfound, setNoRecordsfound] = useState(false);
    const [selectedTableNameLookup, setSelectedTableNameLookup] = useState('');
    const [selectedTableName, setSelectedTableName] = useState('');
    const [exceptionLookup, setExceptionLookup] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const dt = useRef(null);

    const handleShowException = () => {
        if (selectedTranche === null || selectedException === null) {
            setLoading(false);
            swal({
                title: `Alert`,
                text: `Please select a value from the dropdown`,
                icon: "info",
            });
        } else {
            const trancheName = selectedTranche.flight_name;
            const exceptionName = selectedException.database_type;
            const tableName = selectedTableName.table_definition.table_name;//.toUpperCase();
            setLoading(true);
            axios.get(`http://172.20.3.113:9009/api/get_exception?flight_name=${trancheName}&exception_type=${exceptionName}&table_name=${tableName}`)
                .then(res => {
                    if (res.data.response && !res.data.response.length) {
                        swal({
                            title: `Message`,
                            text: res.data.response,
                            icon: "info",
                        });
                        setLoading(false);
                    }
                    const tableData = res.data.response;
                    setOriginalData(cloneDeep(res.data.response));
                    if (res.data.response === "No records present in the table") {
                        setUnresolvedCount(0);
                        setExceptionData([]);
                        setNoRecordsfound(true);
                        setExceptionSelection([]);
                    } else {
                        // tableData.map(item => {
                        //     let convertToJSON = eval(JSON.stringify(item.row_exception_details));
                        //     let cleanData = JSON.parse(convertToJSON.replace(/\\/g, ""));
                        //     item.exceptionDetails = Object.assign({}, ...cleanData);
                        // });
                        setExceptionSelection([]);
                        setUnresolvedCount(0);
                        let tableDataArr = [];
                        tableData.forEach(rec => {
                            delete rec.row_exception_details;
                            delete rec.created_on;
                            rec.is_resolved = rec.is_resolved ? 'True' : 'False';
                            if (rec.issue_market_value) {
                                rec.issue_market_value = numberWithCommasAmount(rec.issue_market_value);
                            }
                            if (rec.price) {
                                rec.price = numberWithCommasAmount(rec.price);
                            }
                            if (rec.notional_value) {
                                rec.notional_value = numberWithCommasAmount(rec.notional_value);
                            }
                        })


                        setUnresolvedCount(tableData.length);
                        setExceptionData(tableData);
                        setNoRecordsfound(false);
                    }
                    // console.log(tableDataArr)
                    // setTableFields(tableDataArr);


                    setLoading(false);
                }).catch(err => {
                    setLoading(false);
                });
        }
    }

    const handleTrancheChange = (e) => {
        setSelectedTranche(e.target.value)
    }

    // const exportExcel = () => {
    //     import('xlsx').then(xlsx => {
    //         const worksheet = xlsx.utils.json_to_sheet(reconTableData);
    //         const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //         const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //         saveAsExcelFile(excelBuffer, 'reconTableData');
    //     });
    // }

    // const saveAsExcelFile = (buffer, fileName) => {
    //     import('file-saver').then(FileSaver => {
    //         let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    //         let EXCEL_EXTENSION = '.xlsx';
    //         const data = new Blob([buffer], {
    //             type: EXCEL_TYPE
    //         });
    //         FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    //     });
    // }



    const handleTableChange = e => setSelectedTableName(e.target.value);

    const handleExceptionChange = (e) => {
        setSelectedException(e.target.value);
        const selectedValue = e.target.value["database_type"];
        const lookupdata = exceptionType.filter(x => x.database_type === selectedValue);
        setSelectedTableNameLookup(lookupdata.sort((a, b) => a.table_definition.table_name > b.table_definition.table_name ? 1 : -1));
        setSelectedTableName(lookupdata[0])
        //exceptionType
        //  setSelectedTableName
    }

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
    const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;


    const getUniqueListBy = (arr, key) => {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }

    useEffect(() => {
        setActiveIndex(0);
        // Set Tranche Dropdown
        axios.get(`http://172.20.3.113:9009/api/flight`)
            .then(res => {
                setTranchName(res.data.response.sort((a, b) => a.flight_name > b.flight_name ? 1 : -1));
            });

        // Set select Exception dropdown
        axios.get(`http://172.20.3.113:9009/api/all_tables`)
            .then(res => {
                const { data: { response } } = res;
                const records = [...new Set(response.map(x => x.database_type))];
                const recordOptions = records.map(x => ({ database_type: x }));
                setExceptionType(res.data.response);
                setExceptionLookup(recordOptions.sort((a, b) => a.database_type > b.database_type ? 1 : -1));
            });

    }, []);

    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <span>{data.Issue_Name}</span>
            </React.Fragment>
        );
    }

    const footerTemplate = (data) => {
        return ''
    }

    const handleTabChange = (e) => {
        setActiveIndex(e.index);
        if (parseInt(e.index) === 1) {
            isDisabledExceptionBtn(true);
        } else {
            isDisabledExceptionBtn(false);
        }
    }



    const handleResolve = () => {
        setLoading(true);
        if (exceptionSelection.length === 0) {

            swal({
                title: `Alert`,
                text: `Please select atlease one Exception.`,
                icon: "info",
            });

        } else {
            const data = {
                "exception_type": selectedException.database_type,
                "table_name": selectedTableName.table_definition.table_name,
                "ids": exceptionSelection.map(x => x.id)
            }


            try {
                axios.put(`http://172.20.3.113:9009/api/resolve_exception`, data)
                    .then(res => {
                        setLoading(false);
                        const { data: { response } } = res;


                        exceptionSelection.forEach(rec => {
                            const foundRec = exceptionData.find(x => x.id === rec.id);
                            foundRec.is_resolved = "True";
                        });
                        setExceptionData(exceptionData);
                        setExceptionSelection([]);

                        swal({
                            title: `Alert`,
                            text: `Successfully resolved.`,
                            icon: "success",
                        });
                    }).catch(e => {
                        setLoading(false);
                        setExceptionData([]);
                        setExceptionSelection([]);
                        swal({
                            title: `Alert`,
                            text: `exception while resoving. please try again`,
                            icon: "error",
                        });
                    });
            }
            catch {
                setExceptionData(exceptionData);
                setExceptionSelection([]);
            }

        }

    }

    const showCount = (count) => {
        if (count && count > 0) {
            return count;
        }
        return '';
    }

    const noRecordsRender = () => {
        return (
            <div className="p-grid">
                <div className="p-col-12">
                    No records present in the table
                </div>
            </div>
        )
    }
    console.log('setExceptionLookup', exceptionLookup);

    const camelize = (str) => {
        return str;
    }

    const sortColumns = () => {
        const columns = Object.keys(exceptionData && exceptionData[0] || {});
        return columns;
        //.sort();
    };

    const exportColumns = sortColumns().map(col => ({ title: col.replaceAll("_", " "), dataKey: col }));

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    }



    const dynamicColumns = (sortColumns()).map((col, i) => {
        if (col !== 'id' && col !== 'execution_id' &&  col !== 'Execution Id') {
            return <Column key={col} field={col} header={titleCase(col)}
                headerStyle={{ width: '250px' }} />;
        }
    });
    const dynamicColumnsResolved = (sortColumns()).map((col, i) => {
        if (col !== 'id' && col !== 'is_resolved' && col !== 'execution_id' && col !== 'Execution Id') {
            return <Column key={col} field={col} header={titleCase(col)} headerStyle={{ width: '250px' }} />;
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
        exceptionData.forEach(p => _expandedRows[`${p.ide}`] = true);

        setExceptionData(_expandedRows);
    }

    const collapseAll = () => {
        setExpandedRows(null);
    }



    const rowExpansionTemplate = (data) => {
        const { id } = data;
        const { row_exception_details } = originalData.find(x => x.id === id);
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
            const worksheet = xlsx.utils.json_to_sheet(exceptionData);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'exceptionData');
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
            {exceptionData && exceptionData.length > 0 &&
                <Button type="button" icon="pi pi-filter"
                    onClick={exportExcel}
                    style={{ width: '120px', float: 'right' }}
                    className="p-button-info p-ml-auto"
                    data-pr-tooltip="Selection Only" >Export Excel</Button>
            }
            <h1 className="p-offset-1 mb-exception-head">Exceptions</h1>

            <div className="p-grid">
                <div className="p-offset-1 p-col-2">
                    <Dropdown
                        className="p-mb-2 exception-input w-100"
                        value={selectedTranche}
                        options={tranchName}
                        onChange={handleTrancheChange}
                        //  disabled={disableExceptionBtn}
                        optionLabel="flight_name"
                        placeholder="Select a flight" />
                </div>
                <div className="p-col-2">
                    <Dropdown
                        className="p-mb-2 exception-input w-100"
                        value={selectedException}
                        options={exceptionLookup}
                        onChange={handleExceptionChange}
                        //   disabled={disableExceptionBtn}
                        optionLabel="database_type"
                        placeholder="Select an Exception" />
                </div>

                <div className="p-col-2">
                    <Dropdown
                        className="p-mb-2 exception-input w-100"
                        value={selectedTableName}
                        options={selectedTableNameLookup}
                        onChange={handleTableChange}
                        disabled={!selectedException}
                        optionLabel="table_definition.table_name"
                        placeholder="Select a Table" />
                </div>

                <div className="p-col-2">
                    <Button
                        //  disabled={disableExceptionBtn}
                        label="Show Exceptions"
                        onClick={handleShowException}
                        className="p-button-outlined p-button-help btn-show-exception" />
                </div>
            </div>

            {/* Tab View */}
            {selectedTranche && selectedTableName && selectedException && exceptionData &&
                <div className="p-grid mt-exception-table">
                    <div className="p-offset-1">
                        <div className="card">
                            <TabView activeIndex={activeIndex} onTabChange={(e) => handleTabChange(e)}>
                                <TabPanel header={`Unresolved ${showCount((exceptionData || []).filter(x => x.is_resolved === 'False').length)}`}>
                                    {noRecordsfound ?
                                        <div className="p-grid no-records">
                                            <div className="p-col-12">
                                                No records present in the table
                                            </div>
                                        </div>
                                        :
                                        <React.Fragment>
                                            {exceptionData && exceptionData.length > 0 ?
                                                <div className="p-grid">

                                                    <div className="p-col-4">
                                                        <span>Exceptions Selected {!exceptionSelection ? 0 : exceptionSelection.length}</span>
                                                    </div>

                                                    <div className="p-offset-5 p-col-3">
                                                        <Button
                                                            label="Resolve"
                                                            className="p-button-help btn-float-right"
                                                            onClick={handleResolve} />
                                                    </div>

                                                </div> : ''}
                                            <div className="p-grid">
                                                <div className="p-col-12">
                                                    <DataTable
                                                        scrollable style={{ width: '1200px' }}
                                                        scrollHeight="450px"
                                                        ref={dt}
                                                        dataKey="id"
                                                        key={`unresolved-${exceptionSelection.length}-newSet-${(exceptionData || []).filter(x => x.is_resolved === 'False').length}`}
                                                        loading={loading}
                                                        expandedRows={expandedRows}
                                                        onRowToggle={(e) => setExpandedRows(e.data)}
                                                        onRowExpand={onRowExpand}
                                                        onRowCollapse={onRowCollapse}
                                                        rowExpansionTemplate={rowExpansionTemplate}
                                                        className="w-100"
                                                        value={(exceptionData || []).filter(x => x.is_resolved === 'False')}
                                                        paginator
                                                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                                                        rows={10}
                                                        rowsPerPageOptions={[10, 15, 20]}
                                                        paginatorLeft={paginatorLeft}
                                                        paginatorRight={paginatorRight}
                                                        selection={exceptionSelection}
                                                        onSelectionChange={e => { setExceptionSelection(e.value) }}
                                                    >
                                                        <Column expander style={{ width: '3em' }} />
                                                        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                                                        {exceptionData && exceptionData.length > 0 ?
                                                            dynamicColumns :
                                                            <Column key={exceptionData.id} field="fund_name" header="" />
                                                        }

                                                    </DataTable>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }
                                </TabPanel>
                                <TabPanel header={`Resolved ${showCount((exceptionData || []).filter(x => x.is_resolved === 'True').length)}`}>
                                    {noRecordsfound ?
                                        <div className="p-grid no-records">
                                            <div className="p-col-12">
                                                No records present in the table
                                            </div>
                                        </div> :
                                        <div className="p-grid">
                                            <div className="p-col-12">
                                                <div className="card">
                                                    <DataTable
                                                        value={(exceptionData || []).filter(x => x.is_resolved === 'True')}
                                                        scrollable style={{ width: '1200px' }}
                                                        scrollHeight="450px"
                                                        paginator
                                                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                                                        rows={10}
                                                        expandedRows={expandedRows}
                                                        onRowToggle={(e) => setExpandedRows(e.data)}
                                                        onRowExpand={onRowExpand}
                                                        onRowCollapse={onRowCollapse}
                                                        rowExpansionTemplate={rowExpansionTemplate}
                                                        rowsPerPageOptions={[10, 15, 20]}
                                                        paginatorLeft={paginatorLeft}
                                                        paginatorRight={paginatorRight}>
                                                        <Column expander style={{ width: '3em' }} />
                                                        {dynamicColumnsResolved}
                                                    </DataTable>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </TabPanel>
                            </TabView>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default EXCEPTION;

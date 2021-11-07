import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { confirmDialog } from 'primereact/confirmdialog';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert';

const File = () => {
  const userDetails = useSelector(state => state.userDetails);
  const [activeIndex, setActiveIndex] = useState(1);

  const [filenameSelection, setFilenameSelection] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tranchData, setTranchData] = useState([]);
  const [tableDataDD, setTableDataDD] = useState([]);
  const [displayBasic, setDisplayBasic] = useState(false);
  const [position, setPosition] = useState('center');
  const [selectedTranch, setselectedTranch] = useState('');
  const [selectedTable, setselectedTable] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [fileLocation, setFileLocation] = useState('');
  const [fileId, setFileId] = useState('');
  const [editedRow, setEditedRow] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);

  const dialogFuncMap = {
    'displayBasic': setDisplayBasic,
  }


  const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
  const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  }

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  }

  const handleFileSave = async (name) => {
  
    let data = {
     
      flight_name: selectedTranch,
      table_name: selectedTable,
      file_name: fileName,
      file_description: fileDescription,
      file_location: fileLocation,
      is_processed: false,
      is_loaded_into_target: false,
      created_by: userDetails.name,
      created_on: new Date(),
    };
    if(fileId){
      data = {
         ...editedRow,
         ...data
      }

    }

    const response = fileId ? await axios.put(`http://172.20.3.113:9009/api/file_processor`, [data]) :
     await axios.post(`http://172.20.3.113:9009/api/file_processor`, [data]);

    if (response && response.status === 200) {
      swal('Data updated successfully', '', "success");
      setselectedTranch('');
      setselectedTable('');
      setFileName('');
      setFileDescription('');
      setFileLocation('');
      setFileId('');
      setEditedRow(null);
    } else {
      swal('Something went wrong', '', 'error');
    }
    onHide(name);
  }

  const renderFooter = (name) => {
    return (
      <div>
        <Button type="submit" label={fileId ? 'Update' : 'Create'}  
        onClick={() => handleFileSave(name)} autoFocus />
        { fileId ? 
         <p>{`Flight created by ${editedRow.created_by} on ${moment(editedRow.created_on).format('MM-DD-YYYY')} `}</p> : ''}
      </div>
    );
  }

  const onTranchChange = (e) => {
    
    setselectedTranch(e.value);
  }

  const onTableChange = (e) => {
    setselectedTable(e.value);
  }


  useEffect(() => {
    setActiveIndex(0);
    loadTabledata();
    loadDDvalues();

  }, []);

  const loadTabledata = () => {
    setLoading(true)

    axios.get(`http://172.20.3.113:9009/api/file_processor`)
      .then(res => {
        const tableData = res.data.response;
        tableData.forEach(rec => {
          rec.is_processed = rec.is_processed ? 'Yes' : 'No';
          rec.is_loaded_into_target = rec.is_loaded_into_target ? 'Yes' : 'No';
        })
        setTableData(tableData);
        console.log('table data ==>', tableData);
        setLoading(false);
      })
  }

  const loadTranches = () => {
    axios.get(`http://172.20.3.113:9009/api/flight`)
      .then(res => {
        const tranchData = res.data.response;
        setTranchData(tranchData);
        console.log('tranche data ==>', tranchData);
      })
  }

  const loadTabledataforDD = () => {

    axios.get(`http://172.20.3.113:9009/api/all_tables`)
      .then(res => {
        let tableDataDD = res.data.response;
        tableDataDD =  tableDataDD.filter(x => x.table_definition.table_name !== "reconciliation");
        setTableDataDD(tableDataDD);
        setLoading(false);
        console.log('table data DD ==>', tableDataDD);
      })
  }


  const exportExcel = () => {
    import('xlsx').then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(tableData);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAsExcelFile(excelBuffer, 'tableData');
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



  const loadDDvalues = () => {
    loadTranches();
    loadTabledataforDD();
  }

  const editPMOData = (rowData, e) => {
    console.log('dataset', rowData);
    //e.stopImmediatePropagation();
    //
    setDisplayBasic(true);
    setselectedTranch(rowData.flight_name);
    setselectedTable( rowData.table_name);
    setFileName(rowData.file_name);
    setFileDescription(rowData.file_description);
    setFileLocation(rowData.file_location);
    setFileId(rowData.file_id);
    setEditedRow(rowData);
    // selectedTranch
    // selectedTable
    // fileName
    // fileDescription
    // fileLocation
  }

  
  const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
          <img alt="Pin_Blank" src="Pin_Blank.png" className="" height="20" style={{ width: '15px' }} 
          onClick={() => editPMOData(rowData)}
          />
        </React.Fragment>
    );
  }
  const acceptFunc = () => {
 
   const records = filenameSelection.map(x => x.file_id);
   const payload = {
    ids: records
   };
    axios.delete(`http://172.20.3.113:9009/api/file_processor`,  { data: payload })
    .then(res => {
      swal(res.data.response, '', "success");
      loadTabledata();
      setFilenameSelection([])
    }).catch(ex =>    swal('some thing went wrong.', '', "error"))

  }
  const rejectFunc = () => {}

console.log('filenameSelection', filenameSelection);
  return (
    <div id="file" >
      <div className="p-grid p-col-12">
      <h1 className="p-offset-1 p-col-2 mb-exception-head">File Setup</h1>
      <div className="p-offset-7 p-col-2">
          <Button
            label="Add File"
            className="p-button-outlined p-button-help btn-add-exception"
            onClick={() => onClick("displayBasic", loadDDvalues)}
          />
           <Button
            style={{ marginLeft: 10 }}
            label="Delete"
            disabled={filenameSelection.length === 0}
            className="p-button-outlined p-button-help btn-delete-flight"
            onClick={(e) => {
              confirmDialog({
                message: 'Are you sure you want to delete records?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => acceptFunc(),
                reject: () => rejectFunc()
            });
            }}
          />
        </div>
        </div>
      <div className="p-grid">
        
        {tableData && tableData.length > 0 &&
          <Button type="button" icon="pi pi-filter" 
            onClick={exportExcel} 
            style={{ width: '120px', float: 'right', marginRight: 20 }}
            className="p-button-info p-ml-auto"
             data-pr-tooltip="Selection Only" >Export Excel</Button>
        }
      </div>
      <form noValidate
        onSubmit={e => {
          e.preventDefault();
          console.log("submission done");
          return false;
        }}
      >
        <Dialog
          header="File Setup"
          visible={displayBasic}
          style={{ width: "25vw" }}
          footer={renderFooter("displayBasic")}
          onHide={() => { onHide("displayBasic"); setFileId(''); setEditedRow(null)}}
        >
          <div className="p-fluid" id="addFile">
            <div className="p-field p-grid">
              <label htmlFor="tranch" className="p-col-fixed" style={{ width: '150px' }}>Select Flight</label>
              <Dropdown  required 
              optionValue="flight_name" value={selectedTranch} 
              options={tranchData} onChange={onTranchChange} optionLabel="flight_name" placeholder="Select a Flight" style={{ 'width': '184px', 'marginLeft': '8px' }} />
            </div>
            <div className="p-field p-grid">
              <label htmlFor="table" className="p-col-fixed" style={{ width: '150px' }}>Select Table</label>
              <Dropdown required optionValue="table_definition.table_name" value={selectedTable} options={tableDataDD} onChange={onTableChange} optionLabel="table_definition.table_name" placeholder="Select a Table" style={{ 'width': '184px', 'marginLeft': '8px' }} />
            </div>
            <div className="p-field p-grid">
              <label htmlFor="filename" className="p-col-fixed" style={{ width: '150px' }}>File Name</label>
              <div className="p-col-fixed" style={{ width: '200px' }}>
                <InputText id="filename" placeholder="Enter File Name" required minLength="5" type="text" 
                value={fileName} onChange={(e) => setFileName(e.target.value)} />
              </div>
            </div>
            <div className="p-field p-grid">
              <label htmlFor="filedesc" className="p-col-fixed" style={{ width: '150px' }}>File Description</label>
              <div className="p-col-fixed" style={{ width: '200px' }}>
                <InputText id="filedesc" placeholder="Enter File Description" required minLength="5" type="text" value={fileDescription} onChange={(e) => setFileDescription(e.target.value)} />
              </div>
            </div>
            <div className="p-field p-grid">
              <label htmlFor="fileloc" className="p-col-fixed" style={{ width: '150px' }}>File Location</label>
              <div className="p-col-fixed" style={{ width: '200px' }}>
                <InputText id="fileloc" placeholder="Enter File Location" required minLength="5" type="text" value={fileLocation} onChange={(e) => setFileLocation(e.target.value)} />
              </div>
            </div>
          </div>
        </Dialog>
      </form>
      <div className="p-grid mt-exception-table">
        <div className="p-offset-1">
          <div className="p-col-12 card">
            <div className="p-grid">
              <div className="p-col-12">
                <DataTable value={tableData}
                id="FileTable"
                scrollable  style={{ width: '1250px', textalign: 'left' }} 
                scrollHeight="350px"
                  className="p-datatable-customers"
                  dataKey="file_id" rowHover
                  //globalFilter={globalFilter}
                  selection={filenameSelection}
                  onSelectionChange={(e) => {
                    setFilenameSelection(e.value);
                  }}
                  paginator rows={10} emptyMessage="No Files found" 
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                  rowsPerPageOptions={[10, 25, 50]}>
                  <Column
                    selectionMode="multiple"
                    headerStyle={{ width: "50px", textAlign: 'left' }}
                  ></Column>
                  <Column
                    key={tableData.file_id}
                    field="file_name"
                    header="File Name"
                    headerStyle={{ width: '350px', textAlign: 'left' }}
                  ></Column>
              
                  <Column
                    key={tableData.file_id}
                    field="file_location"
                    header="File Location"
                    headerStyle={{ width: '600px' }}
                  ></Column>
                  <Column
                    key={tableData.file_id}
                    field="table_name"
                    header="Table Name"
                    headerStyle={{ width: '250px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis' }}
                  ></Column>
                   <Column
                    key={tableData.file_id}
                    field="is_processed"
                    header="Source Loaded"
                    headerStyle={{ width: '150px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis' }}
                  ></Column>
                   <Column
                    key={tableData.file_id}
                    field="is_loaded_into_target"
                    header="Target loaded"
                    headerStyle={{ width: '150px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis' }}
                  ></Column>

                      <Column
                    key={tableData.file_id}
                    field="created_by"
                    header="Created By"
                    headerStyle={{ width: '250px' }}
                  ></Column>
                      <Column
                    key={tableData.file_id}
                    field="created_on"
                    header="Created on"
                    headerStyle={{ width: '200px' }}
                  ></Column>
                     <Column body={actionBodyTemplate} headerStyle={{ width: '70px' }}></Column>
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default File;
import React, { useState, useEffect, useRef } from 'react';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { classNames } from 'primereact/utils';
import { InputNumber  } from 'primereact/inputnumber';
import swal from 'sweetalert';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import {minDate, maxDate} from '../utils/dateCalculator'
import { useSelector } from 'react-redux';
import { InputTextarea } from 'primereact/inputtextarea';
import moment from 'moment';
import axios from 'axios';
import { min } from 'moment';
import { cloneDeep } from 'lodash';
import PMO_EDITS_COLUMNS from '../Constants/pmo-constants';
import {titleCase, numberWithCommas, numberWithCommasAmount} from '../utils/dateCalculator';
  

const PmoDashboard = () => {
  
  let emptyPMOData = {
    id: null,
    customerName:"", 
    startDate: moment(), 
    liveDate:moment(), 
    exchange:"", 
    holding:0, 
    pmo:"", 
    totalClients:0, 
    devCore:0,
    qa:0,
    convert:0,
    nav:0,
    tax:0,
    legal:0,
    marketData:0,
    treasury:0,
    fnd:0,
    compliance:0,
    risk:0,
    referenceData:0,
    comment: ""
  };

    // TODO:
    // Add Save Button after editing the row
    // Add Calendar besides As of Date -> (Valid Dates -> b/w Current Date and Start Date) => After valid date selection table data should be pulled from DB for that selected Date
    // Cell Coloring -> 100% -> Green | >50% but <100% -> Amber | 50%< -> Red
    // Conversion should be the mean of all the %values and apply same color code which is used above
    // Read Only -> Fund Name
  const [customer, setCustomer] = useState(null);
  const [pmoDataSet, setPMODataSet] = useState([]);
  const [tradeDate, setTradeDate] = useState(null);
  const [isComment, setIsComment] = useState(true);
  const [liveDate, setLiveDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [addComment, handleAddCommment] = useState('');
  const [isReq, setIsReq] = useState(false);
  const [saveDate, setSaveData] = useState({});
  const [displayModal, setDisplayModal] = useState(false);
  const [editingRows, setEditingRows] = useState({});
  // new
  const [productDialog, setProductDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newPMOData, setNewPMOData] = useState(emptyPMOData);
  const [newLiveDate, setNewLiveDate] = useState(null);
  const [meanValue, setMeanValue] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [dateSelected, setDateSelected]= useState('');

  const dt = useRef(null);
  // const customers = [
  //   { name: 'BlackRock', id: '0001' },
  //   { name: 'Blackstone', id: '0005' }
  // ];

  const retrieveIssuerDropdownAPI = () => {
    
      axios.get(`http://172.20.3.113:9009/api/fund_issuer`)
      .then(res => {
          const issuerData = res.data.response;
          const dataLookup = issuerData.filter((v,i,a)=>a.findIndex(t=>(t.fund_issuer_name === v.fund_issuer_name))===i);
         setCustomers(
          dataLookup.map(x => ({ name: x.fund_issuer_name, id: x.id})));
          
      });
  }
  useEffect(() => {
    retrieveIssuerDropdownAPI();
  }, []);

  const pmoData = {
      "0001":[
        {id: 1,customerName:"IShares Morningstar Growth ETF", startDate:"2021-07-22", endDate:"2022-02-24", liveDate:"2022-02-24", exchange:"XNYS", holding:800, marketValue:'$50,000,00', totalClients:4, devCore:70,qa:80,convert:'',nav:80,tax:100,legal:100,marketData:100,kyc:'Yes',treasury:100,fnd:65,compliance:100,risk:75,referenceData:100,comment:'' },
        {id: 2,customerName:"IShares Russell 1000 Growth ETF", startDate:"2021-06-25", endDate:"2021-12-25", liveDate:"2021-12-25", exchange:"XNYS", holding:707, marketValue:'$65,000,00', totalClients:1, devCore:40,qa:90,convert:'',nav:90,tax:100,legal:100,marketData:100,kyc:'Yes',treasury:100,fnd:100,compliance:100,risk:100,referenceData:100,comment:'' },
      ],
      "0005":[{id: '5',customerName:"IShares Morningstar Growth ETF", startDate:"2021-07-22", endDate:"2022-02-24", liveDate:"2022-02-24", exchange:"XNYS", holding:800, marketValue:'$67,000,00', totalClients:4, devCore:70,qa:80,convert:'',nav:80,tax:100,legal:100,marketData:100,kyc:'No',treasury:100,fnd:65,compliance:100,risk:75,referenceData:100,comment:'' }]
  };

  const onDateChange = (e) => {
    setTradeDate(e.value);
    const dateSel =  dateFormatConvertor(e.value);
    setDateSelected(dateSel);
    fetchDashboardData(dateSel, customer.name);

  }

  const dateFormatConvertor = (dd) => {
    return  new Date(dd).getFullYear().toString() + "-"+
    (new Date(dd).getMonth() + 1 ).toString()+ "-" +
     new Date(dd).getDate().toString();
  }
  const dateFormatConvertorDisplay = (dd) => {
    return  (new Date(dd).getMonth() + 1 ).toString()+ "/" +
     new Date(dd).getDate().toString() + "/" + new Date(dd).getFullYear().toString()
  }

  const onCustomerChange = (e) => {
    setCustomer(e.value);
    const now = moment().toString();
    setTradeDate(new Date(now));
   
    const dateSel  = new Date().getFullYear() .toString() + "-"+
                 (new Date().getMonth() + 1 ).toString()+  "-"+
                  new Date().getDate().toString();
    setDateSelected(dateSel);            
    fetchDashboardData(dateSel, e.value.name);
  
  };

  const fetchDashboardData = (selectedDate, issuerName) => {
    axios.get(`http://172.20.3.113:9009/api/pmo_dashboard?date=${selectedDate}&fund_issuer_name=${issuerName}`)
      .then(res => {
      
          const pmoData = res.data.response;
          pmoData.forEach(rec => {
            rec.market_value = numberWithCommasAmount(rec.market_value);
            rec.number_of_holdings = numberWithCommas(rec.number_of_holdings);
          });
          setPMODataSet(pmoData);
          
      });
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    
    const body = cloneDeep(newPMOData);
    delete body.id;
    if(body.market_value){
    body.market_value =  body.market_value.replaceAll('$','').replaceAll(',','');
    }

body.created_by = "cfuser";
body.created_on = new Date().toDateString();



    axios.post(`http://172.20.3.113:9009/api/pmo_dashboard`, [body])
    .then(res => {
      
      //console.log('res', res);
      setProductDialog(false);
      swal('Record successfully saved','Success');
      fetchDashboardData(dateSelected, customer.name);
       
    });
   
    // setSaveData({

    // });
  };

  let minDate = new Date(startDate);
  const getStartMonth = minDate.getMonth();
  const getStartYear = minDate.getFullYear();
  minDate.setMonth(getStartMonth);
  minDate.setFullYear(getStartYear);

  let maxDate = new Date(liveDate);
  const getCloseMonth = maxDate.getMonth();
  const getCloseYear = maxDate.getFullYear();
  maxDate.setMonth(getCloseMonth);
  maxDate.setFullYear(getCloseYear);

  const headerTemplate = (data) => {
   
    return (
        <React.Fragment>
            <span className="rowHeaderTitle">{`      ${data.flights}   `}</span>
        </React.Fragment>
    );
  }

  const footerTemplate = (data) => {
        return "";
  }


  const convert = (rowData) => {
    let mean = 0;
    const {devCore,qa,nav,tax,legal, marketData, treasury,fnd,  compliance, risk, referenceData} = rowData;
    const total = parseInt(devCore) + parseInt(qa)+parseInt(nav)+parseInt(tax)+parseInt(legal)+parseInt(marketData)+parseInt(fnd)+parseInt(treasury)+parseInt(compliance)+parseInt(risk)+parseInt(referenceData);
    mean = parseInt(total/11);
    setMeanValue(mean);
    
    const stockClassName = classNames({
      'red': parseInt(meanValue) < 50,
      'amber': parseInt(meanValue) >= 50 && parseInt(meanValue) < 100,
      'green': parseInt(meanValue) === 100
    });

    return (
        <div className={stockClassName}>
            {meanValue}
        </div>
    );
  }


  // useEffect(() => {
  //   setPMODataSet(pmoData)
  // }, [])

  const w10 = {
    width:'50%'
  }

  const saveProduct = () => {
    const selectedCustomerDropDownId = customer.id;
    setSubmitted(true);
    setProductDialog(false);
}

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  }

  const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
          <img alt="Pin_Blank" src="Pin_Blank.png" className="" height="25" style={{ float: 'right' }} 
          onClick={() => editPMOData(rowData)}
          />
        </React.Fragment>
    );
  }

    
  const productDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
     
           <Button label="Save" type="submit" icon="pi pi-check" className="p-button-text"
            onClick={handleSubmit} />
        
    </React.Fragment>
  );

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < pmoData[customer.id].length; i++) {
        if (parseInt(pmoDataSet[i].id) === parseInt(id)) {
            index = i;
            break;
        }
    }

    return index;
  }

  const editPMOData = (dataSet) => {
    setNewPMOData({...dataSet});
    setProductDialog(true);
  }

  const calculateConversionValue = (_pmoData) => {
  
    let result = 0;
    if(_pmoData) {
       result = 
       (_pmoData.qa + 
        _pmoData.nav +
        _pmoData.legal+
        _pmoData.compliance+
        _pmoData.risk+
        _pmoData.treasury+
        _pmoData.reference_data+
        _pmoData.market_data+
        _pmoData.tax+
        _pmoData.kyc
        )/10;
    };
    _pmoData.conversion_percentage = result;
  
     if(parseInt(result) === 0){
      _pmoData.fund_conversion_status = 'To Be Started'
     } else if( parseInt(result) < 100){
      _pmoData.fund_conversion_status = 'In Progress';
     } else if(parseInt(result) === 100){
      _pmoData.fund_conversion_status = 'Completed'
     }
     setNewPMOData(_pmoData);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    console.log('value', e);
    let _pmoData = {...newPMOData};
    _pmoData[`${name}`] = val;

    setNewPMOData(_pmoData);
    calculateConversionValue(_pmoData);
   // console.log('onInputNumberChange', _pmoData);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _pmoData = {...newPMOData};
    _pmoData[`${name}`] = val;

    setNewPMOData(_pmoData);
  }

    // Color Coding for columns
    const risk = (rowData) => {
      const stockClassName = classNames({
        'red': parseInt(rowData.risk) < 50,
        'amber': parseInt(rowData.risk) >= 50 && parseInt(rowData.risk) < 100,
        'green': parseInt(rowData.risk) === 100
      });
  
      return (
          <div className={stockClassName}>
              {rowData.risk}
          </div>
      );
    }
  
    const compliance = (rowData) => {
      const stockClassName = classNames({
        'red': parseInt(rowData.compliance) < 50,
        'amber': parseInt(rowData.compliance) >= 50 && parseInt(rowData.compliance) < 100,
        'green': parseInt(rowData.compliance) === 100
      });
  
      return (
          <div className={stockClassName}>
              {rowData.compliance}
          </div>
      );
    }
  
    const fnd = (rowData) => {
      const stockClassName = classNames({
        'red': parseInt(rowData.fnd) < 50,
        'amber': parseInt(rowData.fnd) >= 50 && parseInt(rowData.fnd) < 100,
        'green': parseInt(rowData.fnd) === 100
      });
  
      return (
          <div className={stockClassName}>
              {rowData.fnd}
          </div>
      );
    }
  
    const treasury = (rowData) => {
      const stockClassName = classNames({
        'red': parseInt(rowData.treasury) < 50,
        'amber': parseInt(rowData.treasury) >= 50 && parseInt(rowData.treasury) < 100,
        'green': parseInt(rowData.treasury) === 100
      });
  
      return (
          <div className={stockClassName}>
              {rowData.treasury}
          </div>
      );
    }
  
    const marketData = (rowData) => {
      const stockClassName = classNames({
        'red': parseInt(rowData.marketData) < 50,
        'amber': parseInt(rowData.marketData) >= 50 && parseInt(rowData.marketData) < 100,
        'green': parseInt(rowData.marketData) === 100
      });
  
      return (
          <div className={stockClassName}>
              {rowData.marketData}
          </div>
      );
    }
  
    const legal = (rowData) => {
      const stockClassName = classNames({
        'red': parseInt(rowData.legal) < 50,
        'amber': parseInt(rowData.legal) >= 50 && parseInt(rowData.legal) < 100,
        'green': parseInt(rowData.legal) === 100
      });
  
      return (
          <div className={stockClassName}>
              {rowData.legal}
          </div>
      );
    }
  
    const tax = (rowData) => {
      const stockClassName = classNames({
        'red': parseInt(rowData.tax) < 50,
        'amber': parseInt(rowData.tax) >= 50 && parseInt(rowData.tax) < 100,
        'green': parseInt(rowData.tax) === 100
      });
  
      return (
          <div className={stockClassName}>
              {rowData.tax}
          </div>
      );
    }
  
    const nav = (rowData) => {
      const stockClassName = classNames({
        'red': parseInt(rowData.nav) < 50,
        'amber': parseInt(rowData.nav) >= 50 && parseInt(rowData.nav) < 100,
        'green': parseInt(rowData.nav) === 100
      });
  
      return (
          <div className={stockClassName}>
              {rowData.nav}
          </div>
      );
    }
  

    const qa = (rowData) => {
      const stockClassName = classNames({
        'red': parseInt(rowData.qa) < 50,
        'amber': parseInt(rowData.qa) >= 50 && parseInt(rowData.qa) < 100,
        'green': parseInt(rowData.qa) === 100
      });

      return (
          <div className={stockClassName}>
              {rowData.qa}
          </div>
      );
    }

    const devCore = (rowData) => {
      const stockClassName = classNames({
        'red': parseInt(rowData.devCore) < 50,
        'amber': parseInt(rowData.devCore) >= 50 && parseInt(rowData.devCore) < 100,
        'green': parseInt(rowData.devCore) === 100
      });

      return (
          <div className={stockClassName}>
              {rowData.devCore}
          </div>
      );
    }

    const referenceData = (rowData) => {
      const stockClassName = classNames({
        'red': parseInt(rowData.referenceData) < 50,
        'amber': parseInt(rowData.referenceData) >= 50 && parseInt(rowData.referenceData) < 100,
        'green': parseInt(rowData.referenceData) === 100
      });

      return (
          <div className={stockClassName}>
              {rowData.referenceData}
          </div>
      );
    }

   // PMO_EDITS_COLUMNS.map(rec => renderControl(rec))
    const sortColumns = () => {
      const columns = Object.keys(pmoDataSet && pmoDataSet[0] || {});
      return columns.sort();
  };

  const bodyRender = (data, props) => {
   // console.log('dbField', props);
    const value = data[props.field];
    const stockClassName = classNames({
      'red': parseInt(value) < 50,
      'amber': parseInt(value) >= 50 && parseInt(value) < 100,
      'green': parseInt(value) === 100
    });

    return (
        <div className={stockClassName}>
            {value}
        </div>
    );
  }

    const dynamicColumns = (PMO_EDITS_COLUMNS.map((col, i) => {
      if(col.type === "text"){
          return( <Column key={col.columnText} field={col.dbField} header={col.columnText}
              headerStyle={{ width: col.width || '250px' }} />)
      } else if(col.type === "date"){
        return( <Column key={col.columnText} field={col.dbField} header={col.columnText}
            headerStyle={{ width: '250px' }} />)
    } else if(col.type === "number") {
      if(col.redFlag){
      return( <Column key={col.columnText} field={col.dbField} header={col.columnText}
      body={bodyRender}
      headerStyle={{ width: col.width || '140px' }} />)
      } else {
        return( <Column key={col.columnText} field={col.dbField} header={col.columnText}
          headerStyle={{ width: '250px' }} />)
      }
      }
      
  }));


  
  const renderControl = (rec) => {

    if(rec.type === "date"){
    
      const now = moment(newPMOData[rec.dbField]).toString();
      const dd1 = new Date(now);
     
      return(
        <div className="p-field">
        <label htmlFor={rec.dbField}>{rec.columnText}</label>
        <Calendar  
          id={rec.dbField}
          autoFocus
          className="w-100"
          dateFormat="mm/dd/yy"
          value={dd1}
          onChange={(e) => onInputNumberChange(e.value, rec.dbField)}
          showIcon />
    </div>
      )

    } else if(rec.type === "number") {
      return(
        <div className="p-field">
        <label htmlFor={rec.dbField}>{rec.columnText}</label>
        <InputNumber key={`dbFied-${newPMOData[rec.dbField]}`} id={rec.dbField} 
        readOnly={rec.readOnly}
        disabled={rec.readOnly}
        value={newPMOData[rec.dbField]} 
            onValueChange={(e) => onInputNumberChange(e, rec.dbField)} integeronly />
    </div>
      )

    } else if(rec.type === "text"){
      return(
        <div className="p-field">
        <label htmlFor={rec.dbField}>{rec.columnText}</label>
        <InputText  key={`dbFiedtext-${newPMOData[rec.dbField]}`}
        readOnly={rec.readOnly}
        disabled={rec.readOnly}
         id={rec.dbField} defaultValue={newPMOData[rec.dbField]} 
            onBlur={(e) => onInputChange(e, rec.dbField)}  />
            {/* {newPMOData[rec.dbField]} */}
    </div>
      )
    }

  }

  const exportColumns = PMO_EDITS_COLUMNS.map(col => ({ title: col.columnText, dataKey: col.dbField }));

    const exportCSV = (selectionOnly) => {
            dt.current.exportCSV({ selectionOnly });
    }

    const exportExcel = () => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(pmoDataSet);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'pmoDataSet');
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
    <>
      <h1 className="p-ml-5 pmoDashboard" id="">PMO Dashboard</h1>
       {pmoDataSet && pmoDataSet.length > 0 &&
          <Button type="button" icon="pi pi-filter" 
            onClick={exportExcel} 
            style={{ width: '120px', float: 'right'}}
            className="p-button-info p-ml-auto"
             data-pr-tooltip="Selection Only" >Export Excel</Button>
        }
      <div className="p-ml-5 p-grid">
        <div className="p-col-2">
          <Dropdown
              className="w-100"
              value={customer}
              options={customers}
              onChange={onCustomerChange}
              optionLabel="name"
              placeholder="Issuer"
          />
        </div>
        <div className="p-col-2">
          <Calendar 
              id="icon"
              className="w-100"
            //  minDate={minDate}
              //maxDate={maxDate}
              // disabledDates={invalidDates}
              dateFormat="mm/dd/yy"
              value={tradeDate} 
              onChange={(e) => onDateChange(e)} 
              showIcon />
        </div>
      </div>
      <div className="p-ml-5 p-grid">
        <div className="p-col-12">
          <DataTable
            value={pmoDataSet} // Dataset --> Data
            dataKey="id" 
            ref={dt} 
            paginator rows={10} 
            rowsPerPageOptions={[5, 10, 25]}
            resizableColumns 
            columnResizeMode="expand"
            scrollable 
             style={{ width: '100%' }}
                                            dataKey="id"
                                            className="w-100"
                                            scrollHeight="450px"
            
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            groupField="flights"
            rowGroupMode="subheader" 
            rowGroupHeaderTemplate={headerTemplate} // Columns Information
            rowGroupFooterTemplate={footerTemplate}>
               {pmoDataSet && pmoDataSet.length > 0 ?
                  dynamicColumns :
                  <Column key={'no-rec'} field="fund_name" header="" />
              }
            <Column body={actionBodyTemplate} headerStyle={{ width: '150px' }}></Column>
          </DataTable>
        </div>
      </div>
      <Dialog 
        visible={productDialog} 
        style={{ width: '450px' }}
        header="PMO Details" 
        modal 
        className="p-fluid" 
        footer={productDialogFooter} 
        onHide={hideDialog}>
          <form onSubmit={saveProduct}>
            {
              PMO_EDITS_COLUMNS.map(rec => renderControl(rec))
            }
            
          </form>
      </Dialog>
    </>
  );
};

export default PmoDashboard;
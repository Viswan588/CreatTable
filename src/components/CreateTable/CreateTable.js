import React, { useState, useEffect, cloneElement } from 'react';
import { Button } from 'primereact/button';
import fetchExistingTableList from './services/fetchTableList';
import {
  CREATE_TABLE_LABEL,
  table_definition,
  fieldObj,
  source_rulesObj
} from '../../Constants/table-constants';
import CreateButton from './CreateButton';
import TableNameSelection from './TableNameSelection';
import TableNameDisplay from './TableNameDisplay';
import CreateColumns from './CreateColumns';
import { clone, cloneDeep } from 'lodash';
import TableLocation from './TableLocation';
import CreateTableRules from './CreateTableRules';
import updateDetails from './services/updateDetails';
import swal from 'sweetalert';


const CreateTable = () => {
  const [tableData, setTableData] = useState({});
  const [showCreateTableDialog, setShowCreateTableDialog] = useState(false);
  const [existingTableList, setExistingTableList] = useState([]);
  const [databaseType, setDatabaseType] = useState('');
  const [tableRules, setTableRules] = useState([]);
  const [isExistingTable, setIsExistingTable] = useState(false);
  const [tableStructure, setTableStructure] = useState(null);

  useEffect(async () => {
    const { data } = await fetchExistingTableList();
    setExistingTableList(data.response);
  }, []);

  const handleTableNameCreation = (tableData, database_type, isExisting, selectedTable) => {
    setTableData(tableData);
    setShowCreateTableDialog(false);
    setDatabaseType(database_type);
    const rulesUpdated = [];
    (tableData.source_table_rules || []).forEach(rule => {
      const ruleObj = cloneDeep(rule);
      ruleObj.ruleLocation = 'source';
      rulesUpdated.push(cloneDeep(ruleObj));

    });
    (tableData.target_table_rules || []).forEach(rule => {
      const ruleObj = cloneDeep(rule);
      ruleObj.ruleLocation = 'target';
      rulesUpdated.push(cloneDeep(ruleObj));

    });
    setTableRules(rulesUpdated);
    setIsExistingTable(isExisting);
    setTableStructure(selectedTable);
  }

  const hadleUpdateTableInformation = (fields, tableName) => {
    tableData.fields = cloneDeep(fields);
    setTableData(cloneDeep(tableData));
  }

  const handleUpdateTableLocation = (e) => {
    setDatabaseType(e.value);
  }

  const handleClosedialog = () => setShowCreateTableDialog(false);

  const handleShowCreateTableDialog = () => setShowCreateTableDialog(true);

  const handleAddNewTableRule = () => {
    const tableRuleObj = {
      ruleLocation: '',
      rule_name: ''
    }
    tableRules.push(cloneDeep(tableRuleObj));
    setTableRules(cloneDeep(tableRules));
  }

  const handleTableRuleDelete = (delIndex) => {
    const tableRulesUpdated = tableRules.filter((x, index) => index !== delIndex);
    setTableRules(cloneDeep(tableRulesUpdated));
  }

  const handleTableRuleSelection = (ruleObj, roleIndex) => {
    tableRules[roleIndex] = cloneDeep(ruleObj);
    setTableRules(cloneDeep(tableRules));
  }

  const handleSubmitTableDetails = async() =>  {

    const table_definition = cloneDeep(tableData);
    if(tableRules.find(x => x.ruleLocation === 'source')){
      const sourcRulz = tableRules.filter(x => x.ruleLocation === 'source');
       table_definition.source_table_rules = sourcRulz.map(item => { 
        delete item.ruleLocation; 
        return item; 
    });
    }
    if(tableRules.find(x => x.ruleLocation === 'target')){
      const targetRulz = tableRules.filter(x => x.ruleLocation === 'target');
      table_definition.target_table_rules = targetRulz.map(item => { 
       delete item.ruleLocation; 
       return item; 
   });
   }


   let body ={

   }

   if(isExistingTable){
     body = {
      ...tableStructure,
      updated_by: 'cfuser',
      update_on: new Date().toDateString()
     }
   }

   body = {
      database_type: databaseType,
      table_definition: cloneDeep(table_definition),
      created_by: 'cfuser',
      created_on: new Date().toDateString(),
      // to_load_in_target: false,
      // file_process_sequence: 0
    }
    if(!body.to_load_in_target){
      body.to_load_in_target= false
    }
    if(!body.file_process_sequence){
      body.file_process_sequence= 0
    }
    const { data } = await updateDetails(body, isExistingTable);

    swal(`${data.response}`,``,`success`);
    setTableData('')

    const res = await fetchExistingTableList();
    setExistingTableList(res.data.response);
    setDatabaseType('');
    setTableRules([]);
    setIsExistingTable(false);
    setTableStructure(null);   
    //console.log('final body Obj', body);
  }


  
  return (
    <div id="startJob" >
      <h1 className="p-offset-1 mb-exception-head">{CREATE_TABLE_LABEL}</h1>
      <CreateButton label={CREATE_TABLE_LABEL} handleShowCreateTableDialog={handleShowCreateTableDialog} />
      {tableData && tableData.table_name &&
        <React.Fragment>
          <TableNameDisplay tableName={tableData.table_name} />
         
          <TableLocation databaseType={databaseType} handleUpdateTableLocation={handleUpdateTableLocation} />
          <hr />
         
          <CreateTableRules
            tableData={tableData}
            existingTableList={existingTableList}
            handleAddNewTableRule={handleAddNewTableRule}
            fields={tableData.fields}
            tableRules={tableRules}
            handleTableRuleDelete={handleTableRuleDelete}
            handleTableRuleSelection={handleTableRuleSelection}
          />
           <hr />
          <CreateColumns
            fields={tableData.fields}
            tableName={tableData.table_name}
            hadleUpdateTableInformation={hadleUpdateTableInformation}
            existingTableList={existingTableList}
          />
        </React.Fragment>
      }
      <TableNameSelection
        showCreateTableDialog={showCreateTableDialog}
        handleTableNameCreation={handleTableNameCreation}
        existingTableList={existingTableList}
        handleClosedialog={handleClosedialog}
      />
       <hr />
      {tableData && tableData.table_name &&
        <div style={{ marginLeft: 150, marginTop: 25 }}>
          <Button
            label={'Submit Details'}
            className="p-button-outlined p-button-help btn-add-exception"
            onClick={handleSubmitTableDetails}
          />
        </div>
      }
    </div>
  );
};

export default CreateTable;
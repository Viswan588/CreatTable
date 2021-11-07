import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { cloneDeep } from 'lodash';
import { Dialog } from 'primereact/dialog'
import { Checkbox } from 'primereact/checkbox';
import {
  table_definition,
  fieldObj,
  source_rulesObj
} from '../../Constants/table-constants';


const TableNameSelection = (
  {
    showCreateTableDialog,
    handleClosedialog,
    handleTableNameCreation,
    existingTableList
  }) => {


  const [tableName, setTableName] = useState('');
  const [fromExisting, setFromExisting] = useState('');
  const [editExistingTable, setEditExistingTable] = useState(false);
  const [selectedTable, setSelectedTable] = useState('')

  const handleSaveTableName = () => {
    console.log('on submission')
  };

  const handleTableTypeSelection = (e) => {
    setFromExisting(e.value);
    setTableName('')
  }
  const handleTableName = (e) => {
    setTableName(e.target.value);
  }
  const handleExistingTableSelection = (e) => {
    setSelectedTable(e.target.value);
  }

  const existingTableOptions = (tableList) => {
    return tableList.map(x => ({ id: x.id, tableName: x.table_definition.table_name }))
  }

  const resetDataValues = () => {
    setTableName('');
    setFromExisting('');
    setEditExistingTable(false);
    setSelectedTable('');
  }

  const handleTableNameCreationInternal = () => {
    let table_info = '';
    let database_type = '';
    let isExistingTable= false;
    let tableData = {};
    if (fromExisting === "existing") {
       tableData = existingTableList.find(x => x.table_definition.table_name === selectedTable.tableName);
     console.log('tableData', tableData);
      table_info = cloneDeep(tableData.table_definition);
      if(table_info.table_name === tableName) {
        isExistingTable = true;
      }
      table_info.table_name = tableName;
      database_type = tableData.database_type;
    } else {
      table_info = cloneDeep(table_definition);
      table_info.table_name = tableName;
    }
    handleTableNameCreation(table_info, database_type, isExistingTable, tableData);
    resetDataValues();
  }

  return (

    <Dialog
      visible={showCreateTableDialog}
      style={{ width: '300px' }}
      header="Create Table"
      modal
      className="p-fluid"
      onHide={() => { handleClosedialog(false); resetDataValues(); }}>

      <Dropdown
        className="w-100"
        value={fromExisting}
        options={[{ type: 'Create new Table', value: 'newTable' }, { type: 'Use Existing', value: 'existing' }]}
        onChange={handleTableTypeSelection}
        optionLabel="type"
        placeholder="Please select Table creation Type"
      />
      {fromExisting === 'existing' &&
        <React.Fragment>
          <div style={{ marginTop: '1.5rem' }}>
            <label htmlFor={"existingTableselect"}>Existing Tables</label>
            <Dropdown
              id="existingTableselect"
              className="w-100"
              value={selectedTable}
              options={existingTableOptions(existingTableList)}
              onChange={handleExistingTableSelection}
              optionLabel="tableName"
              placeholder="Please select Table creation Type"
            />
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Checkbox
              className="p-mr-2"
              inputId="editExistingTable"
              checked={editExistingTable}
              onChange={e => {
                setEditExistingTable(e.checked);
                if (e.checked) {
                  setTableName(selectedTable.tableName)
                } else {
                  setTableName('')
                }

              }} />
            <label className="p-mr-2" htmlFor="editExistingTable">Edit Existing Table</label>
          </div>
        </React.Fragment>
      }
      <div style={{ marginTop: '1.5rem' }}>
        {fromExisting &&
          <React.Fragment>
            <label htmlFor={"tableName"}>Table Name</label>
            <InputText
              key={tableName}
              id="tableName" defaultValue={tableName}
              disabled={editExistingTable}
              readOnly={editExistingTable}
              placeholder="Please enter table name."
              onBlur={handleTableName} />
          </React.Fragment>
        }
      </div>
      <div style={{ marginTop: '1.5rem' }}>
        <Button
          label="Create"
          disabled={!tableName}
          onClick={handleTableNameCreationInternal}
        />
      </div>

    </Dialog>

  );
};

export default TableNameSelection;
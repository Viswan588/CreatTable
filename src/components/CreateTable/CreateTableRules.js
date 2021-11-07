import React, { useState, useEffect } from 'react';
import CreateColumn from './CreateColumn';
import { Button } from 'primereact/button';
import { cloneDeep } from 'lodash';
import SourcingRules from './SourcingRules';
import TargetTableRules from './TargetTableRules';

const CreateTableRules = ({ 
    tableData, handleAddNewTableRule, 
    handleTableRuleDelete,
    handleTableRuleSelection,
    existingTableList, fields, tableRules }) => {
    
    return (
        <React.Fragment>
            <div 
            style={{ marginLeft: '30px', marginTop: 10, marginBottom: -15 }}> 
           <b> Table Rules</b>
            </div>
         
            <SourcingRules 
                    rules={tableRules} 
                    existingTableList={existingTableList} 
                    fields={fields} 
                    handleTableRuleDelete={handleTableRuleDelete}
                    handleTableRuleSelection={handleTableRuleSelection}
            />
            {/* <TargetTableRules rules={tableData.target_table_rules} existingTableList={existingTableList} /> */}
            <Button style={{ marginLeft: '60px', marginTop: 20 }}
                label="+ Add Table Rule"
                className="p-button-outlined p-button-help btn-add-exception"
                onClick={handleAddNewTableRule}
            />
        </React.Fragment>
    )
}

export default CreateTableRules;
import React, { useState, useEffect } from 'react';
import CreateColumn from './CreateColumn';
import { Button } from 'primereact/button';
import { cloneDeep, runInContext } from 'lodash';
import TableRule from './TableRule';

const SourcingRules = ({ rules, existingTableList, fields, handleTableRuleDelete, handleTableRuleSelection }) => {

    return (
        <React.Fragment>
            <div style={{ marginLeft: '40px', marginTop: 20, marginBottom: -15 }}> </div>
            {
                (rules || []).filter(x => !x.isDeleted).map((ruleObj, index) => (
                    <TableRule 
                        key={`souringRule-${index}`}
                        ruleObj={ruleObj} 
                        ruleIndex={index} 
                        loca={'source'} 
                        existingTableList={existingTableList}
                        fields={fields}
                        handleTableRuleSelection={handleTableRuleSelection}
                        handleTableRuleDelete={handleTableRuleDelete}
                        
                        />
                ))
            }

        </React.Fragment>
    )
}

export default SourcingRules;
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import SetupRule from './SetupRule';
import { clone, cloneDeep } from 'lodash';


const ColumnSetupRules = ({ 
    dialogColumnSetupRules, 
    handleSetUpRulesCloseDialog, 
    setupRules, 
    existingTableList,
    handleUpdateRules,
    fields,
    setupTargetRules,
    handleTargetUpdateRules
}) => {
    const handleAddNewRule = () => {
        setupRules.push(cloneDeep({ rule_name: '' }));
        handleUpdateRules(setupRules);
    }
    const handleRuleUpdate = (ruleObj, setIndex) => {
        setupRules[setIndex] = cloneDeep(ruleObj);
        handleUpdateRules(setupRules);
    }
    const handleTargetAddNewRule = () => {
        setupTargetRules.push(cloneDeep({ rule_name: '' }));
        handleTargetUpdateRules(setupTargetRules);
    }
    const handleTargetRuleUpdate = (ruleObj, setIndex) => {
        setupTargetRules[setIndex] = cloneDeep(ruleObj);
        handleTargetUpdateRules(setupTargetRules);
    }
    return (
        <Dialog visible={dialogColumnSetupRules}
            style={{ width: '1200px' }}
            header="Setup Rules"
            modal
            className="p-fluid"
            onHide={handleSetUpRulesCloseDialog}>
            <b>Source Rules </b>
            <div>
                {(setupRules.filter(x => !x.isDeleted )).map((rule, index) => (
                    <SetupRule
                        ruleObj={rule}
                        setIndex={index}
                        key={`rule-${index}`}
                        existingTableList={existingTableList}
                        handleRuleUpdate={handleRuleUpdate}
                        fields={fields}
                    />
                ))}
            </div>
            <div className="p-col-3">
                <Button style={{ marginLeft: '60px', marginTop: 20 }}
                    label=" + Add Source Rule"
                    className="p-button-outlined p-button-help btn-add-exception"
                    onClick={handleAddNewRule}
                />
            </div>
            <div> <b>Target Rules </b> </div>
            <div>
                {(setupTargetRules.filter(x => !x.isDeleted )).map((rule, index) => (
                    <SetupRule
                        ruleObj={rule}
                        setIndex={index}
                        key={`rule-${index}`}
                        existingTableList={existingTableList}
                        handleRuleUpdate={handleTargetRuleUpdate}
                        fields={fields}
                    />
                ))}
            </div>
            <div className="p-col-3">
                <Button style={{ marginLeft: '60px', marginTop: 20 }}
                    label=" + Add Target Rule"
                    className="p-button-outlined p-button-help btn-add-exception"
                    onClick={handleTargetAddNewRule}
                />
            </div>
        </Dialog>
    )
}

export default ColumnSetupRules;
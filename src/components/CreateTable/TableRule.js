import React, { useState, useEffect } from 'react';
import CreateColumn from './CreateColumn';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { cloneDeep } from 'lodash';
import { MultiSelect } from 'primereact/multiselect';
import { locationOptions, tableRuleOptions } from './../../Constants/table-constants';

const existingTableOptions = (tableList) => {
    return tableList.map(x => ({ option: x.table_definition.table_name, value: x.table_definition.table_name }))
}

const referenceFieldsOption = (tableList, tableName) => {
    const rec = tableList.find(x => x.table_definition.table_name === tableName);
    return rec ? rec.table_definition.fields.map(
        x => ({ option: x.field_name, value: x.field_name })
    ) : [];
}

const currentFieldsOption = (fields) => {
    return fields && fields.length > 0 ? fields.map((
        x => ({ option: x.field_name, value: x.field_name })
    )) : [];
}

const TableRule = ({ ruleObj, ruleIndex, loca,
    existingTableList,
    fields,
    handleTableRuleDelete,
    handleTableRuleSelection }) => {

    const handleReferenceSelection = () => {
        console.log('ruleOb', ruleObj);
    }
    const handleTableRuleDeleteInternal = () => {
        handleTableRuleDelete(ruleIndex);
    }
    const handleTableRuleSelectionInternal = (e) => {
        ruleObj.ruleLocation = e.value;
        handleTableRuleSelection(ruleObj, ruleIndex);
    }
    const handleReferenceSelectionInternal = (e) => {
        ruleObj.rule_name = e.value;
        if(e.value === "rating check") {
            ruleObj.moodys_columns= [  "moodys_rating",  "moodys_rating_date" ]; 
            ruleObj['s&p_columns'] = [ "s_and_p_rating", "s_and_p_rating_date"] 
        }
        handleTableRuleSelection(ruleObj, ruleIndex);
    }
    const handleRefTableSelectionInternal = (e) => {
        ruleObj.reference_table = e.value;
        handleTableRuleSelection(ruleObj, ruleIndex);
    }
    const handleRefTableFieldIntenal = (e) => {
        ruleObj.reference_column = e.value;
        handleTableRuleSelection(ruleObj, ruleIndex);
    }
    const handleRefCurrentFieldIntenal = (e) => {
        ruleObj.column = e.value;
        handleTableRuleSelection(ruleObj, ruleIndex);
    }


    const handleCurrentTableInternal = (e) => {
        ruleObj.calculate_column = e.value;
        handleTableRuleSelection(ruleObj, ruleIndex);
    }
    const handleCurrentTotalColumnInternal = (e) => {
        ruleObj.total_column = e.value;
        handleTableRuleSelection(ruleObj, ruleIndex);
    }



    return (
        <React.Fragment>
            <div style={{ marginLeft: '25px', marginTop: 10, marginBottom: -5 }}> {`Table Rule ${ruleIndex + 1}`} </div>
            <div className="p-grid" style={{ marginLeft: '30px', marginTop: 10 }}>
                <div className="p-col-2">
                    <Dropdown
                        className="w-100"
                        id={`dataType${ruleIndex}`}
                        value={ruleObj.ruleLocation}
                        options={locationOptions}
                        onChange={handleTableRuleSelectionInternal}
                        optionLabel="option"
                        placeholder="Select DataType"
                    />
                </div>
                <div className="p-col-2">
                    <Dropdown
                        className="w-100"
                        id={`dataType${ruleIndex}`}
                        value={ruleObj.rule_name}
                        options={tableRuleOptions}
                        onChange={handleReferenceSelectionInternal}
                        optionLabel="option"
                        placeholder="Select Reference Rule"
                    />
                </div>
                {
                    (ruleObj.rule_name === 'reference check' ||
                        ruleObj.rule_name === 'cusip check') &&
                    <React.Fragment>
                        <div className="p-col-2">
                            <Dropdown
                                id="existingferenceTable"
                                className="w-100"
                                value={ruleObj.reference_table}
                                options={existingTableOptions(existingTableList)}
                                onChange={handleRefTableSelectionInternal}
                                optionLabel="option"
                                placeholder="Please select Table creation Type"
                            />
                        </div>
                        {ruleObj.reference_table &&
                            <div className="p-col-4">
                                <MultiSelect
                                    optionLabel="option"
                                    display="chip"
                                    value={ruleObj.reference_column}
                                    placeholder="Please select Reference Table Fields"
                                    options={referenceFieldsOption(existingTableList, ruleObj.reference_table)}
                                    onChange={handleRefTableFieldIntenal}
                                />
                            </div>
                        }
                        {ruleObj.reference_column &&
                            <div className="p-col-4">
                                <MultiSelect
                                    optionLabel="option"
                                    className="w-100"
                                    display="chip"
                                    optionValue="option"
                                    value={ruleObj.column}
                                    placeholder="Please select Current Table Fields"
                                    options={currentFieldsOption(fields)}
                                    onChange={handleRefCurrentFieldIntenal}
                                />
                            </div>
                        }

                    </React.Fragment>
                }
                {
                    ruleObj.rule_name === 'amount validation' &&
                    <React.Fragment>
                        <div className="p-col-4">
                            <MultiSelect
                                optionLabel="option"
                                className="w-100"
                                display="chip"
                                optionValue="option"
                                value={ruleObj.calculate_column}
                                options={currentFieldsOption(fields)}
                                onChange={handleCurrentTableInternal}
                            />
                        </div>
                        <div className="p-col-2">
                            <Dropdown
                                id="existingferenceTable"
                                className="w-100"
                                value={ruleObj.total_column}
                                options={currentFieldsOption(fields)}
                                onChange={handleCurrentTotalColumnInternal}
                                optionLabel="option"
                                placeholder="Please select TargetColumn"
                            />
                        </div>

                    </React.Fragment>
                }
                <div className="p-col-2">
                    <a href="#" onClick={handleTableRuleDeleteInternal}>Delete</a>
                </div>
            </div>


        </React.Fragment>
    )
}

export default TableRule;
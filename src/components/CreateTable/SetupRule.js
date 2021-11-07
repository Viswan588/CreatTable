import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { ruleOptions } from '../../Constants/table-constants';


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



const SetupRule = ({ ruleObj, setIndex, existingTableList, handleRuleUpdate, fields }) => {

    console.log('rup', ruleObj, setIndex);

    const handleUpdateRuleSelection = (e) => {
        ruleObj.rule_name = e.value;
        handleRuleUpdate(ruleObj, setIndex);
    }
    const handleRefTableSelection = (e) => {
        ruleObj.reference_table = e.value;
        handleRuleUpdate(ruleObj, setIndex);
    }
    const handleRefTableFieldSelection = (e) => {
        ruleObj.reference_column = e.value;
        handleRuleUpdate(ruleObj, setIndex);
    }
    const handleValidCheck = (e) => {
        ruleObj.rule_value = e.target.value;
        handleRuleUpdate(ruleObj, setIndex);
    }

const handleValidValueCheck = (e) => {
    ruleObj.valid_values = e.target.value;
    handleRuleUpdate(ruleObj, setIndex);
}


    
    const handleValidMinValue = (e) => {
        ruleObj.minValue = e.target.value
        handleRuleUpdate(ruleObj, setIndex);
    }
    const handleValidMaxValue = (e) => {
        ruleObj.maxValue = e.target.value
        handleRuleUpdate(ruleObj, setIndex);
    }
    // const handleCurrentTableField1Selection = (e) => {
    //     
    //     ruleObj.fieldColumn1 = e.value
    //     handleRuleUpdate(ruleObj, setIndex);
    // }
    const handleCurrentTableField2Selection = (e) => {
        
        ruleObj.rule_value = e.value
        handleRuleUpdate(ruleObj, setIndex);
    }
    const handleRangeCheck1 = (e) => {
        ruleObj.minimum_value = e.target.value
        handleRuleUpdate(ruleObj, setIndex);
    }
    const handleRangeCheck2 = (e) => {
        ruleObj.maximum_value = e.target.value
        handleRuleUpdate(ruleObj, setIndex);
    }
    const handleSetupDelete = () => {
        ruleObj.isDeleted = true;
        handleRuleUpdate(ruleObj, setIndex);
    }
    return (
        <div key={`ruleDetails-${setIndex}`} className="p-grids" style={{ display: 'flex' }}>
            <label htmlFor="rule" style={{ marginLeft: 10, marginTop: 30 }}>{`Rule${setIndex + 1}`}</label>
            <Dropdown
                id={`rule${setIndex}`}
                key={`rule-${setIndex}-${ruleObj.rule_name}`}
                className="p-col-fixed"
                style={{ marginLeft: 30, marginTop: 15, heigth: 30 }}
                value={ruleObj.rule_name}
                options={ruleOptions}
                onChange={handleUpdateRuleSelection}
                optionLabel="option"
                placeholder="Please select Column Rule"
            />
            {
                ruleObj.rule_name === 'reference check' &&
                <React.Fragment>
                    <Dropdown
                        id={`rule-${setIndex}-${ruleObj.reference_table}`}
                        className="p-col-fixed"
                        key={`rule-${setIndex}-${ruleObj.reference_table}`}
                        style={{ marginLeft: 20, marginTop: 15, heigth: 30 }}
                        value={ruleObj.reference_table}
                        options={existingTableOptions(existingTableList)}
                        onChange={handleRefTableSelection}
                        optionLabel="option"
                        placeholder="Please select Table creation Type"
                    />
                    {ruleObj.reference_table &&
                        <Dropdown
                            id={`rule-${setIndex}-${ruleObj.reference_column}`}
                            className="p-col-fixed"
                            key={`rule-${setIndex}-${ruleObj.reference_column}`}
                            style={{ marginLeft: 10, marginTop: 15, heigth: 30 }}
                            value={ruleObj.reference_column}
                            options={referenceFieldsOption(existingTableList, ruleObj.reference_table)}
                            onChange={handleRefTableFieldSelection}
                            optionLabel="option"
                            placeholder="Please select field in reference table"
                        />
                    }
                </React.Fragment>
            }
            {//entity field required -shekar
                (ruleObj.rule_name === 'length check') &&
                <InputText
                    id={`rule-${setIndex}-${ruleObj.rule_value}`}
                    style={{ marginLeft: 10, marginTop: 15, heigth: 30 }}
                    key={`rule-${setIndex}-${ruleObj.rule_value}`}
                    defaultValue={ruleObj.rule_value}
                    placeholder="Please enter Max Value "
                    type="inputFieldSelection"
                    onBlur={handleValidCheck}
                />

            }
            {//entity field required -shekar
                (ruleObj.rule_name === 'valid value check' ) &&
                <InputText
                    id={`rule-${setIndex}-${ruleObj.valid_values}`}
                    style={{ marginLeft: 10, marginTop: 15, heigth: 30 }}
                    key={`rule-${setIndex}-${ruleObj.valid_values}`}
                    defaultValue={ruleObj.valid_values}
                    placeholder="Please enter Max Value "
                    type="inputFieldSelection"
                    onBlur={handleValidValueCheck}
                />

            }
            {//entity field required -shekar
                (ruleObj.rule_name === 'range Check') &&
                <React.Fragment>
                    <InputText
                        id={`rule-${setIndex}-${ruleObj.minimum_value}`}
                        style={{ marginLeft: 10, marginTop: 15, heigth: 30 }}
                        key={`rule-${setIndex}-rangeCheck`}
                        defaultValue={ruleObj.minimum_value}
                        placeholder="Please enter Min Value "
                        type="inputFieldSelection"
                        onBlur={handleRangeCheck1}
                    />
                    <InputText
                        id={`rule-${setIndex}-${ruleObj.maximum_value}`}
                        style={{ marginLeft: 10, marginTop: 15, heigth: 30 }}
                        key={`rule-${setIndex}-maxRangeCheck`}
                        defaultValue={ruleObj.maximum_value}
                        placeholder="Please enter Max Value "
                        type="inputFieldSelection"
                        onBlur={handleRangeCheck2}
                    />
                </React.Fragment>

            }
            {//entity field required -shekar
                (ruleObj.rule_name === 'null check either or') &&
                <React.Fragment>
                    {/* <Dropdown
                        id={`rule-${setIndex}-${ruleObj.fieldColumn1}`}
                        className="p-col-fixed"
                        key={`rule-${setIndex}-rulenullCheckField2`}
                        style={{ marginLeft: 10, marginTop: 15, heigth: 30 }}
                        value={ruleObj.fieldColumn1}
                        options={currentFieldsOption(fields)}
                        onChange={handleCurrentTableField1Selection}
                        optionLabel="option"
                        placeholder="Please select field in current table"
                    /> */}
                    <div className="p-col-4">
                     <MultiSelect
                                optionLabel="option"
                                className="w-100"
                                display="chip"
                                optionValue="option"
                                value={ruleObj.rule_value}
                                options={currentFieldsOption(fields)}
                                onChange={handleCurrentTableField2Selection} 
                            />
                        </div>
                    {/* <Dropdown
                        id=""
                        className="p-col-fixed"
                        key={`rule-${setIndex}-rulenullCheckField2`}
                        style={{ marginLeft: 10, marginTop: 15, heigth: 30 }}
                        value={ruleObj.rule_value}
                        options={currentFieldsOption(fields)}
                        onChange={handleCurrentTableField2Selection}
                        optionLabel="option"
                        placeholder="Please select field in current table"
                    /> */}
                </React.Fragment>

            }
            <div className="p-col-1" style={{ marginTop: 20 }}>
                <a href="#" onClick={handleSetupDelete}>Delete</a>
            </div>
        </div>
    )
}

export default SetupRule;
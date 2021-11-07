import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { dataTypes, dateFormatOpions } from '../../Constants/table-constants';
import ColumnSetupRules from './ColumnSetupRules';
import { cloneDeep } from 'lodash';


const CreateColumn = ({ colInfor, colIndex, existingTableList, handleColumninformation, fields }) => {

    const [dialogColumnSetupRules, setDialogColumnSetupRules] = useState(false);

    const handleSetUpRules = () => {
        setDialogColumnSetupRules(true);
    }
    const handleSetUpRulesCloseDialog = () => {
        setDialogColumnSetupRules(false);
    }

    const handleDataTypeSelection = (e) => {
        colInfor.data_type = e.target.value;
        handleColumninformation(colInfor, colIndex)
    }

    const handleDateFormatSelection = (e) => {
        colInfor.date_format = e.value;
        handleColumninformation(colInfor, colIndex);
    }

    const handleColLength = (e) => {
        colInfor.data_type = `varchar(${e.target.value})`;
        handleColumninformation(colInfor, colIndex);
    }

     const handleUpdateRules = (rules) => {
         colInfor.source_rules = cloneDeep(rules);
         handleColumninformation(colInfor, colIndex);
     }

     const handleTargetUpdateRules =(rules) => {
        colInfor.target_rules = cloneDeep(rules);
        handleColumninformation(colInfor, colIndex);
     }

     const handleDeleteField = () => {
        colInfor.isDeleted = true;
        handleColumninformation(colInfor, colIndex);
    }
    const handleColName = (e) => {
        colInfor.field_name = e.target.value;
        handleColumninformation(colInfor, colIndex);
    }
     

    return (
        <React.Fragment>
            <div className="p-grid" style={{ marginLeft: '30px', marginTop: 10 }}>
                <div className="p-col-2">
                    <InputText
                        key={`${colInfor.field_name}-${colIndex}`}
                        id={`${colInfor.field_name}-${colIndex}`}
                        defaultValue={colInfor.field_name}
                        placeholder="Field Name"
                        onBlur={handleColName}
                    />
                </div>
                {colInfor.data_type.indexOf('varchar') > -1 &&
                    <React.Fragment>
                        <div className="p-col-2">
                            <Dropdown
                                className="w-100"
                                id={`dataType${colIndex}`}
                                value={'varchar'}
                                options={dataTypes}
                                onChange={handleDataTypeSelection}
                                optionLabel="option"
                                placeholder="Select DataType"
                            />
                        </div>
                        <div className="p-col-2">
                            <InputText
                                key={colInfor.data_type.replaceCharcters().dataTypeLength}
                                id={`colLength${colIndex}`}
                                defaultValue={colInfor.data_type.replaceCharcters().dataTypeLength}
                                placeholder="Field Length"
                                required
                                type="colLength"
                                onBlur={handleColLength}
                            />
                        </div>
                    </React.Fragment>
                }

                <React.Fragment>
                    {
                        colInfor.data_type === 'date' &&
                        <React.Fragment>
                            <div className="p-col-2">
                                <Dropdown
                                    className="w-100"
                                    id={`dataType${colIndex}`}
                                    value={'date'}
                                    options={dataTypes}
                                    onChange={handleDataTypeSelection}
                                    optionLabel="option"
                                    placeholder="Select DataType"
                                />
                            </div>
                            <div className="p-col-2">
                                <Dropdown
                                    className="w-100"
                                    id={`dataType${colIndex}`}
                                    value={colInfor.date_format}
                                    options={dateFormatOpions}
                                    onChange={handleDateFormatSelection}
                                    optionLabel="option"
                                    placeholder="Select DataType"
                                />
                            </div>
                        </React.Fragment>
                    }
                </React.Fragment>
                {(colInfor.data_type == 'float' || colInfor.data_type == '' || colInfor.data_type === 'int' || colInfor.data_type === 'boolean') &&
                    <div className="p-col-2">
                        <Dropdown
                            className="w-100"
                            id={`dataType${colIndex}`}
                            value={colInfor.data_type}
                            options={dataTypes}
                            onChange={handleDataTypeSelection}
                            optionLabel="option"
                            placeholder="Select DataType"
                        />
                    </div>
                }
                <div className="p-col-1">
                    <a href="#" onClick={handleDeleteField} >Delete</a>
                </div>
                <div className="p-col-2">
                    <Button
                        // disabled={!colNameState}
                        label="Setup Rules"
                        className="p-button-outlined p-button-help btn-add-exception"
                        onClick={handleSetUpRules}
                    />
                </div>

                <ColumnSetupRules
                    dialogColumnSetupRules={dialogColumnSetupRules}
                    handleSetUpRulesCloseDialog={handleSetUpRulesCloseDialog}
                    existingTableList={existingTableList}
                    setupRules={colInfor.source_rules || []}
                    setupTargetRules={colInfor.target_rules || []}
                    handleUpdateRules={handleUpdateRules}
                    handleTargetUpdateRules={handleTargetUpdateRules}
                    fields={fields}
                />
                 {/* <ColumnSetupRules
                    dialogTitle
                    dialogColumnSetupRules={dialogColumnSetupRules}
                    handleSetUpRulesCloseDialog={handleSetUpRulesCloseDialog}
                    existingTableList={existingTableList}
                    setupRules={colInfor.source_rules || []}
                    handleUpdateRules={handleUpdateRules}
                    fields={fields}
                /> */}
            </div>
        </React.Fragment>
    )
}

export default CreateColumn;
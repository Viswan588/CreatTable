import React, { useState, useEffect } from 'react';
import CreateColumn from './CreateColumn';
import { Button } from 'primereact/button';
import { cloneDeep } from 'lodash';

const CreateColumns = ({ fields, tableName, existingTableList, handleAddNewRule, hadleUpdateTableInformation }) => {

    const handleColumninformation = (colInfor, index) => {
        const colIndex = fields.findIndex(x => x.field_name === colInfor.field_name);
        fields[colIndex] = colInfor;
        hadleUpdateTableInformation(fields, tableName);
    }

    const handleAddNewColumn = () => {
        const field = {
            field_name: '',
            data_type: ''
        };
        fields.push(cloneDeep(field));
        hadleUpdateTableInformation(fields, tableName);
    }

    return (
        <React.Fragment>
            <div style={{ marginLeft: '30px', marginTop: 10, marginBottom: -15 }}> Add Fields </div>
            {
                (fields.filter(x => !x.isDeleted)).map((rec, index) => (
                    <CreateColumn
                        key={`createColumn-${index}`}
                        colIndex={index}
                        colInfor={rec}
                        existingTableList={existingTableList}
                        handleAddNewRule={handleAddNewRule}
                        tableName={tableName} 
                        handleColumninformation={handleColumninformation}
                        fields={fields}
                    />
                ))
            }
            {
                tableName ?
                    <Button style={{ marginLeft: '60px', marginTop: 20 }}
                        label="+ Add Field"
                        className="p-button-outlined p-button-help btn-add-exception"
                        onClick={handleAddNewColumn}
                    /> : ''
            }
        </React.Fragment>
    )
}

export default CreateColumns;
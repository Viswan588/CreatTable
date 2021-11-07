import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

const CreateButton = ({ label, handleShowCreateTableDialog }) => {
    return (
        <div style={{ marginLeft: '20px' }}>
            <Button
                label={label}
                className="p-button-outlined p-button-help btn-add-exception"
                onClick={handleShowCreateTableDialog}
            />
        </div>
    )
}

export default CreateButton;
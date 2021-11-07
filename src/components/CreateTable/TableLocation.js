import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { tableLocationOptions } from '../../Constants/table-constants';

const TableLocation = ({ databaseType, handleUpdateTableLocation }) => {
    return (
        <div style={{ marginLeft: '30px', marginTop: 10 }}>
             <div>Table Location</div>
            <div className="p-col-3">
                <Dropdown
                    className="w-100"
                    id={`dataTypetype`}
                    value={databaseType}
                    options={tableLocationOptions}
                    onChange={handleUpdateTableLocation}
                    optionLabel="option"
                    placeholder="Select Table Location"
                />
            </div>
        </div>
    )
}

export default TableLocation;
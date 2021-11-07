import React, { useState, useEffect } from 'react';

const TableNameDisplay = ({tableName}) => {
    return (
        <div style={{ marginLeft: '30px', marginTop: 20 }}>
            <label >TableName</label>
            <div style={{ fontWeight: 700, fontSize: 20 }}>{tableName}</div>
        </div>
    )
}

export default TableNameDisplay;
import React, { useState, useEffect } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import ReactFileReader from 'react-file-reader';
import { Dropdown } from 'primereact/dropdown';
import fetchExistingTableList from './CreateTable/services/fetchTableList';
import axios from 'axios';
import { clone, cloneDeep } from 'lodash';
import swal from 'sweetalert';

const existingTableOptions = (tableList) => {
    return tableList.map(x => ({ option: x.table_definition.table_name, value: x.table_definition.table_name }))
}



const round2Fixed = (value) => {
    value = +value;
  
    if (isNaN(value))
      return NaN;
  
    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + 2) : 2)));
  
    // Shift back
    value = value.toString().split('e');
    return (+(value[0] + 'e' + (value[1] ? (+value[1] - 2) : -2))).toFixed(2);
  }

const ColumnMapping = () => {
    const [textData, setTextData] = useState('');
    const [tableSelection, setTableSelection] = useState('');
    const [tableOptions, setTableOptions] = useState([]);
    const [resultMapping, setResultMapping] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectInputValue, setSelectInputValue] = useState('');
    const [selectMappingValue, setSelectMappingValue] = useState('');
    const [scoreValue, setScoreValue] = useState('');
    const [fileName, setFileName] = useState('')


    useEffect(async () => {
        const { data } = await fetchExistingTableList();
        setTableOptions(existingTableOptions(data.response));
    }, []);

    const handleFiles = files => {
        var reader = new FileReader();
        setFileName(files && files.length > 0 && files[0].name);
        reader.onload = (e) => {
            // Use reader.result

            const firstRow = reader.result.split("\n")[0];
            const headers = firstRow.replaceAll('"', '').split(",");
            setTextData(headers)
        }
        reader.readAsText(files[0]);
    }
    const handleExistingTableSelection = (e) => {
        setTableSelection(e.value);
    }
    const handleSubmission = () => {
        const body =
        {
            "csv_columns": textData,
            "table": tableSelection
        }
        setIsLoading(true);
        axios.post(`http://172.20.3.113:9009/api/columns_mapping`, body)
            .then(res => {
                setIsLoading(false);
                setResultMapping(res.data.response);
            });
    }
    const fileOption = () => {
        return (resultMapping || []).map(rec => ({ option: rec.input_column, value: rec.input_column }))
    }
    const getUniqueListBy = (arr, key) => {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }
    const mappingOptions = () => {
        let listOfRecords = (resultMapping || []).map(rec => ({ option: rec.matched_column }));
        listOfRecords = getUniqueListBy(listOfRecords, 'option');
        return (listOfRecords || []).map(rec => ({ option: rec.option, value: rec.option }))
    }
    const handleSelectInputValue = (e, index) => {

        resultMapping[index].matched_column = e.value;
        setResultMapping(cloneDeep(resultMapping));
        // setSelectInputValue(e.value);
        // const rec = resultMapping.find(x => x.input_column === e.value);
        // setSelectMappingValue(rec.matched_column);
        // setScoreValue(rec.score);

    }
    const handleSelectMappingValue = (e) => {
        setSelectMappingValue(e.value);
        const rec = resultMapping.find(x => x.matched_column === e.value);
        setSelectInputValue(rec.input_column);
        setScoreValue(rec.score);
    }
    return (
        <div style={{ marginLeft: '30px', fontSize: 16 }}>
            <h2 className="p-offset-1 mb-exception-head">Key Attribute Mapping</h2>

            <div className="p-fluid" id="columnMappingRec" style={{ marginLeft: 100, marginTop: 40 }} >

                <div className="p-field p-grid" >
                    <label htmlFor="tableSe" className="p-col-fixed"
                        style={{ width: '250px', fontSize: 16 }}>Please upload .csv File</label>
                    <ReactFileReader handleFiles={handleFiles} fileTypes={[".csv"]}
                        style={{ 'width': '184px', 'marginLeft': '10px' }}
                        multipleFiles={false}>
                        <img alt="UploadIcon" src="UploadIcon.svg" className=""
                            height="50" style={{ width: '50px' }}

                        />
                        {fileName}
                    </ReactFileReader>
                </div>
                <div className="p-field p-grid" >
                    <label htmlFor="tableSe" className="p-col-fixed"
                        style={{ width: '250px', fontSize: 16 }}>Please Select Table</label>
                    <Dropdown
                        id="tableSe"
                        required
                        optionValue="option" value={tableSelection}
                        options={tableOptions} optionLabel="option"
                        placeholder="Select a Table"
                        onChange={handleExistingTableSelection}
                        style={{ 'marginLeft': '1px' }} />
                </div>
            </div>
            <div className="p-offset-1 p-col-2" >
                <Button
                    label="Submit"
                    style={{ marginLeft: '20px' }}
                    disabled={!(tableSelection)}
                    className="p-button-outlined p-button-help btn-add-exception"
                    onClick={handleSubmission}
                />

            </div>
            <hr style={{ width: '80%', marginLeft: 20 }} />
            {
                isLoading &&
                <img alt="loaderIcon" width="70" height="70" src="loaderIcon.gif" className="" style={{ marginLeft: 350 }}/>
            }
            {resultMapping && resultMapping.length > 0 && !isLoading &&
                <React.Fragment style={{ marginLeft: 300 }}>
                    <div className="p-grid">
                        <div className="p-offset-1 p-col-1">
                            <b>SNO</b>
                        </div>
                        <div className="p-offset-1 p-col-2">
                            <b>File Columns</b>
                        </div>
                        <div className="p-col-3">
                            <b>Mapped Columns</b>
                        </div>
                        <div className="p-col-2">
                            <b> Score</b>
                        </div>
                    </div>
                    <hr style={{ width: '80%', marginLeft: 20 }} />
                    <React.Fragment style={{ marginLeft: 200 }}>
                        {
                            resultMapping.map((rec, index) => (

                                <div className="p-grid" style={{ marginLeft: 80 }}>
                                    <div className="p-col-1">
                                        {index + 1}
                                    </div>
                                    <div className="p-offset-1 p-col-2" style={{ marginTop: 12 }}>
                                        {rec.input_column}
                                    </div>
                                    <div className="p-col-3">
                                        <Dropdown
                                            id="tableSe"
                                            required
                                            key={`mapping-${rec.matched_column}`}
                                            optionValue="option"
                                            value={rec.matched_column}
                                            options={mappingOptions()}
                                            optionLabel="option"
                                            placeholder="Select an Input Value"
                                            onChange={(e) => handleSelectInputValue(e, index)}
                                        />
                                    </div>
                                    <div className="p-col-2" style={{ marginTop: 12 }}>
                                        {round2Fixed(rec.score)}
                                    </div>
                                </div>
                            ))
                        }
                    </React.Fragment>
                    <div className="p-col-3">
                        {scoreValue}
                    </div>
                    <hr style={{ width: '80%', marginLeft: 20 }} />
                    <div className="p-offset-1 p-col-2" >
                        <Button
                            label="Save"
                            style={{ marginLeft: '20px' }}
                            // disabled={!(tableSelection)}
                            className="p-button-outlined p-button-help btn-add-exception"
                            onClick={() => alert('saving changes is in progress....')}
                        />
                    </div>

                </React.Fragment>

            }

        </div>
    )
}

export default ColumnMapping;
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import axios from 'axios';
import { clone, cloneDeep } from 'lodash';
import swal from 'sweetalert';


const StartJob = () => {
  const [typeOfJob, setTypeOfJob] = useState('');
  const [flightName, setFlightName] = useState('');
  const [comments, setComments] = useState('');
  const [flightOptions, setFlightOptions] = useState([]);
  const [typeOfJobOptions, setTypeOfJobOptions] = useState([]);
  const [isProgress, setIsProgress] = useState(false);

  useEffect(() => {

    axios.get(`http://172.20.3.113:9009/api/flight`)
      .then(res => {
        res.data.response.forEach(res => {
          flightOptions.push(cloneDeep({option: res.flight_name ,value: res.flight_name }))
        })
        setFlightOptions(flightOptions);
      });
      

    axios.get(`http://172.20.3.113:9009/api/job_type`)
      .then(res => {
        res.data.response.forEach(res => {
          typeOfJobOptions.push(cloneDeep({option: res.job_type ,value: res.job_type }))
        })
        setTypeOfJobOptions(typeOfJobOptions);
      });

  }, []);

  const handleSelectionJob = (e) => {
    setTypeOfJob(e.value);
  }
  const handleSelectFlight = (e) => {
    setFlightName(e.value);
  }
  const handleComments = (e) => {
    setComments(e.target.value);
  }
  const handleStartJob = () => {
    const body = 
      {
      "job_type": typeOfJob,
      "flight_name": flightName,
      "user_comments": comments,
      "created_by": "cfuser",
      "created_on": new Date().toDateString()
      }
          
      setIsProgress(true);
    axios.post(`http://172.20.3.113:9009/api/execution_monitor`, [body])
    .then(res => {
      setIsProgress(false);
      swal(res.data.response, '', "success");
    });

  }

  const confirm = () => {
    confirmDialog({
        message: 'Are you sure do want to start the job?',
        header: 'Confirmation',
        icon: '',
        accept: () => handleStartJob(),
        reject: () => {}
    });
}


  return (
    <div id="startJob" >
      <h1 className="p-offset-1 mb-exception-head">Start Job</h1>

      <div className="p-fluid" id="addFile" style={{ marginLeft: 100 }} >
        <div className="p-field p-grid" >
          <label htmlFor="tranch" className="p-col-fixed" style={{ width: '150px' }}>Type of Job</label>
          <Dropdown required
            optionValue="option" value={typeOfJob}
            options={typeOfJobOptions} optionLabel="option"
            placeholder="Select a Job" 
            onChange={handleSelectionJob}
            style={{ 'width': '184px', 'marginLeft': '8px' }} />
        </div>
        <div className="p-field p-grid">
          <label htmlFor="tranch" className="p-col-fixed" style={{ width: '150px' }}>Select Flight</label>
          <Dropdown required
            optionValue="option" value={flightName}
            options={flightOptions} optionLabel="option"
            onChange={handleSelectFlight}
            placeholder="Select a Flight" style={{ 'width': '184px', 'marginLeft': '8px' }} />
        </div>
        <div className="p-field p-grid">
          <label htmlFor="tranch" className="p-col-fixed" style={{ width: '150px' }}>Comments</label>
          <InputTextarea key={`text-${comments}`} defaultValue={comments} 
          placeholder="Please enter your comments..."
              style={{ 'width': '184px', 'marginLeft': '8px' }} 
              onBlur={handleComments}
          />
        </div>

        {
                isProgress &&
                <img alt="loaderIcon" width="70" height="70" src="loaderIcon.gif" className=""
                 style={{ marginLeft: 350 }}/>
            }
      
        <div className="p-offset-1 p-col-2">
      <Button
            label="Start Job"
            disabled={!(typeOfJob && flightName && comments) || isProgress}
            className="p-button-outlined p-button-help btn-add-exception"
            onClick={confirm}
          />

      </div>
    </div>
    </div>
  );
};

export default StartJob;
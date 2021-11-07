import React from 'react';
import { Card } from 'primereact/card';
import { useHistory } from "react-router-dom";

//import { AiTwotonePushpin } from 'react-icons';

const CardComponent = ({ data }) => {
     let history = useHistory();
    return (
        // <div className="p-grid">
        <div className="p-col-3 card">
            <Card
                key={data.id}
                title={data.name}
                style={{ width: '20.125em', height: '20.5em' }} >
                <img alt="pin" src="PinFilled.png" className="" height="15" 
                onClick={() =>  history.push(data.navigate)}
                style={{ float: 'right', marginTop: '-45px' }} />
                <p className="cardTitle">{data.name}</p>

                <p className="p-m-0 cardContent" style={{ lineHeight: '1.5' }}>
                    <ul>
                        <li> {data.content1}</li>
                        <li>{data.content2}</li>
                    </ul>
                </p>
            </Card>
        </div>
        //  </div>
    );

};

export default CardComponent;
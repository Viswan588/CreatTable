import React from 'react';
import CardComponent from './CardComponent';
import { CARD_NAMES } from '../Constants/home-constants'

const Home = () => {

    return(
        <div id="home">
           
            <div className="p-col-10 p-offset-1">
                <h1>Home</h1>
                <div className="conversioninfo">
                    <h1> What is Conversion Factory</h1>
                    <p><b>An automated, platform-driven approach for the “lift and shift” of tranches of funds seamlessly from one custodian 
                        to another. </b></p>
                        <p><b>Main components include: </b></p>
                <ul className="intro-points">
                    <li><b>Foundational reference data framework: 
                        </b> Repository of security master and reference data, 
                            Data dictionaries, mapping methodology, rules and Entity relationships.</li>
                    <li><b>Pre-Processor: </b> 
                    Engine that does the heavy lifting, extraction, normalization and data 
transformation through a template driven source to target mapping.</li>
                    <li><b>Exception management engine: </b>Rules-driven alerts and filters helps Client operations reduce the number of exceptions during reconciliation</li>
                    <li><b>Drill-down reconciliation views: </b>For matching and exception processing</li>
                    <li><b>PMO driven dashboards: </b> 
                    Providing updated views of flights plans and facilitate monitoring of transition status across business silos</li>
                </ul>

            </div> 
            </div>
           

           <div className="p-offset-1 p-col-10">
            <div className="p-grid">
             { CARD_NAMES.map((data,index) => <CardComponent key={`card-${index}`} data={data} /> )}
             </div>
            </div>

            
        </div>
    )
};

export default Home;
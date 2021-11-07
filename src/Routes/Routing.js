import React,{ useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Route, Switch} from 'react-router-dom';
import { loginStatusAction } from '../redux/actions/LoginAction';
import PmoDashboard from '../components/PMO_DASHBOARD';
import Login from '../components/LOGIN';
import Home from '../components/HOME';
import Exceptions from '../components/EXCEPTION';
import Recon from '../components/RECON';
import File from '../components/FILE';
import BIDashBoard from '../components/BIDashBoard'
import StartJob from '../components/StartJob';
import CreateTable from '../components/CreateTable/CreateTable'
// import NoRoute from '../privateComponents/NoRoute'
import PrivateRoute from './PrivateRoutes';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../msalConfig/index';
import ColumnMapping from '../components/ColumnMapping';

const Routing = (props) => {
    const loginStatus = useSelector(state => state.loginStatus);
    const dispatch = useDispatch(); 

    useEffect(() => {

        String.prototype.replaceCharcters = function(){
             const dataType = this.split("("); 
             let dataTypeLength = [];
             if (dataType.length > 1) { 
                  dataTypeLength = dataType[1].split(")"); 
             }
             const returnObj =  {
                 dataType: 'varchar',
                 dataTypeLength: dataTypeLength.length > 1 ? dataTypeLength[0] : 0
             }
             return returnObj;
         }

    }, [])

    const msalInstance = new PublicClientApplication(msalConfig);
    
    return(
        <div>
            <Switch>
                <Route path='/' component={Login} exact={true}/>   
                <PrivateRoute path='/home' component={Home} />
                <PrivateRoute path='/pmo' component={PmoDashboard} />
                <PrivateRoute path='/exception' component={Exceptions} />
                <PrivateRoute path='/recon' component={Recon} />
                <PrivateRoute path='/files' component={File} />
                <PrivateRoute path="/BIDashBoard" component={BIDashBoard} />
                <PrivateRoute path="/startJob" component={StartJob} />
                <PrivateRoute path="/createTable" component={CreateTable} />
                <PrivateRoute path="/columnMapping" component={ColumnMapping} />
                {/* <Route component={NoRoute} /> */}
            </Switch>
        </div>
    )
}

export default Routing;
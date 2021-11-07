import React from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../../msalConfig';
import { loginStatusAction } from '../../redux/actions/LoginAction';
import { useHistory } from 'react-router';




const NavBar = () => {
    const history = useHistory();
    const loginStatus = useSelector(state => state.loginStatus);
    const userDetails = useSelector(state => state.userDetails);
    
    const dispatch = useDispatch();
const src = 'https://app.powerbi.com/reportEmbed?reportId=36ea9c8a-1e81-450d-baf2-247ebd3e255b&autoAuth=true&ctid=89cf11d4-079d-47a6-af93-e6ae64ceb42c&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtdXMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D';
    const items = [
        {
            label:'Home',
            icon:'pi pi-fw pi-home',
            command:()=>{ history.push('/home') }
        },
        {
            label:'Dashboard',
            icon:'pi pi-fw pi-chart-bar',
            items: [
                {
                    label:'PMO Dashboard',
                    icon:'pi pi-fw pi-file-excel',
                    command:()=>{  history.push('/pmo')}
                },
                {
                    label:'BI Dashboard',
                    icon:'pi pi-fw pi-file-excel',
                    command:()=>{ 
                         window.open(src,'_blank').focus();}
                },
            ]
            
        },
        {
            label:'Exception',
            icon:'pi pi-fw pi-file-excel',
            command:()=>{  history.push('/exception'); }
        },
        {
            label:'Reconciliation',
            icon:'pi pi-fw pi-file-excel',
            command:()=>{  history.push('/recon'); }
        },{
            label:'ETL Process Setup',
            icon:'pi pi-fw pi-user',
            items:[
                {
                    label:'File Setup',
                    icon:'pi pi-fw pi-file-excel',
                    command:()=>{  history.push('/files'); }
                },
                {
                    label:'Create Table',
                    icon:'pi pi-fw pi-file-excel',
                     command:()=>{  history.push('/createTable'); }
                },
                {
                    label:'Column Mapping',
                    icon:'pi pi-fw pi-file-excel',
                    command:()=>{  history.push('/columnMapping'); }
                },
                {
                    label:'Start Job',
                    icon:'pi pi-fw pi-file-excel',
                    command:()=>{  history.push('/startJob'); }
                },
            ]
        }
    ];

    const msalInstance = new PublicClientApplication(msalConfig);

    const  handleLogout = async() => {
       await msalInstance.logoutPopup();
        dispatch(loginStatusAction());
        // sessionStorage.clear();
    };

    return(
        <nav id="navigation">
            <div className="p-grid">
                <div className="p-col-12">
                    <Menubar model={items}
                        start={
                            <span>
                                <img
                                    alt="Intelliswift"
                                    className="logo" 
                                    src="logo.png"/>
                            </span>
                            }
                        end={ 
                            <Button 
                                label={userDetails.name}
                                className="p-button-raised p-button-rounded p-button-success" 
                                icon="pi pi-power-off"
                                iconPos="right"
                                onClick={handleLogout}
                            />
                        }
                    />
                </div>
            </div>
        </nav>
    )
    
}

export default NavBar;
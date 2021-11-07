import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router';
import NavBar from '../components/NavBar/NAV_BAR';


const PrivateRoute = ({component:Component, ...rest}) => {

    const loginStatus = useSelector(state => state.loginStatus);

    return(
        <Route
            {...rest} render={(props) => {
                return loginStatus ? (
                    <main>
                        <NavBar />
                        <Component {...props} /> 
                    </main>
                   ) : (
                    <Redirect
                        to={{
                            pathname:'/'
                        }}
                    />
                )
                    
            }}
        />
    )

}

export default PrivateRoute;
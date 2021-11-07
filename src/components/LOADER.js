import react from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const LOADER = () => {
    return (
        <ProgressSpinner 
            style={{width: '50px', height: '80px'}} 
            strokeWidth="3" 
            fill="#EEEEEE" 
            animationDuration=".5s"/>
    )
}

export default LOADER;
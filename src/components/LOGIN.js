import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../msalConfig';
import { loginStatusAction } from '../redux/actions/LoginAction';
import { getDetails } from '../redux/actions/UserDetails';
import {
	LOGIN_LABEL,
	EMAIL_LABEL,
	PASSWORD_LABEL,
	REMEMBER_ME_LABEL
} from '../Constants/login-constants';

const Login = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberPasswordChecked, setRememberPasswordChecked] = useState(false);

	//Creating Instance for Microsoft SSO Login and passing the config to it
	const msalInstance = new PublicClientApplication(msalConfig);
	const dispatch = useDispatch();

	const handleLogin = async () => {

		if(!email || !password){
			alert('Please enter Email and Password')
		}
		else if (email === "admin@intelliswift.com" && password === "Admin@45#staToR") {

			const data = {
				name: email,
				username: "Administator"
			}
			dispatch(loginStatusAction());
			dispatch(getDetails(data));
			props.history.push('/home');
		} else {
			alert('Please check your credentials once again...')
		}
	};

	const handleLoginwithMicroSoft = async () => {
		try {
			const response = await msalInstance.loginPopup()
			const data = {
				name: response.account.name,
				username: response.account.username
			}
			dispatch(loginStatusAction());
			dispatch(getDetails(data));
			props.history.push('/home');

		}
		catch (error) {
			console.log('Error', error);
			alert(error)
		}
	}



	const handleManualLogin = (e) => {
		e.preventDefault();
		//alert(e)
	};

	// CSS
	const inputBoxWidth = {
		width: "350px"
	};

	const passwordInputMarginBtm = {
		marginBottom: "28px"
	}

	const loginBtnWidth = {
		width: "347px",
		backgroundColor: "#2488DC",
		color: "#fff"
	}

	const ssoBtnWidth = {
		width: "347px",
		backgroundColor: "#0A1037",
		color: "#fff"
	}


	return (
		<div id="login" className="p-grid">
			<div className="p-col-6">
				<div id="banner">
					<img alt="login-banner" src="login.png" className="" height="600" style={{ float: 'right' }} />
				</div>
			</div>
			<div className="p-offset-2 p-col-4 loginform">
				<p className="login-text">{LOGIN_LABEL}</p>
				<form onSubmit={handleManualLogin}>
					<div className="p-grid">
						<div className="p-col-12">
							<label htmlFor="email" style={{ marginBottom: '3px' }} className="login-password-title">{EMAIL_LABEL}</label>

							<InputText
								id="email"
								style={{ ...inputBoxWidth }}
								value={email}
								placeholder="Email"
								required
								type="email"
								minLength="5"
								onChange={(e) => setEmail(e.target.value)} />
						</div>
						<div className="p-col-12">
							<label htmlFor="password" style={{ marginBottom: '3px' }} className="login-password-title">{PASSWORD_LABEL}</label>
							<Password
								id="password"
								style={{ ...passwordInputMarginBtm }}
								value={password}
								placeholder="Password"
								onChange={(e) => setPassword(e.target.value)} />
						</div>
						<div className="p-col-6" style={{ marginTop: '-1.5rem' }}>
							<Checkbox
								className="p-mr-2"
								inputId="rememberPassword"
								checked={rememberPasswordChecked}
								onChange={e => setRememberPasswordChecked(e.checked)} />
							<label className="p-mr-2" htmlFor="rememberPassword">{REMEMBER_ME_LABEL}</label>
						</div>

						<div className="p-col-12">
							<Button
								style={{ ...loginBtnWidth }}
								className=""
								onClick={handleLogin}
								label="Login Now" />
						</div>
						<div className="p-col-12">
							<Button
								style={{ ...ssoBtnWidth }}
								className=""
								onClick={handleLoginwithMicroSoft}
								label="SSO Login" />
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
import React, { Component } from 'react';
import './style.sass';
import {User} from '../../api';
import {HTTP} from '../../HTTP';

class Auth extends Component {
	state = {
		username: '',
		password: ''
	}
	login = async () => {
		const data = {
			user_name: this.state.username,
			user_password: this.state.password
		}
		try{
			const response = await User.login(data);
			HTTP.defaults.headers.common['Authorization'] = response.data.token;
		}catch(error){
			throw error;
		}
	}
	handleInputChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}
	render(){
		return(
			<div className="auth">
				<input className="auth-input" name="username" placeholder="username" value={this.state.username} onChange={e => this.handleInputChange(e)}/>
				<input className="auth-input" name = "password" placeholder="password" value={this.state.password} onChange={e => this.handleInputChange(e)}/>
				<button className="auth-button" onClick={this.login} >Login</button>
			</div>
		)
	}
}

export default Auth;
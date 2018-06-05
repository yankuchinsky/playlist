import React, { Component } from 'react';
import './App.sass';
import 'typeface-roboto';
import AuthPage from './Pages/AuthPage';
import MainPage from './Pages/MainPage';
import { BrowserRouter, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
			<BrowserRouter>
				<div className="App">
					<Route exact path="/" component={MainPage}/>	
					<Route exact path="/login" component={AuthPage}/>
				</div>
			</BrowserRouter>
    );
  }
}

export default App;

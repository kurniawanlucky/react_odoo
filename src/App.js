import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Routes from './Routes';
import Navigation from './components/Navbar';

class App extends Component {
  render() {
    return (
        <div className='App'>
          <header className='App-header'>
            <Navigation />
            <Routes />
            <img className='App-logo' src={logo} alt="logo" />
          </header>
          <div className='container'>
          </div>
        </div>
    );
  }
}
export default App;

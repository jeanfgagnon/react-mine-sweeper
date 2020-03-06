import React from 'react';
import logo from './logo.svg';
import './App.css';

import GameForm from './Components/GameForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <GameForm gameOption={{'NbRow':16,'NbCol':30,'NbBomb':99}}></GameForm>
      </header>
    </div>
  );
}

export default App;

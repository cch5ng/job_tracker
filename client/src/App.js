import {useState} from 'react';
import Login from './components/Login';
import Logout from './components/Logout';

function App() {
  return (
    <div className="App">
      <h1>hello oauth test</h1>
      <Login />
      <Logout />
    </div>
  );
}

export default App;

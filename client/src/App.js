import {useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {Route, Switch} from 'react-router-dom';
import NavBar from "./components/NavBar"; //, Footer, Loading 
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import ProtectedRoute from "./auth/ProtectedRoute";
import ExternalApi from './views/ExternalApi';
// import Login from './components/Login';
// import Logout from './components/Logout';

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <div id="app" className="d-flex flex-column h-100">
      <NavBar />
      <div className="container flex-grow-1">
        <Switch>
          {/* <Route path="/" exact component={Home} /> */}
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/external-api" component={ExternalApi} />
        </Switch>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

//   return (
//     <div className="App">
//       <h1>hello oauth test</h1>
//       {!isAuthenticated && (
//         <LoginButton />
//       )}
//       <Profile />
//       {isAuthenticated && (
//         <LogoutButton />
//       )}
//     </div>
//   );
// }

export default App;

import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth/Auth';
import Calculator from './components/Calculator/Calculator';
import Header from './components/Header/Header';
import { useFirebaseAuth } from '@useFirebase';

function App() {
  const { AuthStatus, AuthFunctions } = useFirebaseAuth()

  return (
    <div className="App">
      <Header IsSignedIn={AuthStatus} onSignOut={AuthFunctions.AuthSignOut} />
      
      <Switch>
        <Route exact path="/">
          <Redirect to="/calculator/assessments"/>
        </Route>
        <Route path="/calculator">
          <Calculator />
        </Route>
        <Route path="/auth">
          <Auth AuthFunctions={AuthFunctions} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;

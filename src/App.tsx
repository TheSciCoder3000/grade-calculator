import { Redirect, Route, Switch } from "react-router-dom";
import { useFirebaseAuth } from "@useFirebase";
import "./App.css";

import Auth from "./pages/AuthPages";
import Calculator from "./pages/CalculatorPages/CalculatorRoute";
import Header from "./components/Header/Header";
import Alerts from "@Components/Alerts";

import "@Components/Alerts/Alerts.css";

/**
 * Main App Component
 * @returns JSX Element
 */
function App() {
    const { AuthStatus, AuthFunctions } = useFirebaseAuth();

    return (
        <div className="App">
            <Header IsSignedIn={AuthStatus} onSignOut={AuthFunctions.AuthSignOut} />

            <div className="app-cont">
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/calculator" />
                    </Route>
                    <Route path="/calculator">
                        <Calculator />
                    </Route>
                    <Route path="/auth">
                        <Auth AuthFunctions={AuthFunctions} />
                    </Route>
                </Switch>
                <Alerts />
            </div>
        </div>
    );
}

export default App;

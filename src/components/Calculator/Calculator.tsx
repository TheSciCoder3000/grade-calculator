import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'
import Assessment from './Tabs/Assessment'
import GPA from './Tabs/GPA'
import Semesteral from './Tabs/Semesteral'
import './css/Calculator.css'
import { fakeDbData } from './fakeData'

function Calculator() {
    const { path } = useRouteMatch()

    const db = fakeDbData

    return (
        <div className="calculator-app">
            <div className="calculator-tabs">
                <div className="tab-item">Assessments</div>
                <div className="tab-item">Semesteral</div>
                <div className="tab-item">GPA</div>
            </div>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/assessments"/>
                </Route>
                <Route path={`${path}/assessments`}>
                    <Assessment db={db} />
                </Route>
                <Route path="/semesteral">
                    <Semesteral />
                </Route>
                <Route path="/gpa">
                    <GPA />
                </Route>
            </Switch>
        </div>
    )
}

export default Calculator

/**
 * The calculator will make use of both the local storage and firestore database
 * The firestore database and local storage are 2 seperate databases that are not in sync.
 * Creating an account after using the local storage does not save your data on the firestore database yet.
 * In the future I do plan to give the users an option to save their data into the firestore database or start from scratch
 */

/**
 * TODO: fix the flow of the program
 * 1. render the component
 * 2. after rendering the component check if user has already signed in (this is relatively quick since it's saved in the user's pc)
 * 3. If user has indeed signed in
 *      - attempt to fetch data from the firestore
 *      - if fetch takes longer than 2 seconds, ask the user if he wants to sign out and use the local storage instead
 * 4. if user is not signed in
 *      - fetch data from local storage instead
 */
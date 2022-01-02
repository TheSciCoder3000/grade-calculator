import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'
import './css/Calculator.css'
import { useCalculatorDb } from './CalculatorLogic'
import GPA from './Tabs/GPA'
import SubjectDetail from './Tabs/SubjectDetail'
import ProtectedRoute from './ProtectedRoute'

function Calculator() {
    const { path } = useRouteMatch()

    const [db, dbFunctions] = useCalculatorDb() //{} as IAssessmentDoc// fakeDbData

    return (
        <div className="calculator-app">
            <Switch>
                <Route exact path={`${path}`}>
                    <GPA />
                </Route>
                <ProtectedRoute isAuth={true} path={`${path}/:subjectName`}>
                    <SubjectDetail />
                </ProtectedRoute>
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
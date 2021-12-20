import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'
import Assessment from './Tabs/Assessment'
import GPA from './Tabs/GPA'
import Semesteral from './Tabs/Semesteral'
import './css/Calculator.css'

function Calculator() {
    const { path } = useRouteMatch()

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
                    <Assessment />
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

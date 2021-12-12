import React from 'react'
import { Switch, Route, Redirect, useParams } from 'react-router-dom'
import Assessment from './Tabs/Assessment'
import GPA from './Tabs/GPA'
import Semesteral from './Tabs/Semesteral'

function Calculator() {
    const { tabName } = useParams<{ tabName: string }>()

    return (
        <div>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/assessments"/>
                </Route>
                <Route path="/assessments">
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

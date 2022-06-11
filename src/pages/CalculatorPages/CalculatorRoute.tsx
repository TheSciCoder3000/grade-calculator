import { useFirestore } from '@useFirebase'
import { useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import CalculatorDetails from '../../components/Calculator/Detail'
import CalculatorOverview from '../../components/Calculator/Overview'

/**
 * Calculator Route Component, 
 * Used for routing the users to different calculator features
 * @returns JSX Element
 */
function CalculatorRoute() {
    const { userData } = useFirestore()

    return (
        <div className="calculator-app">
            <Route exact path='/calculator'>
                <CalculatorOverview userData={userData} />
            </Route>
            <Route path='/calculator/:subjectId'>
                <CalculatorDetails />
            </Route>
        </div>
    )
}

export default CalculatorRoute
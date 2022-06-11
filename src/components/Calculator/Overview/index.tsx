import { IUserDoc } from 'Firebase/FirebaseDb'
import React, { useEffect, useState } from 'react'
import GradeTable from "../Table"
import Toggler from '../Toggler'

const DATA = [
  {
    courseId: 'cpe',
    name: 'CPET121',
    mid: 97,
    final: 100
  },
  {
    courseId: 'engm',
    name: 'ENGM121',
    mid: 91,
    final: 92
  },
  {
    courseId: 'math',
    name: 'MATH121',
    mid: 93,
    final: 95
  },
]

interface ICalculatorOverviewProps {
  userData: IUserDoc | null
}

const CaluclatorOverview: React.FC<ICalculatorOverviewProps> = ({ userData }) => {
  const [yearId, setYearId] = useState('')
  const [semId, setSemId] = useState('')

  useEffect(() => {

  }, [userData])

  return (
    <div className='calculator__overview-container'>
      {userData ? 
        <>
          <h1>Course Overview</h1>
          <div className="section-selection">
            <Toggler className='year-cont' items={userData.years.map(year => year.name)} addItemHandler={() => {}} />
            <Toggler className='sem-cont' items={userData.sems.map(sem => sem.name)} addItemHandler={() => {}} />
          </div>
          <GradeTable DATA={DATA} />
        </>
        :
        <div className="loading-data">
          Loading User data
        </div>
      }
    </div>
  )
}

export default CaluclatorOverview
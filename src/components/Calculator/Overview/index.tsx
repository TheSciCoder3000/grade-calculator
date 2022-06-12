import { useFirestore } from '@useFirebase'
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
  console.log('rendering')
  const { dbFunctions } = useFirestore()
  const [yearId, setYearId] = useState('')
  const [semId, setSemId] = useState('')

  useEffect(() => {
    if (!userData) return
    setYearId(userData.years[0].id)
    setSemId(userData.sems[0].id)
  }, [userData])


  const addItemHandler = (field: 'years' | 'sems') => (fieldName: string) => {
    if (!userData) return 

    let newUserData = { ...userData }
    newUserData[field].push({
      name: fieldName,
      id: Math.random().toString(16).substr(2, 12)
    })

    dbFunctions.setUserData(userData?.userUid, newUserData)
      .catch(e => {
        console.log('something went wrong with addItemHandler')
        console.error(e)
      })
  }

  return (
    <div className='calculator__overview-container'>
      {userData ? 
        <>
          <h1>Course Overview</h1>
          <div className="section-selection">
            <Toggler className='year-cont' activeItem={yearId} items={userData.years} addItemHandler={addItemHandler('years')} />
            <Toggler className='sem-cont' activeItem={semId} items={userData.sems} addItemHandler={addItemHandler('sems')} />
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
import { useFirestore } from '@useFirebase'
import { ISubjects, IUserDoc } from 'Firebase/FirebaseDb'
import React, { useEffect, useState, useMemo } from 'react'
import GradeTable from "../Table"
import Toggler from '../Toggler'
import './Overview.css'

const DATA: ISubjects[] = [
  {
    id: 'cpe',
    name: 'CPET121',
    year: '7cb0cb84962b',
    sem: '1c073661e7a9',
    mid: 97,
    final: 100
  },
  {
    id: 'engm',
    name: 'ENGM121',
    year: '7cb0cb84962b',
    sem: '1c073661e7a9',
    mid: 91,
    final: 92
  },
  {
    id: 'math',
    name: 'MATH121',
    year: '7cb0cb84962b',
    sem: '1c073661e7a9',
    mid: 93,
    final: 95
  },
]

// Component Props Interface
interface ICalculatorOverviewProps {
  /**
   * object containing the user's firestore data.
   * **This updates every time changes within the firestore occurs.**
   */
  userData: IUserDoc | null
}


const CaluclatorOverview: React.FC<ICalculatorOverviewProps> = ({ userData }) => {
  const { dbFunctions } = useFirestore()
  const [yearId, setYearId] = useState('')
  const [semId, setSemId] = useState('')



  // ================================== State Updates ==================================
  // Initial Table render
  const [initialTableRender, setInitialTableRender] = useState(false)     // used to track if the use effect has already been used
  useEffect(() => {
    console.log(!userData, 'and', !initialTableRender)
    // if userData is null or table has already been rendered
    if (!userData || initialTableRender) return                     // do not update year and sem states

    // set year and sem state to first index everytime userData updates
    setYearId(userData.years[0].id)
    setSemId(userData.sems[0].id)
    setInitialTableRender(true)
  }, [userData])


  // Subject data filtering update - used to filter the subject data by year and sem ids
  const subjectData = DATA
  const data = useMemo(
    () => subjectData.filter(subj => (subj.year === yearId && subj.sem === semId)), 
    [yearId, semId]
  )



  // ================================== Toggler CRUD Functions ==================================
  type HandlerType = 'sems' | 'years'

  const addItemHandler = (field: HandlerType) => (fieldName: string) => {
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

  const removeItemHandler = (field: HandlerType) => (itemId: string) => {
    if (!userData) return

    let newUserData = {...userData}
    const itemIndx = newUserData[field].findIndex(item => item.id === itemId)
    if (itemIndx !== -1) newUserData[field].splice(itemIndx, 1)
    dbFunctions.setUserData(userData.userUid, newUserData)
      .catch(e => {
        console.log('error at remove item handler: ', e.message)
        console.error(e)
      })
  }
  
  const updateItemHandler = (field: HandlerType) => (itemId: string, value: string) => {
    if (!userData) return

    let newUserData = {...userData}
    let item = newUserData[field].find(itemInstance => itemInstance.id === itemId)
    if (item) item.name = value
    dbFunctions.setUserData(userData.userUid, newUserData)
      .catch(e => {
        console.log('error at update item handler: ', e.message)
        console.error(e)
      })
  }

  return (
    <div className='calculator__overview-container'>
      {userData ? 
        <>
          <h1>Course Overview</h1>
          <div className="section-selection">
            <Toggler 
              className='year-cont' 
              activeItem={yearId} 
              items={userData.years} 
              addItemHandler={addItemHandler('years')} 
              removeItemHandler={removeItemHandler('years')}
              updateItemHandler={updateItemHandler('years')}
              onItemClick={setYearId} />

            <Toggler 
              className='sem-cont' 
              activeItem={semId} 
              items={userData.sems} 
              addItemHandler={addItemHandler('sems')} 
              removeItemHandler={removeItemHandler('sems')}
              updateItemHandler={updateItemHandler('sems')}
              onItemClick={setSemId} />
              
          </div>
          <GradeTable DATA={data} />
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
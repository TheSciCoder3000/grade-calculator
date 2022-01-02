import React from 'react'
import { NavLink as Link, useLocation, useParams } from 'react-router-dom'

const SubjectDetail = () => {
    const location = useLocation()
    const locations = location.pathname.split('/').slice(1)
    const { subjectName } = useParams<{subjectName: string}>()

    return (
        <div className='subject-detail'>
            <div className="crumbs">
                {locations.map((path, indx) => {
                    const pathTo = locations.slice(0, indx + 1).join('/')
                    console.log('path to', pathTo)
                    return (
                        <Link className="crumb" exact to={`/${pathTo}`}>{path}</Link>
                    )
                })}
            </div>
            {subjectName}
        </div>
    )
}

export default SubjectDetail

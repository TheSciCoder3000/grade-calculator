import React from 'react'
import { Link } from 'react-router-dom'

interface ICourseCellLink {
    courseId: string
    courseName: string
}
const CourseCellLink: React.FC<ICourseCellLink> = ({ courseId, courseName }) => {
  return (
    <Link to={`/calculator/${courseId}`}>{courseName}</Link>
  )
}

export default CourseCellLink
import GradeTable from "../Table"

const COLUMNS = [
  {
      Header: 'Course Name',
      accessor: 'name'
  },
  {
      Header: 'Midterm',
      accessor: 'mid'
  },
  {
      Header: 'Finals',
      accessor: 'final'
  },
]

const DATA = [
  {
    name: 'CPET121',
    mid: 97,
    final: 100
  },
  {
    name: 'ENGM121',
    mid: 91,
    final: 92
  },
  {
    name: 'MATH121',
    mid: 93,
    final: 95
  },
]

const CaluclatorOverview = () => {
  return (
    <div className='calculator__overview-container'>
      <h1>Course Overview</h1>
      <GradeTable COLUMNS={COLUMNS} DATA={DATA} />
    </div>
  )
}

export default CaluclatorOverview
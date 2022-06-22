import { ISubjects } from 'Firebase/FirebaseDb'
import { useMemo, FC } from 'react'
import { useTable, useSortBy, useRowSelect, CellProps, Column } from 'react-table'
import Checkbox from './Checkbox'
import CourseCellLink from './CourseLink'
import SortIcon from './SortIcon'
import './Table.css'

// type $FixMe = any
interface IRow {
  original: ISubjects
  values: ISubjects
}


interface IColumn {
  Header: string
  accessor: string
  Cell?: string | ((cell: { row: IRow }) => JSX.Element | string)
  Footer: string | ((row: { rows: IRow[] }) => JSX.Element | string)
}

interface ITableProps {
    DATA: ISubjects[]
}

const COLUMNS: IColumn[] = [
  {
      Header: 'Course Name',
      accessor: 'name',
      Cell: (cell) => {
        const value = cell.row.original
        return (
          <CourseCellLink courseName={value.name} courseId={value.id} />
        )
      },
      Footer: 'Total'
  },
  {
      Header: 'Midterm',
      accessor: 'mid',
      Footer: (cell) => {
        const midSum = cell.rows.reduce((partialSum, row) => {
          return partialSum + row.values.mid
        }, 0)
        return (
          <>{(midSum/cell.rows.length).toFixed(2)}</>
        )
      }
  },
  {
      Header: 'Finals',
      accessor: 'final',
      Footer: ({ rows }) => {
        const finalSum = rows.reduce((partialSum, row) => {
          return partialSum + row.values.final
        }, 0)
        return (
          <>{Math.round(finalSum/rows.length)}</>
        )
      }
  },
]

const GradeTable: FC<ITableProps> = (props) => {
  // Initialize columns
  const columns = useMemo(() => COLUMNS as Column<ISubjects>[], [])

  // Intialize Data
  const data = useMemo(() => props.DATA, [props.DATA])

  // Initialize table props from react table
  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      footerGroups,
      selectedFlatRows
  } = useTable(
    { columns, data },
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: 'selection',
            Header: ({ getToggleAllRowsSelectedProps }) => {
              return <Checkbox 
                        {...getToggleAllRowsSelectedProps()} 
                        rowId={'header'} 
                        header={true} className='header-checkbox' />
            },
            Cell: ({ row }: React.PropsWithChildren<CellProps<ISubjects, any>>) => {
              return <Checkbox {...row.getToggleRowSelectedProps()} rowId={row.original.id} />
            }
          },
          ...columns
        ]
      })
    }
  )


  return (
      <table {...getTableProps({ className: 'calculator__table' })}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, indx) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <div className="table-data-cont">
                      {column.render('Header')}
                      <span>
                        {column.id !== 'selection' && (
                          <SortIcon key={indx}
                            sort={column.isSorted ? (column.isSortedDesc ? 'desc' : 'asc') : ''} />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>

          <tfoot>
            {footerGroups.map(footerGroup => (
              <tr {...footerGroup.getFooterGroupProps()}>
                {footerGroup.headers.map(column => (
                  <td {...column.getFooterProps()}>
                    {column.render('Footer')}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
      </table>
  )
}

export default GradeTable
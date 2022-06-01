import { useMemo, FC } from 'react'
import { useTable, useSortBy, useRowSelect } from 'react-table'
import Checkbox from './Checkbox'
import SortIcon from './SortIcon'

type $FixMe = any
interface IGradeTable {
    COLUMNS: $FixMe
    DATA: $FixMe
}

const GradeTable: FC<IGradeTable> = ({ COLUMNS, DATA }) => {
    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => DATA, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
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
                // ! Fix typescript
                // @ts-ignore
                return <Checkbox {...getToggleAllRowsSelectedProps()} />
              },
              Cell: ({ row }) => {
                // ! Fix typescript
                // @ts-ignore
                return <Checkbox {...row.getToggleRowSelectedProps()} />
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
                          <SortIcon key={indx}
                            sort={column.isSorted ? (column.isSortedDesc ? 'desc' : 'asc') : ''} />
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
        </table>
    )
}

export default GradeTable
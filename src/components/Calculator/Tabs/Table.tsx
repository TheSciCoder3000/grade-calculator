import React, { ChangeEventHandler, KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { getFilteredFields } from '../CalculatorLogic'

/**
 * Assessment type witout the terms and type
 */
export type AssessmentType = {
    [key: string]: string | number | null;
    name: string;
    grade: number | null;
}
// Table component prop type
interface ITableProps {
    docs: AssessmentType[]
    updateDb: any
}

const Table: React.FC<ITableProps> = ({ docs, updateDb }) => {
    console.log('table docs', docs)
    const fields = getFilteredFields(docs, ['name', 'grade'])
    
    return (
        <table>
            <thead>
                <tr className="table-header">
                    <th className="checkbox-cont"><input className="checkbox" type="checkbox" /></th>
                    <th>Name</th>
                    {fields.map((field: string) => 
                        <th key={field}>{field}</th>
                    )}
                    <th>Grade</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {docs.map((doc, indx) => <TableDataRow key={indx} fields={fields} doc={doc} />)}
            </tbody>
            
        </table>
    )
}


type IDataRow = { doc: AssessmentType, fields: string[], updateDb?: any }
const TableDataRow: React.FC<IDataRow> = ({ doc, fields }) => {
    interface IChanged {
        [x: string]: boolean
    }
    const [changed, setChanged] = useState(fields.reduce((prev, field) => {
        prev[field] = false
        return prev
    }, {name: false, grade: false} as IChanged))

    const onSaveHandler = () => {

    }

    const onDataCellChanged = (fieldName: string, status: boolean) => {
        setChanged(field => {
            let copy = {...field}
            copy[fieldName] = status
            return copy
        })
    }
    return (
        <tr className="table-data">
            <td className="checkbox-cont"><input type="checkbox" className="checkbox" /></td>
            <DataCell className="assessment-name" value={doc.name} onChange={change => onDataCellChanged('name', change)} />
            {fields.filter(field => !['name', 'grade'].includes(field)).map((field) => 
                <td key={field} className="assessment-custom">
                    {doc[field]}
                </td>
            )}
            <DataCell className="assessment-grade" value={doc.grade} onChange={change => onDataCellChanged('grade', change)} />
            {Object.values(changed).includes(true) &&
                <td className="save-row">
                    <button className="save-btn" onClick={onSaveHandler}>S</button>
                </td>
            }
        </tr>
    )
}


interface IDataCell {
    value: string | number | null,
    className: string
    onChange?: (change: boolean) => void
}
const DataCell: React.FC<IDataCell> = ({ value, className, onChange }) => {
    const [inputShow, setInputShow] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [cellVal, setCellVal] = useState(value)

    const onKeyHandler: KeyboardEventHandler<HTMLInputElement> = e => {
        switch (e.code) {
            case 'Escape':
                setInputShow(false)
                setCellVal(value)
                onChange && onChange(false)
                break;

            case 'Enter':
                setInputShow(false)
                break;
        
            default:
                break;
        }
    }

    const onChangeHandler: ChangeEventHandler<HTMLInputElement> = e => {
        if (onChange) onChange(e.target.value !== value?.toString()) 
        setCellVal(e.target.value)
    }

    useEffect(() => {
        if (!inputShow) return
        const clickHandler = (e: MouseEvent) => {
            if (e.target !== inputRef.current) setInputShow(false)
        }
        window.addEventListener('click', clickHandler)

        inputRef.current?.focus()
        return () => window.removeEventListener('click', clickHandler)
    }, [inputShow])

    return (
        <td className={className} onClick={() => setInputShow(true)}>
            {inputShow ?
                <input className='data-cell-input' onKeyDown={onKeyHandler} onChange={onChangeHandler} ref={inputRef} type="text" value={cellVal || undefined} />
                : cellVal || ''
            }
        </td>
    )
}


export default Table
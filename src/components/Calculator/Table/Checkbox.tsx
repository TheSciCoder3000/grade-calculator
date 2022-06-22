import React, { MutableRefObject, useState } from 'react'
import { TableToggleCommonProps } from 'react-table'

// type InputProps = React.HTMLProps<HTMLInputElement>

interface CheckboxProps extends TableToggleCommonProps {
    rowId: string,
    header?: boolean
}
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ indeterminate, rowId, header, ...rest }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>(null)
    const resolvedRef = (ref as MutableRefObject<HTMLInputElement>) || defaultRef

    React.useEffect(() => {
        if (resolvedRef) resolvedRef.current.indeterminate = !!indeterminate
    }, [resolvedRef, indeterminate])

    
    return (
        <div className='check-cont'>
            <input  id={`checkbox-${rowId}`} type="checkbox" ref={resolvedRef} {...rest} />
            <label className={header ? 'header-check' : ''} htmlFor={`checkbox-${rowId}`}>
                {resolvedRef.current?.checked && <>&#10004;</>}
            </label>
        </div>
    )
})

export default Checkbox
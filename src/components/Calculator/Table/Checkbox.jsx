import React from 'react'

// type InputProps = React.HTMLProps<HTMLInputElement>

const Checkbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
    const deafultRef = React.useRef(null)
    const resolvedRef = ref

    React.useEffect(() => {
        if (resolvedRef) resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])
    return (
        <>
            <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
    )
})

export default Checkbox
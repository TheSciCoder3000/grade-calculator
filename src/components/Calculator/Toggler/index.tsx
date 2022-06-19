import React, { useState, useEffect, useRef } from 'react'

interface ITogglerProps {
    className?: string
    items: { name: string, id: string }[]
    activeItem: string
    addItemHandler: (fieldName: string) => any
    removeItemHandler: (itemId: string) => any
    updateItemHandler: (ItemId: string, value: string) => any
    onItemClick: (itemId: string) => void
}
const Toggler: React.FC<ITogglerProps> = ({
  className, activeItem, items, 
  addItemHandler, 
  removeItemHandler, 
  updateItemHandler, 
  onItemClick 
}) => {
  const [toggleFieldInput, setToggleFieldInput] = useState(false)
  const [fieldInputText, setFieldInputText] = useState('')
  const fieldInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (toggleFieldInput) fieldInput.current?.focus()
  }, [toggleFieldInput])

  const resetInputField = () => {
    setToggleFieldInput(false)
    setFieldInputText('')
  }

  const fieldInputHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (fieldInput.current) addItemHandler(fieldInput.current.value)
      resetInputField()
    } else if (e.key === 'Escape') resetInputField()
  }

  return (
    <div className={`toggler-cont ${className}`}>
        {items.map((item) => (
          <div key={`${item.name}-${item.id}`} 
            onClick={() => onItemClick(item.id)} 
            className={`item-cont ${(activeItem === item.id) && 'active-item'}`}>
            {item.name}
          </div>
        ))}
        {toggleFieldInput && (
          <input 
            ref={fieldInput}
            type="text" 
            className="field-input" 
            value={fieldInputText} 
            onChange={e => setFieldInputText(e.target.value)}
            onBlur={() => resetInputField()}
            onKeyDown={fieldInputHandler} />
        )}
        <button className="add-item-cont" onClick={() => setToggleFieldInput(true)}>+</button>
    </div>
  )
}

export default Toggler
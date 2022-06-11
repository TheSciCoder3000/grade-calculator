import React from 'react'

interface ITogglerProps {
    className?: string
    items: string[]
    addItemHandler: () => any
}
const Toggler: React.FC<ITogglerProps> = ({ className, items, addItemHandler }) => {
  return (
    <div className={`toggler-cont ${className}`}>
        {items.map((item, indx) => (
            <div key={`${item}-${indx}`} className="item-cont">
                {item}
            </div>
        ))}
        <button className="add-item-cont" onClick={addItemHandler}>+</button>
    </div>
  )
}

export default Toggler
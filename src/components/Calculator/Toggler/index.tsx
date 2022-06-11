import React from 'react'

interface ITogglerProps {
    className?: string
    items: string[]
    addItemHandler: (fieldName: string) => any
}
const Toggler: React.FC<ITogglerProps> = ({ className, items, addItemHandler }) => {
  return (
    <div className={`toggler-cont ${className}`}>
        {items.map((item, indx) => (
            <div key={`${item}-${indx}`} className="item-cont">
                {item}
            </div>
        ))}
        <button className="add-item-cont">+</button>
    </div>
  )
}

export default Toggler
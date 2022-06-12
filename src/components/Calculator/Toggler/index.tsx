import React from 'react'

interface ITogglerProps {
    className?: string
    items: { name: string, id: string }[]
    activeItem: string
    addItemHandler: (fieldName: string) => any
}
const Toggler: React.FC<ITogglerProps> = ({ className, activeItem, items, addItemHandler }) => {
  return (
    <div className={`toggler-cont ${className}`}>
        {items.map((item) => (
            <div key={`${item.name}-${item.id}`} className={`item-cont ${(activeItem === item.id) && 'active-item'}`}>
                {item.name}
            </div>
        ))}
        <button className="add-item-cont">+</button>
    </div>
  )
}

export default Toggler
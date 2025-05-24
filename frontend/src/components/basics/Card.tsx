import React from "react"

function Card({
  children, 
  className,
  onClick
  }:
  {children : React.ReactNode,
  className?: string,
  onClick?: () => void
}) {


  return (
    <div onClick={onClick} className={'container p-10 border rounded-lg shadow-sm bg-white ' + className}>
      {children}
    </div>
  )
}

export default Card

import React from "react"

function Card({
  children, 
  className}
  :
  {children : React.ReactNode,
  className?: string}) {


  return (
    <div className={'container p-10 border rounded-lg shadow-sm bg-white ' + className}>
      {children}
    </div>
  )
}

export default Card

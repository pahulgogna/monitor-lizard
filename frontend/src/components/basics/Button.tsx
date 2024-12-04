import React, { useState } from "react"

function Button({
    className,
    children,
    onClick = () => Promise.resolve()
}: {
    className?: string,
    onClick?: () => Promise<void>,
    children : React.ReactNode
}){

    const [disabled, setDisabled] = useState(false)

    async function onClickHandler() {
        setDisabled(true)
        try{
            await onClick()
        }
        catch{
            setDisabled(false)
            return
        }
        setDisabled(false)
    }

  return (
      <button className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-0 focus:ring-gray-300 font-medium rounded-lg text-xs sm:text-sm px-5 py-2.5 my-2 w-full disabled:bg-slate-600 disabled:cursor-wait ${disabled ? "cursor-wait" : ""} select-none ` + className } onClick={onClickHandler} disabled={disabled}>{children}</button>
  )
}

export default Button

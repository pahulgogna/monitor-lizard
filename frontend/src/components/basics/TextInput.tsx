import React from 'react'

function TextInput({
    lable = "",
    placeholder = "",
    value,
    setValue,
    className = "",
    hidden = false
}: {
    lable?: string,
    placeholder?: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    className?: string,
    hidden?: boolean
}) {
  return (
    <div className={`mt-3 ${className}`}>
        <label htmlFor={lable} className="block mb-2 text-md font-medium">{lable}</label>
        <input type={hidden ? "password":"text"} id={lable} placeholder={placeholder} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-md focus:ring-blue-500 focus:border-blue-500" onChange={(e) => {
            setValue(e.target.value)
        }} value={value}/>
    </div>
  )
}

export default TextInput

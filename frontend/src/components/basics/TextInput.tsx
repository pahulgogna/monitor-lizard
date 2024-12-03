import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'

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


  const [showPassword, setShowPassword] = useState(hidden)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }



  return (
    <div className={`mt-3 ${className}`}>
        <label htmlFor={lable} className="block mb-2 text-md font-medium">{lable}</label>

        <div className='relative'>
          <input type={showPassword ? "password":"text"} id={lable} placeholder={placeholder} className="block w-full pr-5 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-md focus:ring-blue-500 focus:border-blue-500" onChange={(e) => {
              setValue(e.target.value)
          }} value={value}/>
          {hidden &&
            <button
              type="button"
              className=" absolute right-0 flex pr-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </button>
          }
        </div>
    </div>
  )
}

export default TextInput

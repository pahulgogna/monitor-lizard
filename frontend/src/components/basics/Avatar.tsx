import React from "react";


export function Avatar({children, className, onClick} : {
    children: React.ReactNode, 
    className?: string, 
    onClick?: () => void
} ) {

    return(
        <div className={"relative inline-flex items-center justify-center shadow-md w-10 h-10 overflow-hidden border rounded-full cursor-pointer " + className} onClick={onClick}>
            <span className="font-medium text-gray-600 uppercase">
                {typeof children === 'string' ? children[0] : ""}
            </span>
        </div>
    )
    
}
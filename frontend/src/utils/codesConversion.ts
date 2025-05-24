

export function ResponseTimeToTextColor(status: number){
    if(status >= 0 && status <= 100){
        return " text-green-400 "
    }
    else if(status <= 300){
        return " text-green-500 "
    }
    else if(status <= 1000){
        return " text-yellow-400 "
    }
    else if(status <= 3000){
        return " text-orange-400 "
    }
    else if(status <= 7000){
        return " text-red-500 "
    }
    else{
        return " text-red-700 "
    }
}

export function statusCodeToBGColorDark(status: number){
    if(status > 0 && status < 400){
        return " bg-green-600 "
    }
    else{
        return " bg-red-600 "
    }
}

export function statusCodeToBGColorLight(status: number){
    if(status > 0 && status < 400){
        return " bg-green-300 "
    }
    else{
        return " bg-red-300 "
    }
}

export function codeToStatus(code: number){
    return code >= 200 && code <= 299 ? true : false
}
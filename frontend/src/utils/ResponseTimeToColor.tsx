

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
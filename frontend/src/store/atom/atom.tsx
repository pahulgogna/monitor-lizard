import { MonitorSchema } from "@pahul100/monitor-lizard-common";
import axios from "axios";
import { atom, atomFamily, selector, selectorFamily } from "recoil";


export interface FullMonitorSchema extends MonitorSchema {
    id: string
}

interface UserSchema {
    name: string,
    email: string
}

export const userSelector = selector({
    key: "userSelector",
    get: async ({get}) => {
        const token = get(tokenAtom)
        if(token){
            const res: UserSchema = (await axios.get(`${import.meta.env.VITE_BEEP}/user`, {
                headers: {Authorization: `Bearer ${token}`}
            })).data

            return res
        }
        return null
    }
})

export const tokenAtom = atom({
    key: "tokenAtom",
    default: selector({
        key: "tokenSelector",
        get: async () => {
            try{
                const token = localStorage.getItem("token")
    
                if(token){
                    const res = (await axios.get(`${import.meta.env.VITE_BEEP}/user/ping`, {
                        headers: {Authorization: `Bearer ${token}`}
                    })).data
    
                    if(res.detail == "pong"){
                        return token
                    }
                }
                return ""
            }
            catch{
                return ""
            }
        }
    })
})

export const monitorsAtomFamily = atomFamily({
    key: "monitorsAtomFamily",
    default: selectorFamily({
        key: "monitorSelectorFamily",
        get: id => async () => {
            if(!id){
                return null
            }
            else{
                try{
                    const token = localStorage.getItem("token")
                    if(token){
                        const monitor: FullMonitorSchema = (await axios.get(`${import.meta.env.VITE_BEEP}/monitor/${String(id)}`, {
                            headers: {Authorization: `Bearer ${token}`}
                        })).data
    
                        return monitor
                    }
                    else{
                        return null
                    }
                }
                catch{
                    return null
                }
            }
        }
    })
})

export const monitorsBulkAtom = atom({
    key: "bulkMonitors",
    default: selector({
        key: "bulkSelector",
        get: async () => {
            try{
                const monitors: FullMonitorSchema[] = (await axios.get(`${import.meta.env.VITE_BEEP}/monitor/all`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
                })).data
                return monitors
            }
            catch{
                []
            }
        }
    })
})
import { Trash2 } from "lucide-react"
import Button from "./basics/Button"
import Card from "./basics/Card"
import Tag from "./basics/Tag"
import Confirm from "./overlays/Confirm"
import { useState } from "react"
import Loading from "./overlays/Loading"
import axios from "axios"
import { useSetRecoilState } from "recoil"
import { FullMonitorSchema, monitorsBulkAtom } from "../store/atom/atom"
import { ResponseTimeToTextColor } from "../utils/ResponseTimeToColor"
import PulsatingDot from "./basics/PulsatingDot"

function MonitorCard({
    title, 
    url,
    onlineIN,
    onlineUS,
    onlineEU,
    statusIN,
    statusUS,
    statusEU,
    responseTime,
    id
} : {
        title: string,
        url: string,
        onlineIN: boolean,
        onlineUS: boolean,
        onlineEU: boolean,
        statusIN: number,
        statusEU: number,
        statusUS: number,
        responseTime: number,
        id: string
    }) {

        const [confirm, setConfirm] = useState(false)
        const [loading, setLoading] = useState(false)

        const openConfirm = async () => {setConfirm(true)}
        const closeConfirm = async () => {setConfirm(false)}

        const setMonitors = useSetRecoilState(monitorsBulkAtom)

        async function handleDelete () {
            
            closeConfirm()

            setLoading(true)

            await axios.delete(`${import.meta.env.VITE_BEEP}/monitor/` + id, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            })

            const monitors: FullMonitorSchema[] = (await axios.get(`${import.meta.env.VITE_BEEP}/monitor/all`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            })).data

            setMonitors(monitors)

            setLoading(false)


            }


    return (
        <Card className="py-4 pt-6">

            {loading && <Loading/>}

            {confirm && <Confirm message={"do you really want to delete the monitor '" + title + "'?"} onCancel={closeConfirm} onConfirm={handleDelete}/>}
            
            <div className="flex justify-between mb-1">
                <div className="flex-col">
                    <div className="text-xl font-bold">
                        {title}
                    </div>
                    <a href={url} target="_blank" className="text-sm text-slate-400 ">
                        {url.length < 18 ? url : url.slice(0, 17) + "..."}
                    </a>
                </div>
                <Tag online={(onlineIN && onlineEU) || (onlineEU && onlineUS) || (onlineIN && onlineUS)}/>
            </div>
            <div className="flex justify-between">
                <div className="text-slate-600 font-light">
                    Response Time
                </div>
                <div className={ResponseTimeToTextColor(responseTime) + "text-md font-semibold"}>
                    {responseTime ?? "NA"}ms
                </div>
            </div>

            <div className="border-t mt-2">
                <div className="flex justify-between mt-2">
                    <div className="text-slate-600 font-thin flex gap-1">
                        <div className="pb-1 font-normal">
                            Central India
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <PulsatingDot status={statusIN}/>
                        {statusIN ?? "None"}
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="text-slate-600 font-thin flex gap-1">
                        <div className="pb-1 font-normal">
                            East US
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <PulsatingDot status={statusUS}/>
                        {statusUS ?? "None"}
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="text-slate-600 font-thin flex gap-1">
                        <div className="pb-1 font-normal">
                            West Europe
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <PulsatingDot status={statusEU}/>
                        {statusEU ?? "None"}
                    </div>
                </div>
                
            </div>
            <div className="flex gap-1">
                <Button className="m-0 bg-white border  hover:bg-slate-50 flex justify-center" onClick={openConfirm}>
                    <div className="text-slate-950 flex ">
                        <Trash2 className="h-4 w-4 m-0 mr-2"/>
                        Delete
                    </div>
                </Button>
            </div>
        </Card>
    )
}

export default MonitorCard

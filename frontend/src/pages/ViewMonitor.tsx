import { useNavigate, useParams } from "react-router-dom"
import { useRecoilValueLoadable } from "recoil"
import { monitorsAtomFamily } from "../store/atom/atom"
import Loading from "../components/overlays/Loading"
import WorldMapWithPulsatingDots from "../components/WorldMapWithPulsatingDots"
import Tag from "../components/basics/Tag"
import { codeToStatus } from "../utils/codesConversion"

function ViewMonitor() {

    const { id } = useParams()
    const monitorData = useRecoilValueLoadable(monitorsAtomFamily(id))
    const navigate = useNavigate()


    if(monitorData.state == "loading"){
        return (
            <Loading/>
        )
    }

    else if(monitorData.state == "hasValue" && monitorData.contents){

        return (
            <div className="flex flex-col h-full p-5 pt-7">
                <div className="flex flex-col gap-1">
                    <div>
                        <div className="font-bold text-2xl">
                            {monitorData.contents.name}
                        </div>
                        <a href={monitorData.contents.url} target="_blank" className="text-slate-500 hover:text-slate-600 underline">
                            {monitorData.contents.url}
                        </a>
                    </div>
                    <div>
                        <Tag online={(codeToStatus(monitorData.contents.centralIndia) && codeToStatus(monitorData.contents.westEurope)) || (codeToStatus(monitorData.contents.westEurope) && codeToStatus(monitorData.contents.eastUS)) || (codeToStatus(monitorData.contents.centralIndia) && codeToStatus(monitorData.contents.eastUS))}/>
                    </div>
                </div>

                <div>

                    <WorldMapWithPulsatingDots 
                        centralIndia={monitorData.contents.centralIndia}
                        westEU={monitorData.contents.westEurope}
                        eastUS={monitorData.contents.eastUS}
                        responseTimeCI={monitorData.contents.responseTimeIN}
                        responseTimeEUS={monitorData.contents.responseTimeUS}
                        responseTimeWE={monitorData.contents.responseTimeEU}
                        showStatus
                    />

                </div>

                <div className="text-slate-400">

                    *hover over the locations to see more information

                </div>
            </div>
        )
    }

    else{
        if(monitorData.contents == null){
            navigate("/dashboard")
            return
        }
    }
}

export default ViewMonitor
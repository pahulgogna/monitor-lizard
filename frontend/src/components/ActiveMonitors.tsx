import { useRecoilValueLoadable } from "recoil"
import MonitorCard from "./MonitorCard"
import { monitorsBulkAtom } from "../store/atom/atom"
import Loading from "./overlays/Loading"
import { useMemo } from "react"

function ActiveMonitors() {

  const monitors = useRecoilValueLoadable(monitorsBulkAtom)

  const monitors_ = useMemo(() => {
    if (monitors.state === "hasValue" && monitors.contents) {
      return monitors.contents.map((monitor, i) => {
        return <MonitorCard key={i} id={monitor.id} 
            title={monitor.name} url={monitor.url} 
            responseTime={
              ([monitor.responseTimeEU, 
              monitor.responseTimeIN, 
              monitor.responseTimeUS]
              .reduce((a, b) => {
                    return a + b
                  }, 0))/3
                }
            statusUS={monitor.eastUS} statusEU={monitor.westEurope} statusIN={monitor.centralIndia} 
            onlineIN={monitor.centralIndia >= 200 && monitor.centralIndia <= 299 ? true : false}
            onlineUS={monitor.eastUS >= 200 && monitor.eastUS <= 299 ? true : false}
            onlineEU={monitor.westEurope >= 200 && monitor.westEurope <= 299 ? true : false}
          />
      })
    }
    return [];
  }, [monitors]);
  

  if(monitors.state === "loading"){
    return (
      <Loading/>
    )
  }

  else if(monitors.state === "hasValue"){

    return (
      <div>
        {monitors.contents?.length ?
          <>
            <div className="mt-10 text-xl font-semibold">
                Your Monitors
            </div>  
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {
                monitors_
              }
            </div>
          </>
          :null
        }
      </div>
    )
  }
}

export default ActiveMonitors

import { useRecoilValueLoadable } from "recoil"
import MonitorCard from "./MonitorCard"
import { monitorsBulkAtom } from "../store/atom/atom"
import Loading from "./overlays/Loading"

function ActiveMonitors() {

  const monitors = useRecoilValueLoadable(monitorsBulkAtom)

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
                monitors.contents.map((v, i) => {
                  return <MonitorCard key={i} id={v.id} title={v.name} url={v.url} responseTime={v.responseTime} status={v.status} online={v.status >= 200 && v.status <= 299 ? true : false}/>
                })
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

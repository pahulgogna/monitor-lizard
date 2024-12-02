import { useRecoilValueLoadable } from 'recoil'
import InfoCard from './InfoCard'
import { monitorsBulkAtom } from '../store/atom/atom'
import { useEffect, useState } from 'react'
import { ResponseTimeToTextColor } from '../utils/ResponseTimeToColor'

function Information() {

  const monitors = useRecoilValueLoadable(monitorsBulkAtom)
  const [data, setData] = useState({
    total: 0,
    avgResponseTime: 0,
    maxResponseTime: 0
  })

  useEffect(()=> {
    if(monitors.state === "hasValue"){
      let monitorsArray = monitors.contents 
      if(monitorsArray){
        setData(d => ({...d, total: monitorsArray.length}))

        let sum = 0
        let max = 0

        for(let monitor of monitorsArray){
          sum += monitor.responseTime
          if(max < monitor.responseTime){
            max = monitor.responseTime
          }
        }

        setData(d => ({...d, avgResponseTime: parseFloat((sum/d.total).toFixed(2)), maxResponseTime: max}))

      }
    }
  }, [monitors.state, monitors.contents])

  if(monitors.state === "loading"){
      return(
        <div>
          Loading...
        </div>
      )
  }

  else if(monitors.state === "hasValue"){
      return (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <InfoCard title="Total Monitors" description="Active monitoring endpoints" value= {data.total.toString() + "/6"}/>
        <InfoCard title="Response Time" description="Average across all monitors" value={data.avgResponseTime.toString() +  "ms"} valueClassName={ResponseTimeToTextColor(data.avgResponseTime)}/>
        <InfoCard title="Response Time(MAX)" description="Highest across all monitors."
        value={data.maxResponseTime.toString() + "ms"} valueClassName={ResponseTimeToTextColor(data.maxResponseTime)}/>
      </div>
    )
  }
}

export default Information

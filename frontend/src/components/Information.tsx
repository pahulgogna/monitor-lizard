import { useRecoilValueLoadable } from 'recoil'
import InfoCard from './InfoCard'
import { monitorsBulkAtom } from '../store/atom/atom'
import { useEffect, useState } from 'react'
import { ResponseTimeToTextColor } from '../utils/ResponseTimeToColor'
import Button from './basics/Button'
import { useNavigate } from 'react-router-dom'

function Information() {
  
  const navigate = useNavigate()
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

          let avg = ([monitor.responseTimeEU, 
            monitor.responseTimeIN, 
            monitor.responseTimeUS]
            .reduce((a, b) => {
                  return a + b
                }, 0))/3

          sum += avg
          if(max < avg){
            max = avg
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
        monitors.contents?.length ?
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <InfoCard title="Total Monitors" description="Active monitoring endpoints" value= {data.total.toString() + "/6"}/>
          <>
          <InfoCard title="Response Time" description="Average across all monitors" value={data.avgResponseTime.toString() +  "ms"} valueClassName={ResponseTimeToTextColor(data.avgResponseTime)}/>
          <InfoCard title="Response Time(MAX)" description="Highest across all monitors."
          value={data.maxResponseTime.toString() + "ms"} valueClassName={ResponseTimeToTextColor(data.maxResponseTime)}/>
          </>
          </div>:
          <>
            <div className='flex justify-center mt-10'>
              <div>
                <div className='text-2xl md:text-3xl font-bold flex justify-center rounded'>
                    Create your first monitor!
                </div>
                    <Button onClick={async () => {
                      navigate('/dashboard/new')
                    }}>
                      New
                    </Button>
                </div>
            </div>
          </>
        )
  }
}

export default Information

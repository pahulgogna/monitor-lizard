import { useState } from 'react'
import Button from './basics/Button'
import Card from './basics/Card'
import TextInput from './basics/TextInput'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FullMonitorSchema, monitorsBulkAtom } from '../store/atom/atom'
import { useSetRecoilState } from 'recoil'

function CreateMonitorCard() {

  const setMonitors = useSetRecoilState(monitorsBulkAtom)

  function isUrlValid(userInput: string): boolean {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
  }

  async function UpdateMonitors() {
      const monitors: FullMonitorSchema[] = (await axios.get(`${import.meta.env.VITE_BEEP}/monitor/all`, {
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
    })).data

    setMonitors(monitors)
  }

  const [name, setName] = useState("")
  const [url, setUrl] = useState("")

  const navigate = useNavigate()

  async function handleCreate(){
      if(name == ""  || url == ""){
        if(name == "" && url == ""){
              toast.error("Please fill in all the required fields to create a monitor.", {
                  position: "bottom-right"
              })
              return
          }

          else if(name == ""){
              toast.error("Name is required.", {
                  position: "bottom-right"
              })
              return
          }
          else if(url == ""){
              toast.error("URL is required.", {
                  position: "bottom-right"
              })
              return
            }
          }
          else if(!isUrlValid(url)){
              toast.error("Invalid URL.", {
                  position: "bottom-right"
              })
              return
          }
          else{
              await axios.post(`${import.meta.env.VITE_BEEP}/monitor/create`, {name: name, url: url}, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            })
            .then(async () => {
              await UpdateMonitors()
  
              navigate('/dashboard')
            }).catch((e) => {
              if(e.response && e.response.data){
                if(e.response.data.detail){
                  toast.error(e.response.data.detail, {
                    position: "bottom-right"
                })
                return
              }
              else{
                  toast.error("Internal Error Occurred", {
                    position: "bottom-right"
                })
                return
              }
              
            }
            else{
                toast.error("Internal Error Occurred", {
                    position: "bottom-right"
                })
                return    
              }
            })

          
  }
}


  return (
      <Card className='pt-5'>
        <div className='text-xl md:text-2xl font-semibold'>
            Create New Monitor
        </div>
        <div className='text-slate-400 font-extralight'>
            Add a new endpoint to monitor its uptime and performance
        </div>
        <div className='my-8 '>
          <TextInput value={name} setValue={setName} lable='Monitor Name' placeholder='Example Endpoint'/>
          <TextInput setValue={setUrl} value={url} lable="URL" placeholder="https://example.com" />
        </div>
         
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 '>
          <Button onClick={handleCreate} className='shadow-md'> 
            Create
          </Button>
          
          <Button onClick={async () => {
            navigate("/dashboard")
          }} className='bg-white !text-black border shadow-md hover:bg-slate-50 '>
            Cancel
          </Button>
        </div>
        <ToastContainer />
      </Card>
  )
}

export default CreateMonitorCard

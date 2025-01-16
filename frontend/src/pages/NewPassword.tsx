import { useEffect, useState } from 'react'
import Card from '../components/basics/Card'
import TextInput from '../components/basics/TextInput'
import Button from '../components/basics/Button'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function NewPassword() {

    let navigate = useNavigate()

    
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    
    const checkToken = async (token: string) => {
        try{
            const res = (await axios.get(`${import.meta.env.VITE_BEEP}/user/ping`, {
                                    headers: {Authorization: `Bearer ${token}`}
                                })).data
            
            if(res.detail !== "pong"){
                navigate("/login")
            }
        }
        catch{
            navigate("/login")
        }
    }

    useEffect(() => {

        let hrefArr = window.location.href.split('/')

        let token = hrefArr[hrefArr.length - 1]

        checkToken(token)

    },[])

    

    async function handleReset() {
        if(newPassword && newPassword === confirmNewPassword && newPassword.length >= 8){

            let hrefArr = window.location.href.split('/')

            let token = hrefArr[hrefArr.length - 1]

            let data = {
                password: newPassword
            }

            try{
                let res = (await axios.post((import.meta.env.VITE_BEEP + "/user/reset"), data, {
                    headers: {Authorization: `Bearer ${token}`},
                })).data

                toast.success(res.detail, {
                    position: "bottom-right"
                })

                setTimeout( () => navigate("/login"), 3000)
                
            }
            catch(e){
                toast.error("ERROR: Your reset link seems to be expired. Please request for a new reset link.", {
                    position: "bottom-right"
                })
                setTimeout( () => navigate("/reset"), 3000)
            }
        }
        else{
            if(newPassword.length < 8){
                toast.error("Password should be atleast be 8 digits long.", {
                    position: 'bottom-right'
                })
                return
            }
            toast.error("Passwords do not match", {
                position: 'bottom-right'
            })
        }   
    }


    return (
        <div className='flex justify-center pt-16'>
            <Card className='w-11/12 md:w-1/2'>
                <div className='text-xl font-bold mb-5 md:text-2xl'>
                    Set a new password
                </div>
                <TextInput lable='New Password' hidden value={newPassword} setValue={setNewPassword}/>
                <TextInput lable='Confirm new Password' hidden value={confirmNewPassword} setValue={setConfirmNewPassword}/>
                <Button onClick={handleReset} className='mt-8'>
                    Reset
                </Button>
            </Card>
            <ToastContainer/>
        </div>
    )
}

export default NewPassword

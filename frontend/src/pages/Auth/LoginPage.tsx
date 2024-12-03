import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import TextInput from "../../components/basics/TextInput"
import Button from "../../components/basics/Button"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { tokenAtom } from "../../store/atom/atom"
import { useSetRecoilState } from "recoil"

function LoginPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const setToken = useSetRecoilState(tokenAtom)

    const navigate = useNavigate()

    async function handleLogin() {

        if(email == ""  || password == ""){
            if(email == "" && password == ""){
                toast.error("Please fill in all the required fields before logging in.", {
                    position: "bottom-right"
                })
                return
            }

            else if(email == ""){
                toast.error("Email is required.", {
                    position: "bottom-right"
                })
                return
            }
            else if(password == ""){
                toast.error("Password is required.", {
                    position: "bottom-right"
                })
                return
            }
        }
        else{
            try{
                const data = (await axios.post(`${import.meta.env.VITE_BEEP}/user/auth/login`,
                    {"email": email, "password": password, "name":"-"})).data
                
                if(data){
                    localStorage.setItem("token", data.token)
                    setToken(data.token)
                    navigate("/dashboard")
                    return
                }
            }
            catch(e){
                console.log(e)
                toast.error("Invalid Credentials.", {
                    position: "bottom-right"
                })
                return
            }
        }
    }

  return (
    <div>
        <div className="flex justify-center pt-16">
            <div className="flex justify-center flex-col border p-14 rounded-lg">
                <div className="text-md md:text-2xl font-bold">
                    Login to your account!
                </div>
                <TextInput value={email} setValue={setEmail} lable="Email" placeholder="JohnDoe@gmail.com"/>
                <TextInput hidden value={password} setValue={setPassword} lable="Password" placeholder="*********"/>

                <Button  onClick={handleLogin} className="mt-5">
                    Login
                </Button>

                <div className="flex justify-center">
                    Don't have an account? 
                    <Link className="mx-2 font-semibold text-blue-500" to={"/signup"}>Signup</Link>
                </div>
            </div>
        </div>
        <ToastContainer />
    </div>
  )
}

export default LoginPage

import { Link, useNavigate } from "react-router-dom"
import Button from "../../components/basics/Button"
import TextInput from "../../components/basics/TextInput"
import { toast, ToastContainer } from "react-toastify"
import { useState } from "react"
import axios from "axios"
import { useSetRecoilState } from "recoil"
import { tokenAtom } from "../../store/atom/atom"

function SignupPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const navigate = useNavigate()
    const setToken = useSetRecoilState(tokenAtom)


    async function handleSignup() {

        if(email == ""  || password == "" || name == ""){
            if(email == "" && password == ""){
                toast.error("Please fill in all the required fields.", {
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
            else if(name === ""){
                toast.error("Name is required.", {
                    position: "bottom-right"
                })
                return
            }
        }
        else{
            try{
                const data = await axios.post(`${import.meta.env.VITE_BEEP}/user/auth/signup`,
                    {"email": email, "password": password, "name":name})
                    .catch((e) => {
                        if(e.response && e.response.data && e.response.data.detail){
                            if(e.response.data.detail.issues){
                                e.response.data.detail.issues.map((v:any) => {
                                    toast.error(v.message, {
                                        position: "bottom-right"
                                    })
                                })
                            }
                            else if(typeof e.response.data.detail == "string"){
                                toast.error(e.response.data.detail, {
                                    position: "bottom-right"
                                })
                            }
                            else{
                                toast.error("Sorry, we could not register this email.", {
                                    position: "bottom-right"
                                })
                            }
                            return
                            
                        }
                        else{
                            toast.error("Sorry, we could not register this email.", {
                                position: "bottom-right"
                            })
                        }
                    })

                if(data && data.data){
                    localStorage.setItem("token", data.data.token)
                    setToken(data.data.token)
                    navigate("/dashboard/new")
                    return
                }
            }
            catch(e){
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
                    Create your new account!
                </div>
                <TextInput value={name} setValue={setName} lable="Name" placeholder="John Doe"/>
                <TextInput value={email} setValue={setEmail} lable="Email" placeholder="JohnDoe@gmail.com"/>
                <TextInput hidden value={password} setValue={setPassword} lable="Password" placeholder="*********"/>

                <Button onClick={handleSignup} className="mt-5"> 
                    Signup
                </Button>

                <div className="flex justify-center">
                    Already have an account? 
                    <Link className="mx-2 font-semibold text-blue-500" to={"/login"}>Login </Link>
                </div>
            </div>
        </div>
        <ToastContainer />
    </div>
  )
}

export default SignupPage

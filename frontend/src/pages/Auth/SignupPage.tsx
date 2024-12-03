import { Link, useNavigate } from "react-router-dom"
import Button from "../../components/basics/Button"
import TextInput from "../../components/basics/TextInput"
import { toast, ToastContainer } from "react-toastify"
import { useState } from "react"
import axios from "axios"
import { useSetRecoilState } from "recoil"
import { tokenAtom } from "../../store/atom/atom"
import Card from "../../components/basics/Card"
import CryptoJS from "crypto-js";


const validateEmail = (e: string) => {
    return e.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


function SignupPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const navigate = useNavigate()
    const setToken = useSetRecoilState(tokenAtom)
    const [code, setCode] = useState("")
    const [inputCode, setInputCode] = useState("")



    async function handleSignup() {
        try{
            await axios.post(`${import.meta.env.VITE_BEEP}/user/auth/signup`,
                {"email": email, "password": password, "name":name})
                .then((data) => {
                    if(data && data.data){
                        localStorage.setItem("token", data.data.token)
                        setToken(data.data.token)
                        navigate("/dashboard")
                        return
                    }
                })
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
                
        }
        catch(e){
            toast.error("Invalid Credentials.", {
                position: "bottom-right"
            })
        }
        return
    }

    async function verifyEmailWithCode() {

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
        else if (!validateEmail(email)){
            toast.error("Invalid email.", {
                position: "bottom-right"
            })
            return
        }
        
        else{
            try{
                const data = await axios.post(`${import.meta.env.VITE_BEEP}/user/mail/verify`,
                                {"email": email})
                
                if(data.data && data.data.detail){
                    setCode(data.data.detail)
                }
    
                else{
                    toast.error("Could not send verification mail.")
                }
            }
            catch{
                setCode('')
                toast.error("Could not send the verification code to this email address.",
                    {position: "bottom-right"}
                )
            }
        }
    }

    if(!code){
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
      
                      <Button onClick={verifyEmailWithCode} className="mt-5"> 
                          send verification code
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
    else{
        return (
            <div className="flex justify-center pt-16">
                <Card className="flex justify-center">
                    <div className="flex flex-col">
                        <div className="text-xl font-bold mb-5 border-b-2">
                            Verification code sent to {email}
                        </div>
                        <div className="flex justify-center">
                            <div>
                                <TextInput className="" value={inputCode} setValue={setInputCode}placeholder="Enter Code"/>
                                <Button className=" mt-3" onClick={async () => {
                                    if(inputCode === ""){
                                        toast.error("Verification code required", {
                                            position: "bottom-right"
                                        })
                                    }
                                    else{
                                        try{
                                            const toCheckCode = CryptoJS.SHA256(inputCode).toString()
                                            
                                            if(toCheckCode === code){
                                                await handleSignup()
                                            }
                                            else{
                                                toast.error("Wrong verification code.", {
                                                    position: "bottom-right"
                                                })
                                            }
                                        }
                                        catch{
                                            toast.error("Sorry, we ran into a problem.", {
                                                position: "bottom-right"
                                            })
                                        }
                                    }
                                }}>
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
              <ToastContainer />
            </div>
        )
    }
}

export default SignupPage

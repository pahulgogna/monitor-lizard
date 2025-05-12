import { useState } from "react"
import Button from "../components/basics/Button"
import Card from "../components/basics/Card"
import TextInput from "../components/basics/TextInput"
import axios, { AxiosError } from "axios"
import { toast, ToastContainer } from "react-toastify"

function RecoverAccount() {

    const [email, setEmail] = useState("")
    const [isValid, setIsValid] = useState(true)
    const [sent, setSent] = useState("")

    const validateEmail = (email: string) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    async function handleRequest() {
        if(isValid && email){

            await axios.post(`${import.meta.env.VITE_BEEP}/user/reset/link`, {email: email})
            .then((d) => {
                setSent(d.data ? d.data.message : "")
            })
            .catch((err: AxiosError) => {
                err.response ? toast.error(err.response.data as String) : null
            })

        }
        else{
            toast.error("Please enter a valid email address.", {
                position: "bottom-right"
            })
        }
    }

    return (
        <div className=" flex justify-center">
            {!sent.length ?
                <Card className=" justify-self-center mt-16 w-11/12 md:w-1/2">
                    <div className="text-xl font-semibold underline mb-5">
                        Recover your account.
                    </div>
                    <TextInput lable="Email:" value={email} setValue={setEmail} classNameTextBox={`${isValid ? "bg-white": "bg-red-300"}`} onChange={
                        (e) => {
                            if(validateEmail(e.target.value) || !e.target.value){
                                setIsValid(true)
                            } else{
                                setIsValid(false)
                            }
                        }
                    }></TextInput>
                    <Button onClick={handleRequest}>
                        Recover
                    </Button>
                </Card>
                :
                <Card className="mt-16 w-11/12 md:w-1/2">
                    <div className="text-xl font-semibold">
                        {sent || "A link for recovering your password was sent."}
                    </div>
                </Card>
            }
            <ToastContainer/>
        </div>
    )
}

export default RecoverAccount

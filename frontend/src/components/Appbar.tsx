import { Link, useNavigate } from "react-router-dom"
import { Avatar } from "./basics/Avatar"
import { useRecoilValueLoadable } from "recoil"
import { tokenAtom, userSelector } from "../store/atom/atom"
import { useEffect, useMemo, useState } from "react"
import Button from "./basics/Button"


function Options({name, email, className}: { // the drop down for signout, etc
  name: string,
  email:string,
  className?: string
}) {

  const navigate = useNavigate()

  async function Signout() {
    localStorage.removeItem("token")
    navigate('/login')
    window.location.reload()
  }

  return (
    <div className={"absolute mr-1 py-4 p-2 gap-1 z-5 bg-slate-50 grid rounded-lg shadow-lg top-12 border right-6 " + className}>
      <div className="text-base font-semibold border-b pb-1">
        Name: {name}
      </div>
      <div className="text-base font-semibold pb-1 border-b">
        Email: {email}
      </div>
      <div>
        <Button className="hover:shadow-lg" onClick={async () => {
            navigate("/dashboard")
          }}>
            Dashboard
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 hover:shadow-lg" onClick={Signout}>
          Signout
        </Button>
      </div>
    </div>
  )
}

function Appbar() {

  const token = useRecoilValueLoadable(tokenAtom)
  const navigate = useNavigate()
  const user = useRecoilValueLoadable(userSelector)
  const [mouseIn, setMouseIn] = useState<boolean>(false)
  const [clicks, setClicks] = useState<number>(0)

  const optionsOpen = useMemo(() => {
    if(!mouseIn){
      return false
    }
    if(mouseIn){
      return true
    }
  }, [clicks])

  
  useEffect(() => {

    let href = window.location.href
    let hrefSplit = href.split("/")

    if(token.state == "hasValue" && !token.contents && !href.includes('signup') && !href.includes('reset') && hrefSplit[hrefSplit.length - 1]){
        navigate("/login")
    }

    onclick = () => {
      setClicks(i => i + (i == 0 ? 1 : -1))
    }

  }, [token.state])

  if(token.state === "loading" || !token.contents){
    return (
      <div className="sticky backdrop-blur z-50 w-full text-md font-semibold sm:text-lg md:text-xl lg:2xl border-b  top-0 h-14 select-none shadow-sm">
          <div className="flex justify-center flex-col h-full mx-4">
            <div className="flex justify-between">
              <Link to={"/"} className="flex">
                  Monitor Lizard
                <img className="ml-1 h-7 w-7 md:h-8 md:w-8" src="https://raw.githubusercontent.com/pahulgogna/LiveLink-frontend/master/src/assets/logo-removebg-preview.png" alt="Logo" />
              </Link>
            </div>
          </div>
      </div>
    )
  }

  else if(token.state === "hasValue" && token.contents){

    return (
      <div className="sticky backdrop-blur z-50 w-full text-md font-semibold sm:text-lg md:text-xl lg:2xl border-b  top-0 h-14 select-none shadow-sm">
          <div className="flex justify-center flex-col h-full mx-4">
            <div className="flex justify-between">
              <div className="flex flex-col justify-center">
                <Link to={"/"} className="flex">
                    Monitor Lizard
                  <img className="ml-1 h-7 w-7 md:h-8 md:w-8" src="https://raw.githubusercontent.com/pahulgogna/LiveLink-frontend/master/src/assets/logo-removebg-preview.png" alt="Logo" />
                </Link>
              </div>
              {
                token.contents &&
                user.state === "hasValue" &&
                user.contents &&
                <div className="group" 
                  
                  onMouseEnter={() => {
                    setMouseIn(_ => true)
                  }}
                  

                  onMouseLeave={() => {
                    setMouseIn(_ => false)
                  }}

                >
                  <Avatar>
                    {user.contents?.name || user.contents?.email}
                  </Avatar>
                    <Options name={user.contents?.name || ''} email={user.contents?.email || ''} className={optionsOpen ? " grid " : " hidden "}/>
                </div>
              }
              
            </div>
          </div>
      </div>
    )
  }

}

export default Appbar

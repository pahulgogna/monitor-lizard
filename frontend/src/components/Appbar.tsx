import { Link, useNavigate } from "react-router-dom"
import { Avatar } from "./basics/Avatar"
import { useRecoilValueLoadable } from "recoil"
import { tokenAtom, userSelector } from "../store/atom/atom"
import { useEffect } from "react"
import Button from "./basics/Button"

function Appbar() {

  const token = useRecoilValueLoadable(tokenAtom)
  const navigate = useNavigate()
  const user = useRecoilValueLoadable(userSelector)   

  function Options({name, email, className}: { // the drop down for signout, etc
    name: string,
    email:string,
    className?: string
  }) {

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
          <Button className="bg-red-600 hover:bg-red-700 hover:shadow-lg" onClick={Signout}>
            Signout
          </Button>
        </div>
      </div>
    )
  }

    useEffect(() => {
        if(!token.contents && !window.location.href.includes('signup') && !window.location.href.includes('reset')){
            navigate("/login")
        }
    }, [token.state])

    if(token.state === "loading"){
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

    else if(token.state === "hasValue"){
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
                  <div className="group">
                    <Avatar>
                      {user.contents?.name || user.contents?.email }
                    </Avatar>
                    <Options name={user.contents?.name || ''} email={user.contents?.email || ''} className="hidden group-hover:grid transition-all"/>
                  </div>
                }
                
              </div>
            </div>
        </div>
      )
    }

}

export default Appbar

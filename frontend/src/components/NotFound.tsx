import { useNavigate } from 'react-router-dom'
import { useRecoilValueLoadable } from 'recoil'
import { tokenAtom } from '../store/atom/atom'
import Loading from './overlays/Loading'
import { useEffect } from 'react'

function NotFound() {
    const navigate = useNavigate()
    const token = useRecoilValueLoadable(tokenAtom)

    useEffect(() => {

        if(token.state === "hasValue"){
        
            if(token.contents){
                navigate("/dashboard")
            }
            else{
                navigate("/login")
            }
        }

    }, [token.state])

    if(token.state === "loading"){
        return (
            <Loading/>
        )
    }
    
  
}

export default NotFound

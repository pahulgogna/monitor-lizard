import { useNavigate } from 'react-router-dom'
import { useRecoilValueLoadable } from 'recoil'
import { tokenAtom } from '../store/atom/atom'
import Loading from './overlays/Loading'

function NotFound() {
    const navigate = useNavigate()
    const token = useRecoilValueLoadable(tokenAtom)

    if(token.state === "loading"){
        return (
            <Loading/>
        )
    }
    else if(token.state === "hasValue"){
        
        if(token.contents){
            navigate("/dashboard")
        }
        else{
            navigate("/login")
        }
    }
  
}

export default NotFound

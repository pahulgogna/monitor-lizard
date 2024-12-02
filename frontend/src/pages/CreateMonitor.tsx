import { useRecoilValueLoadable } from 'recoil'
import CreateMonitorCard from '../components/CreateMonitorCard'
import { tokenAtom } from '../store/atom/atom'
import Loading from '../components/overlays/Loading'

function CreateMonitor() {

  const token = useRecoilValueLoadable(tokenAtom)

    if(token.state === "loading"){
      return (
          <Loading/>
      )
    }

    else if(token.state === "hasValue"){
      return (
            <div className='flex justify-center pt-10'>
                <CreateMonitorCard/>
            </div>
      )
    }
}

export default CreateMonitor

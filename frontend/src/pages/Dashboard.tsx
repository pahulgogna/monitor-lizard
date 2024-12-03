import { Link } from "react-router-dom"
import Button from "../components/basics/Button"
import Information from "../components/Information"
import ActiveMonitors from "../components/ActiveMonitors"
import { useRecoilValueLoadable } from "recoil"
import { tokenAtom } from "../store/atom/atom"
import Loading from "../components/overlays/Loading"

function Dashboard() {

    const token = useRecoilValueLoadable(tokenAtom)

    if(token.state === "loading"){
        return (
            <Loading/>
        )
    }

    else if(token.state === "hasValue"){
        return (
                <div className="flex justify-center flex-col p-10 pt-8">
                    <div className="flex justify-between">
                        <div className="flex-col">
                            <div className="text-3xl md:text-4xl font-bold">Dashboard</div>
                            <div className="mb-5">Monitor your website's status with our alert systems</div>
                        </div>
                        <Link to={"/dashboard/new"}>
                            <Button className="w-fit h-fit font-semibold">
                                + Add
                            </Button>
                        </Link>
                    </div>
                    <Information/>
                    <ActiveMonitors/>
                </div>
        )
    }
    


    
}

export default Dashboard

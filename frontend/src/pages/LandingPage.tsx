import { Link } from 'react-router-dom'
import WorldMap from '../components/WorldMap'
import Card from '../components/basics/Card'
import { Bell, Clock, Globe } from 'lucide-react'

function LandingPage() {
  return (
    <div>
        <div className=' md:pb-10'>
            <div className='flex flex-col'>
                <div className='mt-10 text-3xl md:text-4xl font-bold flex justify-center text-center'>
                    Monitor Your Websites Globally
                </div>
                <div className='px-5 mt-5 text-xl md:text-2xl text-gray-600 font-normal flex justify-center text-center'>
                    Check your website's availability every 5 minutes from 3 different regions around the world.
                </div>
                <div className='flex justify-center'>
                    <Link className='mt-5 bg-black text-white p-2 rounded-md' to={"/signup"}>
                        Start Monitoring Now
                    </Link>
                </div>
            </div>
        </div >
        <WorldMap/>
        <div className='flex justify-center mb-16'>
            <div className='flex flex-col justify-center w-full'>
                <div className='font-bold text-3xl md:text-4xl my-8 text-center'>
                    Our Services
                </div>
                <div className='flex justify-center w-full'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full px-5 gap-3 select-none'>
                        <Card className='flex justify-center text-center'>
                            <div className='flex flex-col'>
                                <div className='flex justify-center mb-1'>
                                    <Clock size={45}/>
                                </div>
                                <div className='font-semibold text-2xl'>
                                    5-Minute Intervals
                                </div>
                                <div className='font- text-xl mt-3'>
                                    We check your websites every 5 minutes, ensuring you're always up to date.
                                </div>
                            </div>
                        </Card>
                        
                        <Card className='flex justify-center text-center'>
                            <div className='flex flex-col'>
                                <div className='flex justify-center mb-1'>
                                    <Globe size={45}/>
                                </div>
                                <div className='font-semibold text-2xl'>
                                    3 Global Regions
                                
                                </div>
                                <div className='font- text-xl mt-3'>
                                Monitor from three different regions for a comprehensive global perspective.
                                </div>
                            </div>
                        </Card>

                        <Card className='flex justify-center justify-self-center text-center sm:col-span-2 lg:col-span-1'>
                            <div className='flex flex-col'>
                                <div className='flex justify-center mb-1'>
                                    <Bell size={45}/>
                                </div>
                                <div className='font-semibold text-2xl'>
                                    Instant Alerts
                                </div>
                                <div className='font- text-xl mt-3'>
                                    Receive immediate notifications when your website goes down or experiences issues.
                                </div>
                            </div>
                        </Card>

                    </div>
                </div>
            </div>
        </div>

        <div className='text-center font-bold text-2xl md:text-3xl mb-3 px-5'>
            Ready to Start Monitoring?
        </div>
        <div className='text-center font-semibold text-lg md:text-xl text-slate-700 px-5'>
            Join MonitorLizard Now And Start Monitoring Your Websites.
        </div>
        <div className='flex justify-center'>
            <Link className='mt-5 bg-black text-white p-2 rounded-md mb-10' to={"/signup"}>
                Sign Up Now
            </Link>
        </div>
    </div>
  )
}

export default LandingPage

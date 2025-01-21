
function WorldMap() {
    return (
        <div className='w-fit my-5 h-96 overflow-hidden flex justify-center md:border-y md:border-slate-600'>
            <div className='flex flex-col justify-center'>
                <video autoPlay controls={false} muted loop src={"/worldMapWithDots.mp4"}/>
            </div>
        </div>
    )
}

export default WorldMap

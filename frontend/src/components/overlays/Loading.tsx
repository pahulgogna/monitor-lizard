import Spinner from '../basics/Spinner'

function Loading() {
  return (
    <div className='fixed inset-0 transform z-10 bg-slate-200/50 backdrop-blur-sm min-h-full flex justify-center'>
        <div className='flex flex-col justify-center'>
            <Spinner/>
        </div>
    </div>
  )
}

export default Loading

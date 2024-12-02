import Button from '../basics/Button'
import Card from '../basics/Card'

function Confirm({message, onConfirm, onCancel, children}: 
    {
        onConfirm: () => Promise<void>,
        message: string,
        onCancel: () => Promise<void>,
        children? : React.ReactNode
    }) {
  return (
    <div className='fixed inset-0 transform z-50 bg-slate-200/50 backdrop-blur min-h-full'>
        <Card className='w-1/2 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 container'>
            <div className='flex justify-center pb-8 text-lg font-semibold'>
                {message}
            </div>
            {children}
            <div className='grid grid-cols-1 sm:grid-cols-2 w-full gap-1'>
                <Button onClick={onConfirm} className='bg-red-600 hover:bg-red-700'> 
                    Confirm
                </Button>
                <Button onClick={onCancel}> 
                    Cancel
                </Button>
            </div>
        </Card>
    </div>
  )
}

export default Confirm

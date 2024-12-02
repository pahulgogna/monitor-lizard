
function Tag(
    {
        online
    }: 
    {
        online : boolean
}) {
  return (
    <div >
      {online 
      ? 
      <span className="bg-green-300 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-xl dark:bg-green-600 dark:text-green-300 select-none ">Online</span>
      :
      <span className="bg-red-300 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-xl dark:bg-red-600 dark:text-red-300 select-none ">Offline</span>
    }
    </div>
  )
}

export default Tag

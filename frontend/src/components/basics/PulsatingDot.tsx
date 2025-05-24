import { statusCodeToBGColorDark, statusCodeToBGColorLight } from "../../utils/codesConversion"

function PulsatingDot({status}: {
    status: number
}) {
  return (
      <div className="flex items-center">
        <div className={"z-10 flex items-center justify-center w-3 h-3 " + statusCodeToBGColorLight(status) + " rounded-full ring-0 ring-white shrink-0"}>
            <span className={"flex w-2 h-2 " + statusCodeToBGColorDark(status) + "  animate-pulse rounded-full"}></span>
      </div>
    </div>
  )
}

export default PulsatingDot

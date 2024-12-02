import Card from "./basics/Card"

function InfoCard({
    title,
    description,
    value,
    valueClassName = "text-neutral-950"
}: {
    title: string,
    description: string,
    value: string | number,
    valueClassName?: string
}) {
  return (
    <Card>
        <div className="text-xl md:text-2xl font-bold">
            {title}
        </div>
        <div className="text-base text-slate-400">
            {description}
        </div>
        <div className={"text-2xl md:text-3xl font-bold " + valueClassName}>
            {value}
        </div>
    </Card>
  )
}

export default InfoCard

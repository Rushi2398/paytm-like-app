import { Link } from "react-router-dom"

export const Bottomwarning = ({label, bottomText, to})=>{
    return <div className="py-2 text-sm flex justify-center">
        <div>
            {label}
        </div>
        <Link className="underline pl-1 cursor-pointer" to={to}>
            {bottomText}
        </Link>
    </div>
}
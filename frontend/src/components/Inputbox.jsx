export const Inputbox = ({label, placeholder, onChange})=>{
    return <div className="pt-4">
        <div className="text-sm font-medium">
            {label}
        </div>
        <input placeholder={placeholder} onChange={onChange} className="w-full text-left px-2 py-2 border rounded border-slate-200"/>
    </div>
}
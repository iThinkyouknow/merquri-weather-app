export function SearchBar({ className, label, onChange, value }) {
    const searchLabelDynamicClass = value
        ? `-top-0.5 text-3xs sm:text-sm sm:top-1`
        : `top-3.5 text-xs sm:text-base sm:top-5`;
    return (
        <div id="search-input-container" className={className} >
            <label htmlFor="search-input" className={`transition-all absolute left-2 sm:left-4 text-white/40 ${searchLabelDynamicClass}`}>{label}</label>
            <input id="search-input" type="text" className='flex items-center bg-1A1A1A/50 h-full rounded rounded-lg sm:rounded-2xl p-2 sm:p-4 w-full text-xs sm:text-base' value={value} onChange={onChange} />
        </div>
    )
}
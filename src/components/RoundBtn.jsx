export function RoundBtn({ onClick, children }) {
    return (
        <button className='flex justify-center items-center rounded-full border border-2 border-white/40 h-8 w-8 hover:scale-105' onClick={onClick}>
            {children}
        </button>
    )
}
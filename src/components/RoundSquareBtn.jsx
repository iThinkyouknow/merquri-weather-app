export function RoundSquareBtn({ children, onClick }) {
    return (
        <button type="button" className="flex justify-center items-center bg-28124D w-10 rounded rounded-lg hover:scale-105 h-full sm:w-16 sm:rounded-3xl" onClick={onClick} >
            {children}
        </button>
    )
}
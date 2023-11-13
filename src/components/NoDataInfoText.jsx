export function NoDataInfoText({ children, extraClass = '' }) {
    return (
        <p className={`text-2xl ${extraClass}`}>{children}</p>
    )
}
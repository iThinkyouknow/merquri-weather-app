import { RoundBtn } from './RoundBtn';
import { FaSistrix, FaTrash } from "react-icons/fa";
export function SearchHistory({
    name, formattedDateTime, onSearch, onDelete
}) {

    return (
        <li className='flex rounded justify-between rounded-2xl bg-1A1A1A/50 p-3 sm:p-6 pr-4 gap-4 fade-in first:opacity-0'>
            <div className='flex flex-col sm:items-center sm:flex-row sm:justify-between sm:flex-1'>
                <span className='font-bold sm:font-normal'>{name}</span>
                <span className='text-white/50 text-2xs sm:text-base'>{formattedDateTime}</span>
            </div>
            <div className='flex gap-2 justify-center items-center'>
                <RoundBtn onClick={onSearch}>
                    <FaSistrix className="text-white/40" />
                </RoundBtn>
                <RoundBtn onClick={onDelete}>
                    <FaTrash className="text-white/40" />
                </RoundBtn>
            </div>
        </li>
    )
}
import { SortDown, SortUp, Sort } from './svg'

const SortIcon = ({ sort }) => {
    switch (sort) {
        case 'asc':
            return <SortUp />
            break;
        case 'desc':
            return <SortDown />
            break;
        default:
            return <Sort />
    }
}

export default SortIcon
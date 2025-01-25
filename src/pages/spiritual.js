import { useSelector } from "react-redux"
import CollapsibleComponent from "../components/collapsible-component"
import { ShlokaTrackerList } from "../components/DailyShlokaTrackerList"
import { Header } from "../components/header"
import { fetchTrackedShlokas } from "../features/spiritual/shlokasSlice"
import { auth } from "../config/firebase"
import { WorkInProgress } from "../components/wip"
import DateSelector from "../components/date-selector"
import { ParayanaTrackerList } from "../components/spiritual/parayanas/parayanaTrackerList"
import { NAMSMARAN, SHLOKA } from "../utils/constants/constants"

const Spiritual = () => {
    const renderedList = useSelector((state) => state.shlokas.renderedList);
    const types = [
        {
            name: "Shlokas",
            expandableComponent: ShlokaTrackerList,
            props: {type: SHLOKA}
        },
        {
            name: "Parayanas",
            expandableComponent: ParayanaTrackerList,
            props: {}
        },
        {
            name: "Namsmaran",
            expandableComponent: ShlokaTrackerList,
            props: {type: NAMSMARAN}
        },
    ]

    return (
        
        <div>
            <Header/>
            <DateSelector />
            {types.map((type, index) => {
                return <CollapsibleComponent 
                            key={index} 
                            type={type}
                        />
            })}
        </div>
        
    )
}

export default Spiritual
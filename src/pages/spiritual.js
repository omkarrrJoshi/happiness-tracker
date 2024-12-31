import { useSelector } from "react-redux"
import CollapsibleComponent from "../components/collapsible-component"
import { ShlokaTrackerList } from "../components/DailyShlokaTrackerList"
import { Header } from "../components/header"
import { fetchTrackedShlokas } from "../features/spiritual/shlokasSlice"
import { auth } from "../config/firebase"
import { WorkInProgress } from "../components/wip"
import DateSelector from "../components/date-selector"

const Spiritual = () => {
    const renderedList = useSelector((state) => state.shlokas.renderedList);
    const types = [
        {
            name: "Shlokas",
            expandableComponent: ShlokaTrackerList,
            fetchTrackedList: fetchTrackedShlokas,
            callApi: !renderedList,
        },
        {
            name: "Parayan",
            expandableComponent: WorkInProgress,
            fetchTrackedList: fetchTrackedShlokas,
            callApi: !renderedList,
        },
        {
            name: "Tasks",
            expandableComponent: WorkInProgress,
            fetchTrackedList: fetchTrackedShlokas,
            callApi: !renderedList,
        },
        {
            name: "Namsmaran",
            expandableComponent: WorkInProgress,
            fetchTrackedList: fetchTrackedShlokas,
            callApi: !renderedList,
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
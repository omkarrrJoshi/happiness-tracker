import { useSelector } from "react-redux"
import CollapsibleComponent from "../components/collapsible-component"
import { ShlokaTrackerList } from "../components/DailyShlokaTrackerList"
import { Header } from "../components/header"
import { fetchTrackedShlokas } from "../features/spiritual/shlokasSlice"

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
            expandableComponent: ShlokaTrackerList,
            fetchTrackedList: fetchTrackedShlokas,
            callApi: !renderedList,
        },
        {
            name: "Tasks",
            expandableComponent: ShlokaTrackerList,
            fetchTrackedList: fetchTrackedShlokas,
            callApi: !renderedList,
        },
        {
            name: "Namsmaran",
            expandableComponent: ShlokaTrackerList,
            fetchTrackedList: fetchTrackedShlokas,
            callApi: !renderedList,
        },
    ]

    return (
        
        <div>
            <Header/>
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
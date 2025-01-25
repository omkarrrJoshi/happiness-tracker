import { useLocation } from "react-router-dom"
import { Header } from "../../components/header";
import { ShlokaDetails } from "../../components/spiritual/shloka/shloka-details";

export const Shloka = () => {
    const location = useLocation();
    const shloka = location.state?.shloka;
    return (
        <div>
            <Header/>
            <ShlokaDetails shloka_id={shloka.shloka_id} type={shloka.type}/>
        </div>
    )
}
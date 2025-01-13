import { useLocation } from "react-router-dom";
import { Header } from "../../components/header"
import { ParayanaChaptersTracker } from "../../components/spiritual/parayanas/parayanaChaptersTracker";

export const Parayana = () => {
  const location = useLocation();
  const parayana = location.state?.parayana;
  return (
  <div>
    <Header/>
    <ParayanaChaptersTracker parayana={parayana} />
  </div>
  )
}
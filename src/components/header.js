import './header.css'
import LogoutButton from "./logout"

export const Header = () => {
    return (
        <div className="header">
            <div className='col-10'>
                <h1>Happiness Tracker</h1>
            </div>
            <div className='col-2'>
                <LogoutButton />
            </div>
        </div>
    )
}

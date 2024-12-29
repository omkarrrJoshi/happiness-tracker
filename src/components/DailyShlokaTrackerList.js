import { useEffect, useRef, useState } from 'react';
import './DailyShlokaTrackerList.css'

import { CounterBox } from './counter-box';
import { useSelector } from 'react-redux';
import { EllipsisMenu } from './spiritual/ellipsis-menu';

export const ShlokaTracker = ({shloka, isMenuOpen, onMenuToggle}) =>{
    const menuRef = useRef(null);
    const menuButtonRef = useRef(null);
    
    // Close the menu if clicked outside
    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target) && !menuButtonRef.current.contains(e.target)) {
          onMenuToggle(); // Close the menu when clicked outside
        }
    };
  
    // Listen for outside click to close the menu
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <article className='shloka-tracker'>
            <section className='col-6'>{shloka.name}</section>
            <section className='col-3'> <CounterBox daily_rogreress={shloka.daily_progress}/></section>
            <section className='col-1 daily_target'>{shloka.daily_target}</section>
            <section className='col-1' /*ref={menuButtonRef} onClick={onMenuToggle}*/>
                <img 
                    src='/svg-icons/ellipsis-vertical.svg' 
                    alt='3 vericle dots'
                />
            </section>
            
            {/* {isMenuOpen && <EllipsisMenu menuRef={menuRef} />} */}
        </article>
    );
}

export const ShlokaTrackerList = () => {
    const [openMenuIndex, setOpenMenuIndex] = useState(null); // Track which shloka's menu is open

    const handleMenuToggle = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index); // Toggle menu for clicked shloka
    };
    const shlokas = useSelector((state) => state.shlokas);
    const trackedShlokasList = shlokas.trackedShlokasList;
    return (
        <section className = "shloka-tracker-list">
            
            {
                shlokas.isLoading && <div className='outer-loader'><div className='loader'></div></div>
            }
            {
                (trackedShlokasList.length === 0 && !shlokas.isLoading) && <div>
                    <h3>Shloka is not present, click + to add the shloka</h3>
                </div>
            }
            {(trackedShlokasList.length !== 0) &&
                <div>
                    <div className='shloka-tracker-header'>
                        <section className='col-6'>Name</section>
                        <section className='col-3'>Daily Progress</section>
                        <section className='col-1'>Target</section>
                        <section className='col-1'></section>
                    </div>
                    <div>
                        {trackedShlokasList.map((shloka, index) => 
                            <ShlokaTracker 
                                key={shloka.id} 
                                shloka={shloka}
                                isMenuOpen={openMenuIndex === index}
                                onMenuToggle={() => handleMenuToggle(index)}
                            />
                        )}
                    </div>
                </div>
            }
        </section>
    )
    
}

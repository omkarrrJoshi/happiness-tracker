import './DailyShlokaTrackerList.css'

import { CounterBox } from './counter-box';
import { useDispatch, useSelector } from 'react-redux';
import { getISTDate, showNotification } from '../utils/util';
import { deleteShloka } from '../features/spiritual/shlokasSlice';
import { LoadingOverlay } from './loading-overlay';

export const ShlokaTracker = ({shloka}) =>{
    const user = useSelector((state) => state.auth.user);
    
    const dispatch = useDispatch();
    const { isLoading, successMessage } = useSelector((state) => state.shlokas);
    const queryParams = {
        date: getISTDate(), 
        shloka_id: shloka.shloka_id, 
        user_id: user.uid
    }
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Shloka?");
        if(confirmDelete){
            const result = await dispatch(deleteShloka({queryParams: queryParams, id: shloka.id}));
            if (result.meta.requestStatus === 'fulfilled') {
                showNotification(successMessage, 2000); // Show success message
            }
        }
    }

    const isShlokaCompleted = shloka.daily_progress >= shloka.daily_target;
    return (
        <>
         <LoadingOverlay isLoading={isLoading} />
         <article className='shloka-tracker'>
                <section className='col-1'>
            {isShlokaCompleted && 
                    
                        <img 
                        src='/svg-icons/completed.svg' 
                        alt='completed'
                    />
            }
           
                </section>
            <section className='col-7'>{shloka.name}</section>
            <section className='col-3'> <CounterBox shloka={shloka}/></section>
            <section className='col-1 daily_target'>{shloka.daily_target}</section>
            <section className='col-1' onClick={handleDelete}>
                <img 
                    src='/svg-icons/delete.svg' 
                    alt='delete icon'
                />
            </section>
        </article>
        </>
        
    );
}

export const ShlokaTrackerList = () => {
    const shlokas = useSelector((state) => state.shlokas);
    const trackedShlokasList = shlokas.trackedShlokasList;
    return (
        <section className = "shloka-tracker-list">
            
            {
                !shlokas.loadedInitially && <div className='outer-loader'><div className='loader'></div></div>
            }
            {
                (trackedShlokasList.length === 0 && !shlokas.isLoading) && <div>
                    <h3>Shloka is not present, click + to add the shloka</h3>
                </div>
            }
            {(trackedShlokasList.length !== 0) &&
                <div>
                    <div className='shloka-tracker-header'>
                        <section className='col-1'></section>
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
                            />
                        )}
                    </div>
                </div>
            }
        </section>
    )
    
}

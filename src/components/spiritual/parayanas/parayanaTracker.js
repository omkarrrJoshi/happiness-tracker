import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../../loading-overlay";

export const ParayanTracker = ({ parayana }) => {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate(`/spiritual/parayana/${parayana.id}`, { state: { parayana } });
  };
  return (
    <>
     <article className='shloka-tracker'>
        <section className='col-1'>
            {/* {isShlokaCompleted && 
                    
                        <img 
                        src='/svg-icons/completed.svg' 
                        alt='completed'
                    />
            } */}
        </section>
        <section className='col-6'  onClick={handleNavigation} style={{ cursor: 'pointer' }}>{parayana.name}</section>
        <section className='col-3'> 0 </section>
        <section className='col-1 daily_target'>{parayana.monthly_target}</section>
        <section className='col-1'>
            <img 
                src='/svg-icons/delete.svg' 
                alt='delete icon'
            />
        </section>
    </article>
    </>
);
}
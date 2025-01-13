import { useSelector } from "react-redux"
import { ParayanTracker } from "./parayanaTracker";
import { LoadingOverlay } from "../../loading-overlay";

export const ParayanaTrackerList = () => {
  const parayanas_tracker = useSelector((state) => state.parayanas.parayanas_tracker);
  const data = parayanas_tracker.data;
  const loading = parayanas_tracker.loading;
  const message = parayanas_tracker.message;
  const error = parayanas_tracker.error;

  return (
    <section className = "shloka-tracker-list">
        
        {
          loading  && 
            <div className='outer-loader'>
              <div className='loader'></div>
            </div>
        }
        {
          (!loading && data.length === 0) && <div>
            <h3>Parayanas are not present, click + to add the Parayana</h3>
          </div>
        }
        { 
          (!loading && data.length !== 0) &&
            <div>
                <div className='shloka-tracker-header'>
                    <section className='col-1'></section>
                    <section className='col-6'>Name</section>
                    <section className='col-3'>Monthly Progress</section>
                    <section className='col-1'>Monthly Target</section>
                    <section className='col-1'></section>
                </div>
                <div>
                    {data.map((parayana, index) => 
                        <ParayanTracker 
                            key={parayana.id} 
                            parayana={parayana}
                        />
                    )}
                </div>
            </div>
        }
    </section>
)
}
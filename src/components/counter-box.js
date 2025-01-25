import { useState } from 'react';
import { updateShlokasDailyProgress } from '../features/spiritual/shlokasSlice';
import { store } from '../redux/store';
import './counter-box.css'
import { SHLOKA } from '../utils/constants/constants';
import { updateNamsmaranDailyProgress } from '../features/spiritual/namsmaranSlice';

export const CounterBox = ({shloka, type}) =>{
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const increment = () => {
    store.dispatch(updateShlokasDailyProgress({id: shloka.id, updated_daily_progress: shloka.daily_progress + 1}));
  }
  const decrement = () => {
    if(shloka.daily_progress > 0){
      store.dispatch(updateShlokasDailyProgress({id: shloka.id, updated_daily_progress: shloka.daily_progress - 1}));
    }
  }

  const udpateProgressSingleTime = (progress) => {
    if (!document.getElementById('updated_progress').value || progress==0) {
      alert("progress can't be empty or 0");
      return; // Prevent form submission
    }
    const action = type === 'namsmaran' ? updateNamsmaranDailyProgress : updateShlokasDailyProgress;
    store.dispatch(action({id: shloka.id, updated_daily_progress: progress}));
    toggleCounterModal();
  }

  const toggleCounterModal = () => {
    setIsCounterModalOpen(!isCounterModalOpen);
  };

  return (
    <div>
      <div className="counter-box">
        {type === SHLOKA && <button className="counter-btn-negative" onClick={decrement}>
          -
        </button>}
        <div className={`counter-small-box ${type}-counter-small-box`} onClick={toggleCounterModal}>{shloka.daily_progress}</div>
        {type === SHLOKA && <button className="counter-btn-positive" onClick={increment}>
          +
        </button>}
      </div>
      {isCounterModalOpen && 
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={toggleCounterModal}>×</button>
            <h3 className="required">Update daily progress of {shloka.name}</h3>
            <form>
                <div className="form-group">
                    <input 
                      type="number" 
                      id="updated_progress" 
                      name="updated_progress"
                      placeholder="Enter daily progress" 
                    />
                </div>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={ () => udpateProgressSingleTime(Number(document.getElementById('updated_progress').value))}
                  >
                    Overwrite
                  </button>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={ () => udpateProgressSingleTime(shloka.daily_progress + Number(document.getElementById('updated_progress').value))}
                  >
                    Append
                  </button>
            </form>
            <div className="modal-note">
                <p><strong>Note:</strong></p>
                <p><strong>Overwrite:</strong> Replaces the current progress with the new value.</p>
                <p><strong>Append:</strong> Adds the new value to the existing progress.</p>
            </div>
          </div>
      </div>}
    </div>
  );
};
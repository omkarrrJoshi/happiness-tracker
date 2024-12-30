import { useState } from 'react';
import { updateDailyProgress } from '../features/spiritual/shlokasSlice';
import { store } from '../redux/store';
import './counter-box.css'

export const CounterBox = ({shloka}) =>{
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const increment = () => {
    store.dispatch(updateDailyProgress({id: shloka.id, updated_daily_progress: shloka.daily_progress + 1}));
  }
  const decrement = () => {
    store.dispatch(updateDailyProgress({id: shloka.id, updated_daily_progress: shloka.daily_progress - 1}));
  }

  const udpateProgressSingleTime = (progress) => {
    store.dispatch(updateDailyProgress({id: shloka.id, updated_daily_progress: progress}));
    toggleCounterModal();
  }

  const toggleCounterModal = () => {
    setIsCounterModalOpen(!isCounterModalOpen);
  };

  return (
    <div>
      <div className="counter-box">
        <button className="counter-btn-negative" onClick={decrement}>
          -
        </button>
        <div className="counter-small-box" onClick={toggleCounterModal}>{shloka.daily_progress}</div>
        <button className="counter-btn-positive" onClick={increment}>
          +
        </button>
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
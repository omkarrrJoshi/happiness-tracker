import React, { useCallback, useState } from "react";
import './shloka-details.css'
import { ModalOverlay } from "../../modal-overlay";
import { LoadingOverlay } from "../../loading-overlay";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrackedShlokas } from "../../../features/spiritual/shlokasSlice";
import { NAMSMARAN, SHLOKA } from "../../../utils/constants/constants";
import { fetchTrackedNamsmarans, updateNamsmaranDailyProgress } from "../../../features/spiritual/namsmaranSlice";
import { store } from "../../../redux/store";

export const ShlokaDetails = ({ shloka_id, type }) => {
  const [showFloating, setShowFloating] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const selectedDate = useSelector((state) => state.dateReducer.currentDate);
  const { isLoading, renderedList, trackedShlokasList} = useSelector((state) => getShlokasByType(state, type));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  if(!renderedList){
    const queryParams = {
      user_id: user.uid,
      date: selectedDate,
      type: type,
    };
    const action = type === NAMSMARAN ? fetchTrackedNamsmarans : fetchTrackedShlokas;
    dispatch(action(queryParams));
  }
  
  const shloka = trackedShlokasList.find(shloka => shloka.shloka_id === shloka_id)
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const increment = useCallback((shloka) => {
    if (type === 'SHLOKA') {
      return;
    }
    
    // Reset the floating animation by toggling state
    setShowFloating(false); // Hide immediately
    setTimeout(() => {
      setShowFloating(true); // Re-show after reset, triggering the animation
    }, 0); // Trigger re-render immediately to reset the animation

    // Hide the floating description after 2 seconds
    setTimeout(() => {
      setShowFloating(false);
    }, 3000);
    // Dispatch action to update progress (unchanged)
    store.dispatch(updateNamsmaranDailyProgress({
      id: shloka.id,
      updated_daily_progress: shloka.daily_progress + 1,
      hideNotification: true,
    }));
  }, [type]);

  return (
    <>
        <LoadingOverlay isLoading={isLoading} />
        
        { renderedList &&
        <div className="shloka-details">
            <div className="shloka-details-header">
            <h2 className="shloka-name">{shloka.name}</h2>
            <div className="target-and-progress">
              <h2 className="daily-target left">Daily Target: {shloka.daily_target}</h2>
              <h2 className="daily-target right">Daily Progress: {shloka.daily_progress}</h2>
            </div>
            </div>
            <div className="shloka-description">
                <h3>Description:</h3>
                <pre className={`description-text ${type}-description-text`} onClick={() => increment(shloka)}>{shloka.description}</pre>
                {showFloating && (
                  <div>
                    <div className="floating-progress">
                      {shloka.daily_progress}
                    </div>
                    <div className="floating-description">
                      {shloka.description}
                    </div>
                  </div>
                )}
            </div>

            <div className="shloka-link">
                <h3>Additional Resource:</h3>
                <a href={shloka.link} target="_blank" rel="noopener noreferrer">
                Visit Resource
                </a>
            </div>

            <div className="action-buttons">
                <button className="btn edit-btn" onClick={toggleModal}>
                Edit
                </button>
            </div>

            {isModalOpen && (
                <ModalOverlay shloka={shloka} toggleModal={toggleModal} type={type} />
            )}
        </div>
          }
    </>
  );
};

const getShlokasByType = (state, type) => {
  switch (type) {
      case NAMSMARAN:
          return state.namsmaran;
      case SHLOKA:
          return state.shlokas;
      default:
          return state.shlokas;
  }
};
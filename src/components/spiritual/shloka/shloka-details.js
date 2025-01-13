import React, { useState } from "react";
import './shloka-details.css'
import { ModalOverlay } from "../../modal-overlay";
import { LoadingOverlay } from "../../loading-overlay";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrackedShlokas } from "../../../features/spiritual/shlokasSlice";

export const ShlokaDetails = ({ shloka_id }) => {
  const user = useSelector((state) => state.auth.user);
  const selectedDate = useSelector((state) => state.dateReducer.currentDate);
  const { isLoading, renderedList, trackedShlokasList} = useSelector((state) => state.shlokas);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  if(!renderedList){
    const queryParams = {
      user_id: user.uid,
      date: selectedDate
    };
    dispatch(fetchTrackedShlokas(queryParams));
  }
  
  const shloka = trackedShlokasList.find(shloka => shloka.shloka_id === shloka_id)
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
        <LoadingOverlay isLoading={isLoading} />
        
        { renderedList &&
        <div className="shloka-details">
            <div className="shloka-details-header">
            <h2 className="shloka-name">{shloka.name}</h2>
            <h2 className="daily-target">Daily Target: {shloka.daily_target}</h2>
            </div>
            <div className="shloka-description">
                <h3>Description:</h3>
                <pre className="description-text">{shloka.description}</pre>
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
                <ModalOverlay shloka={shloka} toggleModal={toggleModal} />
            )}
        </div>
          }
    </>
  );
};
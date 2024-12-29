import { ShlokaTrackerList } from './DailyShlokaTrackerList';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; 

import './collapsible-component.css'
import { ModalOverlay } from './modal-overlay';

const CollapsibleComponent = ({type}) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleCollapse = () => {
    if(type.callApi){
      dispatch(type.fetchTrackedList());
    }
    setIsExpanded(!isExpanded);
  };

  const toggleModal = () => {
    console.log("isModelOpen: ", isModalOpen);
    setIsModalOpen(!isModalOpen);
  };

  return (
    <article className='collapsible-component'>
      {/* Collapsible Header */}
      <article className='collapsible-header'>
        <section onClick={toggleCollapse} className='col-2'>
            <img 
                src={isExpanded ? '/svg-icons/chevron-down.svg' : '/svg-icons/chevron-right.svg'}
                className='col-1'
                alt='toggle arrow'
            />
        </section>
        <section className='col-8' onClick={toggleCollapse}><h3>{type.name}</h3></section>
        <section className='add-task col-2' onClick={toggleModal}><h3>+</h3></section>
      </article>

      {isExpanded && (
        <div className={`collapsible-content ${isExpanded ? "expanded" : ""}`}>
          <type.expandableComponent />
        </div>
      )}

      {isModalOpen && (
        <div>
          {console.log("Modal is open!")}
          <ModalOverlay toggleModal={toggleModal}/>
        </div>
      )}
    </article>
  );
};



export default CollapsibleComponent;
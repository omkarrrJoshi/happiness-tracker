import { useDispatch } from 'react-redux';
import './modal-overlay.css'
import { createShloka } from '../features/spiritual/shlokasSlice';
import { useState } from 'react';
import { CURRENT_DATE, CURRENT_USER_ID } from '../utils/util';

export const ModalOverlay = ({ toggleModal }) => {
    const [formData, setFormData] = useState({
        user_id: CURRENT_USER_ID,
        date: CURRENT_DATE,
        daily_target: 1,
        name: '',
        link: '',
        description: '',
    });

    const dispatch = useDispatch();

    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("name: ", name, " value: ", value)
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

     // Handle form submission
     const handleSubmit = (e) => {
        e.preventDefault();
        // Validate the name field before submitting
        if (!formData.name.trim() || !formData.daily_target) {
            alert('Enter mandatory fields!');
            return; // Prevent form submission
        }
        // Dispatch the createShloka action with formData
        dispatch(createShloka(formData));

        // Reset form fields after submission
        setFormData({
            user_id: CURRENT_USER_ID,
            date: CURRENT_DATE,
            daily_target: 1,
            name:'',
            link:'',
            description: '',
        });
    };

    // Reset success message after it's shown
    // const handleResetMessage = () => {
    //     dispatch(resetSuccessMessage());
    // };


    return (
      <div className="modal-overlay">
        <div className="modal">
        <h3>Add New Shloka</h3>
        <form onSubmit={handleSubmit}>
            {/* <div className="form-group">
                <label htmlFor="userId">User ID</label>
                <input 
                type="text" 
                id="userId" 
                name="user_id" 
                value={formData.user_id}
                onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="date">Date</label>
                <input 
                type="text" 
                id="date" 
                name="date"
                value={formData.date} 
                onChange={handleChange}
                />
            </div> */}
            <div className="form-group">
                <label htmlFor="name" className="required">Shloka Name</label>
                <input 
                type="text" 
                id="name" 
                name="name"
                placeholder="Enter shloka name" 
                onChange={handleChange}
                value={formData.name}
                />
            </div>

            <div className="form-group">
                <label htmlFor="daily_target" className="required">Daily Target</label>
                <input 
                type="number" 
                id="daily_target" 
                name="daily_target"
                placeholder="Enter daily target" 
                min="1"
                onChange={handleChange}
                value={formData.daily_target}
                />
            </div>

            <div className="form-group">
                <label htmlFor="link">Shloka Link</label>
                <input 
                type="url" 
                id="link" 
                name="link"
                placeholder="Enter link (optional)" 
                onChange={handleChange}
                value={formData.link}
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                type="text"
                id="description" 
                name="description"
                placeholder="Enter description (optional)" 
                onChange={handleChange}
                value={formData.description}
                />
            </div>

            <button type="submit" className="btn">Submit</button>
            <button type="button" className="btn" onClick={toggleModal}>Close</button>
        </form>

        </div>
      </div>
    );
  };
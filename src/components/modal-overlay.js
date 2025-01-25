import { useDispatch, useSelector } from 'react-redux';
import './modal-overlay.css'
import { createShloka, updateShloka } from '../features/spiritual/shlokasSlice';
import { useState } from 'react';
import { excludeFields, getISTDate, showNotification } from '../utils/util';
import { NAMSMARAN, SHLOKA } from '../utils/constants/constants';
import { createNamsmaran, updateNamsmaran } from '../features/spiritual/namsmaranSlice';

export const ModalOverlay = ({ shloka, toggleModal, type }) => {
    const user = useSelector((state) => state.auth.user);
    const [formData, setFormData] = useState({
        user_id: user.uid,
        date: getISTDate(),
        daily_target: shloka ? shloka.daily_target : 1,
        name: shloka ? shloka.name : '',
        link: shloka ? shloka.link : '',
        description: shloka ? shloka.description : '',
        type: type.toLowerCase(),
    });

    const dispatch = useDispatch();

    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

     // Handle form submission for creating shloka
     const handleCreate = async(e) => {
        e.preventDefault();
        // Validate the name field before submitting
        if (!formData.name.trim() || !formData.daily_target) {
            alert('Enter mandatory fields!');
            return; // Prevent form submission
        }
        // Dispatch the createShloka action with formData
        if(type.toLowerCase() === SHLOKA){
          await dispatch(createShloka(formData));
        }else if(type.toLowerCase() === NAMSMARAN){
          await dispatch(createNamsmaran(formData));
        }else{
          alert('Shloka type not valid!');
          return; // Prevent form submission
        }
        showNotification(`${formData.name.trim()} added successfully! You may close this window if you're done adding ${type}.`, 4000); 
        // Reset form fields after submission
        setFormData({
            user_id: user.uid,
            date: getISTDate(),
            daily_target: 1,
            name:'',
            link:'',
            description: '',
            type: type.toLowerCase(),
        });
    };

    // Handle form submission for updating shloka
    const handleUpdate = async(e) => {
        e.preventDefault();
        // Validate the name field before submitting
        if (!formData.name.trim() || !formData.daily_target) {
            alert("Name or traget can't be empty");
            return; // Prevent form submission
        }
        const queryParams = {
            user_id: user.uid
        }
        const updatedBody = excludeFields(formData, ["user_id", "date", "type"]);
        // Dispatch the updateShloka/updateNamsmaran action with formData
        const action = type.toLowerCase() === NAMSMARAN ? updateNamsmaran: updateShloka;
        const result = await dispatch(action({shloka_id: shloka.shloka_id, queryParams: queryParams, updatedBody: updatedBody}));
        if (result.meta.requestStatus === 'fulfilled') {
            showNotification(`${formData.name.trim()} Updated successfully!`, 4000); 
            toggleModal();
        }
    };

    return (
      <div className="modal-overlay">
        <div className="modal">
        <button className="modal-close" onClick={toggleModal}>×</button>
        <h3>{shloka ? `Update ${type}` : `Add New ${type}`}</h3>
        <form onSubmit={shloka ? handleUpdate : handleCreate}>
            <div className="form-group">
                <label htmlFor="name" className={shloka ? "optional" : "required"}>{type} Name</label>
                <input 
                type="text" 
                id="name" 
                name="name"
                placeholder={`Enter name`}
                onChange={handleChange}
                value={formData.name}
                />
            </div>

            <div className="form-group">
                <label htmlFor="daily_target" className={shloka ? "optional" : "required"}>Daily Target</label>
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
                <label htmlFor="link">{type} Link</label>
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

            <button type="submit" className="btn">{shloka ? "Update" : "Submit"}</button>
        </form>

        </div>
      </div>
    );
  };
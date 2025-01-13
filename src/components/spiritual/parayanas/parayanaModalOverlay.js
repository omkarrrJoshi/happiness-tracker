import { useDispatch, useSelector } from "react-redux";
import { createParayana } from "../../../features/spiritual/parayanasSlice";
import { useState } from "react";
import { getISTDate, showNotification } from "../../../utils/util";
import { LoadingOverlay } from "../../loading-overlay";

export const ParayanasModalOverlay = ({toggleModal}) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    user_id: user.uid,
    date: getISTDate(),
    name: '',
    monthly_target: 1,
  });
  const [isLoading, setIsLoading] = useState(false);

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
    if (!formData.name.trim() || !formData.monthly_target) {
        alert('Enter mandatory fields!');
        return; // Prevent form submission
    }
    // Dispatch the createShloka action with formData
    setIsLoading(true);
    await dispatch(createParayana(formData));
    setIsLoading(false);
    showNotification(`${formData.name.trim()} added successfully! You may close this window if you're done adding parayanas.`, 4000); 
    // Reset form fields after submission
    setFormData({
        user_id: user.uid,
        date: getISTDate(),
        monthly_target: 1,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
      <button className="modal-close" onClick={toggleModal}>×</button>
      <h3>Add New Parayan</h3>
      <form onSubmit= {handleCreate}>
          <div className="form-group">
              <label htmlFor="name" className="required">Parayan Name</label>
              <input 
              type="text" 
              id="name" 
              name="name"
              placeholder="Enter parayan name" 
              onChange={handleChange}
              value={formData.name}
              />
          </div>

          <div className="form-group">
              <label htmlFor="monthly_target" className="required">Monthly Target</label>
              <input 
                type="number" 
                id="monthly_target" 
                name="monthly_target"
                placeholder="Enter monthly target" 
                min="1"
                onChange={handleChange}
                value={formData.monthly_target}
              />
          </div>

          <button type="submit" className="btn">Submit</button>
      </form>
      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isLoading} />
      </div>
    </div>
  );
}
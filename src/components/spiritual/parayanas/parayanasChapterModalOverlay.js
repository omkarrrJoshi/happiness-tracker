import { useDispatch, useSelector } from "react-redux";
import { createParayana, createParayanaChapter } from "../../../features/spiritual/parayanasSlice";
import { useState } from "react";
import { getISTDate, showNotification } from "../../../utils/util";
import { LoadingOverlay } from "../../loading-overlay";

export const ParayanasChapterModalOverlay = ({parayana, toggleModal}) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    user_id: user.uid,
    date: getISTDate(),
    parayana_id: parayana.id,
    name: '',
    total_shlokas: '',
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
    if (!formData.name.trim()) {
        alert('Enter mandatory fields!');
        return; // Prevent form submission
    }
    // Dispatch the createShloka action with formData
    setIsLoading(true);
    await dispatch(createParayanaChapter(formData));
    setIsLoading(false);
    showNotification(`${formData.name.trim()} added successfully! You may close this window if you're done adding chapters.`, 4000); 
    // Reset form fields after submission
    setFormData({
      user_id: user.uid,
      date: getISTDate(),
      parayana_id: parayana.id,
      name: '',
      total_shlokas: '',
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
      <button className="modal-close" onClick={toggleModal}>×</button>
      <h3>Add New Chapter for parayan of {parayana.name}</h3>
      <form onSubmit= {handleCreate}>
          <div className="form-group">
              <label htmlFor="name" className="required">Chapter Name</label>
              <input 
              type="text" 
              id="name" 
              name="name"
              placeholder="Enter chapter name" 
              onChange={handleChange}
              value={formData.name}
              />
          </div>

          <div className="form-group">
              <label htmlFor="total_shlokas">Total shlokas</label>
              <input 
                type="number" 
                id="total_shlokas" 
                name="total_shlokas"
                placeholder="Enter total number of shlokas for this chapter" 
                onChange={handleChange}
                value={formData.total_shlokas}
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
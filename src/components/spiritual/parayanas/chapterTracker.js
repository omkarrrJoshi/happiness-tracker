import { useState } from "react";
import "./chapterTracker.css"; // Import styles for checkboxes and completed items
import { TodoItem } from "./toDoItem";
import { updateChapterCompletion } from "../../../features/spiritual/parayanasSlice";
import { store } from "../../../redux/store";
import { useSelector } from "react-redux";
import { showNotification } from "../../../utils/util";


export const ChapterTracker = ({ heading, chapters, parayanaId }) => {
  const user = useSelector((state) => state.auth.user); 
  const toggleChapter = (chapterName, id, completed) => {
    store.dispatch(updateChapterCompletion({parayanaId: parayanaId, chapterId: id, completed: completed, user_id: user.id}));
    showNotification(`${chapterName} marked as ${completed ? 'completed' : 'incomplete'}`, 2000)
  }

  return (
    <div className="chapter-tracker">
      <div className="tracker-heading">
        <h2>{heading}</h2>
      </div>
      <div className="chapter-list">
        {
          chapters.map((chapter) => {
            return (
              <TodoItem 
                key={chapter.id}
                task={chapter}
                id={chapter.id}
                onToggle={toggleChapter}
              />
            )
          })
        }
      </div>
    </div>
  );
};
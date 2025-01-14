import { useState } from 'react'
import './parayanaChaptersTracker.css' 
import { ParayanasChapterModalOverlay } from './parayanasChapterModalOverlay';
import { useDispatch, useSelector } from 'react-redux';
import { ChapterTracker } from './chapterTracker';
import { fetchParayanasTracker } from '../../../features/spiritual/parayanasSlice';
import { LoadingOverlay } from '../../loading-overlay';

export const ParayanaChaptersTracker = ({parayana}) => {

  const user = useSelector((state) => state.auth.user);
  const selectedDate = useSelector((state) => state.dateReducer.currentDate);
  const parayanas_tracker = useSelector((state) => state.parayanas.parayanas_tracker);
  const parayana_chapter = useSelector((state) => state.parayanas.parayana_chapter);

  const data = parayanas_tracker.data.find((p) => p.id === parayana.id);
  const loading = parayanas_tracker.loading;
  const message = parayanas_tracker.message;
  const error = parayanas_tracker.error;
  const dispatch = useDispatch();

  
  if(!parayanas_tracker.rendered){
    console.log("yayyyyy");
    const queryParams = {
      user_id: user.uid,
      date: selectedDate
    };
    dispatch(fetchParayanasTracker(queryParams));
  }
  const [addChapter, setAddChapter] = useState(false)

  function toggleChapterModal(){
    setAddChapter(!addChapter);
  }

  const groupedByProgressId = (tracked_parayana_chapters) => {
    return tracked_parayana_chapters.reduce((acc, chapter) => {
      // If the progress_id key doesn't exist in the accumulator, initialize it
      if (!acc[chapter.progress_id]) {
        acc[chapter.progress_id] = [];
      }
      // Push the current chapter into the array for its progress_id
      acc[chapter.progress_id].push(chapter);
      return acc;
    }, {});
  };

  const sortParayanas = (groupedByProgress) => {
    return Object.entries(groupedByProgress)
      .map(([progress_id, chapters]) => {
        // Sort chapters within each process by `completed` and `created_at`
        const sortedChapters = chapters.sort((a, b) => {
          if (a.completed === b.completed) {
            // If `completed` is the same, sort by `created_at`
            return a.created_at.seconds - b.created_at.seconds;
          }
          // Completed chapters go to the end
          return a.completed - b.completed;
        });
  
        // Determine if all chapters in this process are completed
        const allCompleted = sortedChapters.every((chapter) => chapter.completed);
  
        return {
          progress_id,
          chapters: sortedChapters,
          allCompleted,
        };
      })
      .sort((a, b) => {
        if (a.allCompleted === b.allCompleted) {
          // If allCompleted status is the same, sort by progress_id
          return a.progress_id - b.progress_id;
        }
        // Processes with all chapters completed go to the end
        return a.allCompleted - b.allCompleted;
      });
  };
  
  return (
    <div className="parayana-tracker-container">
      <LoadingOverlay isLoading={loading} />

      {parayanas_tracker.rendered && 
        <div>
        <div className="parayana-header">
          <h2>{parayana.name}</h2>
          <h2>Monthly Target: {parayana.monthly_target}</h2>
        </div>

        <div className="chapter-header">
          <div className="col-8">Parayana chapters</div>
          <div className="col-4">
            <button onClick={toggleChapterModal}>Add chapter</button>
          </div>
        </div>

        <div className="grouped-chapters">
          {Object.entries(sortParayanas(groupedByProgressId(data.tracked_parayana_chapters))).map(([key, value]) => (
            <div key={key} className="chapter-group">
              <ChapterTracker parayanas={value} parayanaId={parayana.id} />
            </div>
          ))}
        </div>

        {addChapter && (
          <div>
            <ParayanasChapterModalOverlay parayana={parayana} toggleModal={toggleChapterModal} />
          </div>
        )}</div>
      }
    </div>
  )
}
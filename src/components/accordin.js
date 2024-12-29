import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { ShlokaTrackerList } from './DailyShlokaTrackerList';

const Acco = () => {
    return (
        <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary
                
                aria-controls="panel1-content"
                id="panel1-header"
            >
                Shlokas
            </AccordionSummary>
            <AccordionDetails>
                <ShlokaTrackerList />
            </AccordionDetails>
        </Accordion>
    )
}

export default Acco;
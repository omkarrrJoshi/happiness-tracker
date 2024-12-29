import './App.css';
import Spiritual from './pages/spiritual';
import Acco from './components/accordin';

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/spiritual" element={<Spiritual />} />
    //     <Route path="/" element={<Spiritual />} /> {/* Default route for Auth */}
    //   </Routes>
    // </Router>
    <div>
      {/* <Header/> */}
      <Spiritual/>
      <Acco/>
    </div>
  );
}

export default App;

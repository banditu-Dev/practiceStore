import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Store from './Store';
import Checkout from './Checkout';
import Bought from './Bought';
import Reviews from './Reviews';
import AdminPanel from './Admin';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Store />} />
         <Route path="/admin" element={<AdminPanel />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Bought />} />
      </Routes>
    </Router>
  );
}

export default App;
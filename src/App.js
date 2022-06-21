import './App.css';
import Buy from './components/Buy';
import Navbar from './components/Navbar';
import { Routes, Route } from "react-router-dom";
import Sell from './components/Sell';

function App() {
  return (
  <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Buy/>}/>
      <Route path="/sell" element={<Sell/>}/>
    </Routes>
  </>
  );
}

export default App;

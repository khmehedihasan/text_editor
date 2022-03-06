import { Route, Routes } from 'react-router-dom';
import './App.css';
import Admin from './pages/Admin';
import User from './pages/User';

function App() {
  return(
    <>
    <Routes>
      <Route path='/' element={<Admin />} />
      <Route path='/user' element={<User />} />
    </Routes>
    </>
  )
}

export default App;

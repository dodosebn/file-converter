
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/homePage'
import LoginPage from './pages/loginPage'
import SignUpPage from './pages/signUpPage'
function App() {

  return (
        <BrowserRouter>

    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignUpPage />} />
    </Routes>
    </BrowserRouter>)
}

export default App

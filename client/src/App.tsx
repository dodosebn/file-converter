
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import { ForgotPage, HomePage, LoginPage, SignUpPage } from './pages'
import InHome from './pages/inHome'
import { Layout } from './components'
function App() {

  return (
        <BrowserRouter>
<Layout >
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='/forgot-password' element={<ForgotPage />} />
      <Route path='/in/home' element={<InHome />} />
    </Routes>
    </Layout>
    </BrowserRouter>)
}

export default App;

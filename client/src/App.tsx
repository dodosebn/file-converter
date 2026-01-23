
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import { Layout } from './components'
import { ForgotPage, HomePage, LoginPage, SignUpPage } from './pages'
function App() {

  return (
        <BrowserRouter>
<Layout >
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='/forgot-password' element={<ForgotPage />} />
    </Routes>
    </Layout>
    </BrowserRouter>)
}

export default App;

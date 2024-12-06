import { BrowserRouter, Route, Routes } from "react-router-dom"
import Appbar from "./components/Appbar"
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import Dashboard from "./pages/Dashboard";
import CreateMonitor from "./pages/CreateMonitor";
import { RecoilRoot } from "recoil";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";

function App() {

  return (
    <>
    <div className="flex flex-col min-h-screen overscroll-x-none">
      <BrowserRouter>
      <RecoilRoot>
        <Appbar/>
          <div className="flex-grow  text-slate-800">
            <Routes>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/signup" element={<SignupPage/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/dashboard/new" element={<CreateMonitor/>}/>
              <Route path="/*" element={<NotFound />} />  
            </Routes>
          </div>
      </RecoilRoot>
      </BrowserRouter>
    </div>
      <Footer/>
    </>
  )
}

export default App

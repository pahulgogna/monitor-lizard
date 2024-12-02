import { BrowserRouter, Route, Routes } from "react-router-dom"
import Appbar from "./components/Appbar"
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import Dashboard from "./pages/Dashboard";
import CreateMonitor from "./pages/CreateMonitor";
import { RecoilRoot } from "recoil";

function App() {

  return (
    <div className="overscroll-x-none">
      <BrowserRouter>
      <RecoilRoot>
        <Appbar/>
          <div className="  text-slate-800">
            <Routes>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/signup" element={<SignupPage/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/dashboard/new" element={<CreateMonitor/>}/>
            </Routes>
          </div>
      </RecoilRoot>
      </BrowserRouter>
    </div>
  )
}

export default App

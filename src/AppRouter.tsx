import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import logo from "./assets/logo.svg";
import JsonEditor from './components/JsonEditor/JsonEditor';
import JsonFormatter from './components/JsonFormatter/JsonFormatter';

const AppRouter: React.FC = () => {

//   const getClass = (data) => {
//                     data.isActive ? "text-gray-900 hover:text-gray-900 transition-colors" : "text-gray-800 hover:text-gray-500 transition-colors"
//   }

  return (
    <HashRouter>
      <>
        <header className="bg-gray-300 py-4 px-6 flex justify-between items-center">
            <div className="flex items-center">
                <a href="#" className="text-xl font-bold text-gray-800">
                    <img src={logo} alt="App Logo" width={100}/>
                </a>
            </div>

            <nav className="flex space-x-6">
                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? 'text-blue-700 active-link' : 'text-blue-500 inactive-link')}
                >
                    JSON Editor
                </NavLink>
                <NavLink
                    to="/JsonFormatter"
                    className={({ isActive }) => (isActive ? 'text-blue-700 active-link' : 'text-blue-500 inactive-link')}
                >
                    JSON Editor
                </NavLink>
            </nav>
        </header>
        <Routes>
            <Route path="/" element={<JsonEditor />} />
            <Route path="/JsonFormatter" element={<JsonFormatter />} />
        </Routes>
      </>  
    </HashRouter>
  );
};

export default AppRouter;
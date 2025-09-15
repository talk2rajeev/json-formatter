
import React from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import logo from "./assets/logo.svg";
import JsonEditor from './components/JsonEditor/JsonEditor';
import JsonFormatter from './components/JsonFormatter/JsonFormatter';
import JsonCompare from './components/JsonCompare/JsonCompare';


const AppRouter: React.FC = () => {

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
                    JSON Formatter
                </NavLink>
                <NavLink
                    to="/JsonCompare"
                    className={({ isActive }) => (isActive ? 'text-blue-700 active-link' : 'text-blue-500 inactive-link')}
                >
                    JSON Compare
                </NavLink>
            </nav>
        </header>
        <Routes>
            <Route path="/" element={<JsonEditor />} />
            <Route path="/JsonFormatter" element={<JsonFormatter />} 
            />
            <Route path="/JsonCompare" element={<JsonCompare />} 
            />
        </Routes>
      </>  
    </HashRouter>
  );
};

export default AppRouter;
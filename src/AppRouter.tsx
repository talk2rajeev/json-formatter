import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import JsonEditor from './components/JsonEditor/JsonEditor';
import JsonFormatter from './components/JsonFormatter/JsonFormatter';

const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="p-4 sticky top-0">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-white hover:text-blue-200 font-semibold">
                Json Editor
              </Link>
            </li>
            <li>
              <Link to="/JsonFormatter" className="text-white hover:text-blue-200 font-semibold">
                Json Formatter
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<JsonEditor />} />
          <Route path="/JsonFormatter" element={<JsonFormatter />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default AppRouter;
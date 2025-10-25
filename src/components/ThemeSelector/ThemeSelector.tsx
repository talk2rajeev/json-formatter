import {themes, type Theme} from '../../utils/constants/constants';

// export const themes = ['vs-dark', 'vs', 'hc-black'] as const;
// export type Theme = typeof themes[number];


interface ThemeSelectorType {
    theme: Theme,
    setTheme: (value: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorType> = ({theme, setTheme}) => {
  // const [theme, setTheme] = useState('vs');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as Theme);
  };

  return (
    <div>
      <label htmlFor="theme-select" className="text-gray-700 dark:text-gray-300 font-medium">
        Select Theme:
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={handleChange}
        className="
          px-2 py-1
          ml-2 
          bg-white dark:bg-gray-800 
          text-gray-900 dark:text-gray-100 
          border border-gray-300 dark:border-gray-600 
          rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
        "
      >
        {themes.map((themeOption) => (
          <option key={themeOption} value={themeOption}>
            {themeOption}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;
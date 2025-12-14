import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white shadow-md z-50">
      <div className="w-full px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Rick & Morty Wiki
        </Link>
        <div className="flex gap-4">
          <Link to="/">
            <button>Home</button>
          </Link>
          <Link to="/characters">
            <button>Characters</button>
          </Link>
          <Link to="/episodes">
            <button>Episodes</button>
          </Link>
          <Link to="/locations">
            <button>Locations</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

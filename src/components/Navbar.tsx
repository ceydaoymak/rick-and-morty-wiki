import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white shadow-md z-50">
      <div className="w-full px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Rick & Morty Wiki
        </Link>
        <div className="flex gap-4">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/characters">
            <Button variant="ghost">Characters</Button>
          </Link>
          <Link to="/episodes">
            <Button variant="ghost">Episodes</Button>
          </Link>
          <Link to="/locations">
            <Button variant="ghost">Locations</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

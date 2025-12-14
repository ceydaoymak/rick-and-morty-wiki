import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Link } from 'react-router-dom';
import Card from '@/components/Card';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

export const CharactersList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/character?page=${currentPage}`;
        if (searchQuery.trim()) {
          url = `/character?name=${searchQuery}&page=${currentPage}`;
        }
        const response = await api.get<{ info: { pages: number }; results: Character[] }>(url);
        setCharacters(response.data.results);
        setTotalPages(response.data.info.pages);
      } catch (err) {
        setError('Failed to fetch characters');
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [currentPage, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-12 w-full bg-gray-50 ">
      <div className="w-full px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Characters</h1>

        {loading && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        )}

        {characters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No characters found</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {characters.map((character) => (
            <Link to={`/characters/${character.id}`} key={character.id}>
              <div className="cursor-pointer hover:shadow-lg transition-shadow">
                <Card
                  image={character.image}
                  title={character.name}
                  description={`Status: ${character.status} • Species: ${character.species}`}
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 my-8">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Link } from 'react-router-dom';
import Card from '@/components/Card';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

export function CharactersList(){
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/character?page=${currentPage}`;
        if (search.trim()) {
          url = `/character?name=${encodeURIComponent(search)}&page=${currentPage}`;
        }
        const response = await api.get<{ info: { pages: number }; results: Character[] }>(url);
        setCharacters(response.data.results);
        setTotalPages(response.data.info.pages);
      } catch (err: any) {
        if (err.response?.status === 404 && search) {
          setCharacters([]);
          setTotalPages(1);
          setError(null);
        } else {
          setError('Failed to fetch characters');
          setCharacters([]);
        }

      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [currentPage, search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-12 w-full bg-gray-50 ">
      <div className="w-full px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Characters</h1>
        <div className="mb-6 flex items-center gap-2">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            placeholder="Search by name..."
          />
        </div>

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

        {!loading && !error && search && characters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              No characters found for "<span className="font-medium">{search}</span>"
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {characters.map((character) => (
            <Link to={`/characters/${character.id}`} key={character.id} className='cursor-point'>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

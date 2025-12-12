import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
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
        const response = await api.get<ApiResponse>(url);
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

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

        {!loading && !error && characters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No characters found</p>
          </div>
        )}

        {!loading && !error && characters.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {characters.map((character) => (
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <img
                      src={character.image}
                      alt={character.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  </CardContent>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{character.name}</CardTitle>
                    <CardDescription>
                      <div className="text-sm mt-2">
                        <p><span className="font-semibold">Status:</span> {character.status}</p>
                        <p><span className="font-semibold">Species:</span> {character.species}</p>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 my-8">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

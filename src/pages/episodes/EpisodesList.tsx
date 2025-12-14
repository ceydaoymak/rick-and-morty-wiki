import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Link } from 'react-router-dom'; 
import Card from '@/components/Card';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';

interface Episode {
  id: number;
  name: string;
  episode: string;
  air_date: string;
}

export function EpisodesList(){
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/episode?page=${currentPage}`;
        if (search) {
          url = `/episode?name=${encodeURIComponent(search)}&page=${currentPage}`;
        }
        const response = await api.get(url);
        setEpisodes(response.data.results);
        setTotalPages(response.data.info.pages);
      } catch (err: any) {
        if (err.response?.status === 404 && search) {
          setEpisodes([]);
          setTotalPages(1);
          setError(null);
        } else {
          setError('Failed to fetch episodes');
          setEpisodes([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [currentPage,search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-12 w-full bg-gray-50 ">
      <div className="w-full px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Episodes</h1>
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

        {episodes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No episodes found</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {episodes.map((episode) => (
            <Link to={`/episodes/${episode.id}`} key={episode.id}>
              <div className="cursor-pointer hover:shadow-lg transition-shadow">
                <Card
                  title={episode.name}
                  description={`Episode: ${episode.episode} • Air Date: ${episode.air_date}`}
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

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Link } from 'react-router-dom'; 
import Card from '@/components/Card';

interface Episode {
  id: number;
  name: string;
  episode: string;
  air_date: string;
}

export const EpisodesList: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/episode?page=${currentPage}`);
        setEpisodes(response.data.results);
        setTotalPages(response.data.info.pages);
      } catch (err) {
        setError('Failed to fetch episodes');
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-12 w-full bg-gray-50 ">
      <div className="w-full px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Episodes</h1>

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

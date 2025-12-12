import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Episode {
  id: number;
  name: string;
  episode: string;
  air_date: string;
}

interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Episode[];
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
        const response = await api.get<ApiResponse>(`/episode?page=${currentPage}`);
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

        {!loading && !error && episodes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No episodes found</p>
          </div>
        )}

        {!loading && !error && episodes.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {episodes.map((episode) => (
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{episode.name}</CardTitle>
                    <CardDescription>
                      <div className="text-sm mt-2 space-y-1">
                        <p><span className="font-semibold">Episode:</span> {episode.episode}</p>
                        <p><span className="font-semibold">Air Date:</span> {episode.air_date}</p>
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

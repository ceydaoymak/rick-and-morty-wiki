import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Link } from 'react-router-dom';
import Card from '@/components/Card';

interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
}

export function LocationsList () {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/location?page=${currentPage}`);
        setLocations(response.data.results);
        setTotalPages(response.data.info.pages);
      } catch (err) {
        setError('Failed to fetch locations');
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-12 w-full bg-gray-50 ">
      <div className="w-full px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Locations</h1>

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

        {locations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No locations found</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {locations.map((location) => (
            <Link to={`/locations/${location.id}`} key={location.id}>
              <div className="cursor-pointer hover:shadow-lg transition-shadow">
                <Card
                  title={location.name}
                  description={`Type: ${location.type} • Dimension: ${location.dimension}`}
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

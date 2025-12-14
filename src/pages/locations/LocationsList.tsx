import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Link } from 'react-router-dom';
import Card from '@/components/Card';
import { Pagination } from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';

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
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/location?page=${currentPage}`;
        if (search) {
          url = `/location?name=${encodeURIComponent(search)}&page=${currentPage}`;
        }
        const response = await api.get(url);
        setLocations(response.data.results);
        setTotalPages(response.data.info.pages);
      } catch (err: any) {
        if (err.response?.status === 404 && search) {
          setLocations([]);
          setTotalPages(1);
          setError(null);
        } else {
          setError('Failed to fetch locations');
          setLocations([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [currentPage,search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-12 w-full bg-gray-50 ">
      <div className="w-full px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Locations</h1>
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

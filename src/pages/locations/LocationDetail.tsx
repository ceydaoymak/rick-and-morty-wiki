import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
}

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

export const LocationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationAndCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        const locationResponse = await api.get<Location>(`/location/${id}`);
        setLocation(locationResponse.data);

        if (locationResponse.data.residents.length > 0) {
          const characterIds = locationResponse.data.residents
            .map((url: string) => url.split('/').pop())
            .join(',');
          const charactersResponse = await api.get<Character | Character[]>(`/character/${characterIds}`);
          const charactersArray = Array.isArray(charactersResponse.data)
            ? charactersResponse.data
            : [charactersResponse.data];
          setCharacters(charactersArray);
        }
      } catch (err) {
        setError('Failed to fetch location details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLocationAndCharacters();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="- bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className=" bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'Location not found'}</p>
          <Link to="/locations">
            <Button>Back to Locations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 ">
      <div className="w-full px-4 py-8">
        <Link to="/locations" className="mb-6 inline-block">
          <Button variant="outline">Back to Locations</Button>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{location.name}</h1>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-600">Type</p>
              <p className="text-lg text-gray-900">{location.type}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Dimension</p>
              <p className="text-lg text-gray-900">{location.dimension}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Residents</h2>
          {characters.length === 0 ? (
            <p className="text-gray-600">No residents found for this location</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          )}
        </div>
      </div>
    </div>
  );
};

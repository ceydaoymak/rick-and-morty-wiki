import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import { CharacterCard } from '@/components/CharacterCard';
import { Button } from '@/components/ui/button';

interface Episode {
  id: number;
  name: string;
  episode: string;
  air_date: string;
  characters: string[];
}

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

export const EpisodeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodeAndCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        const episodeResponse = await api.get<Episode>(`/episode/${id}`);
        setEpisode(episodeResponse.data);

        if (episodeResponse.data.characters.length > 0) {
          const characterIds = episodeResponse.data.characters
            .map((url: string) => url.split('/').pop())
            .join(',');
          const charactersResponse = await api.get<Character | Character[]>(`/character/${characterIds}`);
          const charactersArray = Array.isArray(charactersResponse.data)
            ? charactersResponse.data
            : [charactersResponse.data];
          setCharacters(charactersArray);
        }
      } catch (err) {
        setError('Failed to fetch episode details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEpisodeAndCharacters();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="- bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="- bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'Episode not found'}</p>
          <Link to="/episodes">
            <Button>Back to Episodes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 ">
      <div className="w-full px-4 py-8">
        <Link to="/episodes" className="mb-6 inline-block">
          <Button variant="outline">Back to Episodes</Button>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{episode.name}</h1>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-600">Episode</p>
              <p className="text-lg text-gray-900">{episode.episode}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Air Date</p>
              <p className="text-lg text-gray-900">{episode.air_date}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Characters</h2>
          {characters.length === 0 ? (
            <p className="text-gray-600">No characters found for this episode</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

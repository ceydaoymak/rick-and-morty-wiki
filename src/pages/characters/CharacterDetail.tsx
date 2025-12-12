import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import { EpisodeCard } from '@/components/EpisodeCard';
import { Button } from '@/components/ui/button';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: { name: string };
  location: { name: string };
  image: string;
  episode: string[];
}

interface Episode {
  id: number;
  name: string;
  episode: string;
  air_date: string;
}

export const CharacterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacterAndEpisodes = async () => {
      setLoading(true);
      setError(null);
      try {
        const characterResponse = await api.get<Character>(`/character/${id}`);
        setCharacter(characterResponse.data);

        if (characterResponse.data.episode.length > 0) {
          const episodeIds = characterResponse.data.episode
            .map((url: string) => url.split('/').pop())
            .join(',');
          const episodesResponse = await api.get<Episode | Episode[]>(`/episode/${episodeIds}`);
          const episodesArray = Array.isArray(episodesResponse.data)
            ? episodesResponse.data
            : [episodesResponse.data];
          setEpisodes(episodesArray);
        }
      } catch (err) {
        setError('Failed to fetch character details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCharacterAndEpisodes();
    }
  }, [id]);

  if (loading) {
    return (
      <div className=" bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className=" bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'Character not found'}</p>
          <Link to="/characters">
            <Button>Back to Characters</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 ">
      <div className="w-full px-4 py-8">
        <Link to="/characters" className="mb-6 inline-block">
          <Button variant="outline">Back to Characters</Button>
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
            <div>
              <img
                src={character.image}
                alt={character.name}
                className="w-full rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{character.name}</h1>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Status</p>
                  <p className="text-lg text-gray-900">{character.status}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Species</p>
                  <p className="text-lg text-gray-900">{character.species}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Gender</p>
                  <p className="text-lg text-gray-900">{character.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Origin</p>
                  <p className="text-lg text-gray-900">{character.origin.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Location</p>
                  <p className="text-lg text-gray-900">{character.location.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Episodes</h2>
          {episodes.length === 0 ? (
            <p className="text-gray-600">No episodes found for this character</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

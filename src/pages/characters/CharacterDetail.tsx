import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';

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

export function CharacterDetail(){
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: character } = await api.get<Character>(`/character/${id}`);
        setCharacter(character);

        const episodeIds = character.episode?.map(u => u.split("/").pop()).join(",");
        if (!episodeIds) return setEpisodes([]);

        const { data } = await api.get<Episode | Episode[]>(`/episode/${episodeIds}`);
        setEpisodes(Array.isArray(data) ? data : [data]);
      } catch {
        setError("Failed to fetch character details");
      } finally {
        setLoading(false);
      }
    })();
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
            <button>Back to Characters</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 ">
      <div className="w-full px-4 py-8">
        <Link to="/characters" className="mb-6 inline-block">
          <button>Back to Characters</button>
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
                <div className="cursor-pointer hover:shadow-lg transition-shadow">
                  <div>
                    <h3 className="text-lg">{episode.name}</h3>
                    <div className="text-sm mt-2 space-y-1">
                      <p><span className="font-semibold">Episode:</span> {episode.episode}</p>
                        <p><span className="font-semibold">Air Date:</span> {episode.air_date}</p>
                      </div>
                  </div>  
                </div>            
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

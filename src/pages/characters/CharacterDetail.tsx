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
}

export function CharacterDetail(){
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
          const { data: character } = await api.get<Character>(`/character/${id}`);
          setCharacter(character);

          if (character.episode.length > 0) {
            const episodeIds = character.episode
              .map(url => url.split('/').pop())
              .join(',');

            const { data } = await api.get<Episode | Episode[]>(`/episode/${episodeIds}`);
            setEpisodes(Array.isArray(data) ? data : [data]);
          }
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
    <div className="w-full">
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 p-6">
              <p className="text-sm font-semibold text-gray-600 mb-3">Episodes</p>

              {episodes.length === 0 ? (
                <p className="text-gray-500 text-sm">No episodes available</p>
              ) : (
                <ul
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-x-6
                    gap-y-2
                    text-sm
                  "
                >
                  {episodes.map((ep) => (
                    <li key={ep.id}>
                      <Link
                        to={`/episodes/${ep.id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {ep.episode} – {ep.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
      </div>
    </div>
  );
};

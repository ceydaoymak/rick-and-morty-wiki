import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';

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
  image: string;
}

export function EpisodeDetail() {
  const { id } = useParams<{ id: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const fetchEpisodeAndCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: episode } = await api.get<Episode>(`/episode/${id}`);
        setEpisode(episode);

        if (episode.characters.length > 0) {
          const characterIds = episode.characters
            .map(url => url.split('/').pop())
            .join(',');

          const { data } = await api.get<Character | Character[]>(
            `/character/${characterIds}`
          );

          setCharacters(Array.isArray(data) ? data : [data]);
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
            <button>Back to Episodes</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 ">
      <div className="w-full px-4 py-8">
        <Link to="/episodes" className="mb-6 inline-block">
          <button>Back to Episodes</button>
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
        <div className='bg-white rounded-lg shadow-md p-8 mb-8'>
          <p className="text-sm font-semibold text-gray-600 mb-3">Characters</p>

          {characters.length === 0 ? (
            <p className="text-gray-500 text-sm">No characters available</p>
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
              {characters.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/characters/${c.id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {c.name}
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

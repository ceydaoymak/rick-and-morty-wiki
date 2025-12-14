import { useState, useEffect } from "react";
import api from "@/services/api";

export function Home() {
  const [characterCount, setCharacterCount] = useState<number | null>(null);
  const [episodeCount, setEpisodeCount] = useState<number | null>(null);
  const [locationCount, setLocationCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [charactersRes, episodesRes, locationsRes] = await Promise.all([
          api.get("/character"),
          api.get("/episode"),
          api.get("/location"),
        ]);

        setCharacterCount(charactersRes.data.info.count);
        setEpisodeCount(episodesRes.data.info.count);
        setLocationCount(locationsRes.data.info.count);
      } catch {
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-50">
      <p className="text-xl">Welcome To</p>
      <h1 className="text-3xl font-semibold text-gray-900">
        Rick and Morty Wiki
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-4xl font-bold text-gray-900">{characterCount}</p>
          <p className="text-sm text-gray-600">Characters</p>
        </div>

        <div>
          <p className="text-4xl font-bold text-gray-900">{episodeCount}</p>
          <p className="text-sm text-gray-600">Episodes</p>
        </div>

        <div>
          <p className="text-4xl font-bold text-gray-900">{locationCount}</p>
          <p className="text-sm text-gray-600">Locations</p>
        </div>
      </div>
    </div>
  );
}

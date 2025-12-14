import { useState, useEffect } from "react";
import api from "@/services/api";

interface ApiInfo {
  count: number;
}

interface ApiResponse {
  info: ApiInfo;
}

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
          api.get<ApiResponse>("/character"),
          api.get<ApiResponse>("/episode"),
          api.get<ApiResponse>("/location"),
        ]);

        setCharacterCount(charactersRes.data.info.count);
        setEpisodeCount(episodesRes.data.info.count);
        setLocationCount(locationsRes.data.info.count);
      } catch (err) {
        setError("Failed to fetch analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="w-full pt-24 min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full pt-24 min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full pt-24 pb-12 min-h-screen p-20 flex flex-col items-center">
      {/* Header */}
      <div className="w-full text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          Dashboard Analytics
        </h1>
        <p className="text-lg text-gray-600">
          Rick and Morty Universe Statistics
        </p>
      </div>

      {/* Metrics */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white shadow-lg border-0 p-6 rounded-lg">
          <div className="pb-2">
            <h2 className="text-sm text-gray-600">
              Total Characters
            </h2>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">
              {characterCount?.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Unique characters in the universe
            </p>
          </div>
        </div>  
        <div className="bg-white shadow-lg border-0 p-6 rounded-lg">
          <div className="pb-2">
            <h2 className="text-sm text-gray-600">
              Total Episodes
            </h2>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600">
              {episodeCount?.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Episodes aired</p>
          </div>
        </div>

        <div className="bg-white shadow-lg border-0 p-6 rounded-lg">
          <div className="pb-2">
            <h2 className="text-sm text-gray-600">
              Total Locations
            </h2>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600">
              {locationCount?.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Unique locations</p>
          </div>
        </div>
      </div>    
    </div>
  );
}

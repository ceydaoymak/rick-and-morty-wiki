import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import api from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  const chartData = [
    { name: "Characters", count: characterCount || 0 },
    { name: "Episodes", count: episodeCount || 0 },
    { name: "Locations", count: locationCount || 0 },
  ];

  const chartConfig = {
    count: {
      label: "Count",
      color: "#3b82f6",
    },
  };

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
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">
              Total Characters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">
              {characterCount?.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Unique characters in the universe
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">
              Total Episodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {episodeCount?.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Episodes aired</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">
              Total Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">
              {locationCount?.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Unique locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="w-full bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle>Universe Overview</CardTitle>
          <CardDescription>Total counts across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <ChartTooltip cursor={{ fill: "#f3f4f6" }} />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

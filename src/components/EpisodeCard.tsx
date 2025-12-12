import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface Episode {
  id: number;
  name: string;
  episode: string;
  air_date: string;
}

interface EpisodeCardProps {
  episode: Episode;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  return (
    <Link to={`/episodes/${episode.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">{episode.name}</CardTitle>
          <CardDescription>
            <div className="text-sm mt-2 space-y-1">
              <p><span className="font-semibold">Episode:</span> {episode.episode}</p>
              <p><span className="font-semibold">Air Date:</span> {episode.air_date}</p>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

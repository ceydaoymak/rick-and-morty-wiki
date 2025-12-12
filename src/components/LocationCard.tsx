import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
}

interface LocationCardProps {
  location: Location;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  return (
    <Link to={`/locations/${location.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">{location.name}</CardTitle>
          <CardDescription>
            <div className="text-sm mt-2 space-y-1">
              <p><span className="font-semibold">Type:</span> {location.type}</p>
              <p><span className="font-semibold">Dimension:</span> {location.dimension}</p>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

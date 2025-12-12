import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

interface CharacterCardProps {
  character: Character;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <Link to={`/characters/${character.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <img
            src={character.image}
            alt={character.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        </CardContent>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{character.name}</CardTitle>
          <CardDescription>
            <div className="text-sm mt-2">
              <p><span className="font-semibold">Status:</span> {character.status}</p>
              <p><span className="font-semibold">Species:</span> {character.species}</p>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

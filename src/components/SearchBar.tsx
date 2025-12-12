import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="mb-6">
      <Input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
};

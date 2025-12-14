type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search..."
}: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full max-w-sm
        rounded-lg border
        px-4 py-2
        text-sm
        outline-none
        focus:border-indigo-500
        focus:ring-1 focus:ring-indigo-500
      "
    />
  );
}

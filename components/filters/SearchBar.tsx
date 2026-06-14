'use client';

interface Props {
  defaultValue?: string;
  placeholder?: string;
  action?: string;
  className?: string;
}

export function SearchBar({
  defaultValue = '',
  placeholder = 'Search by name, city, zip code, or cuisine…',
  action = '/search',
  className = '',
}: Props) {
  return (
    <form action={action} role="search" className={`flex gap-2 ${className}`}>
      <label htmlFor="search-input" className="sr-only">
        Search Indian restaurants
      </label>
      <input
        id="search-input"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-spice focus:border-transparent text-sm bg-white"
      />
      <button
        type="submit"
        className="px-5 py-2.5 bg-spice hover:bg-maroon text-white rounded-lg text-sm font-semibold transition-colors"
      >
        Search
      </button>
    </form>
  );
}


import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "../../ui/Input";
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If on wholesale path, search for customers
      if (location.pathname.includes('/wholesale')) {
        // Pass search to wholesale customer tab
        navigate(`/wholesale?tab=customers&search=${encodeURIComponent(searchQuery)}`);
      } else {
        // Default search for services
        navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const placeholder = location.pathname.includes('/wholesale') 
    ? "Search for customers..."
    : "Search for services, games, apps...";

  return (
    <div className="relative mx-4 flex-1 max-w-md">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholder}
            className="pl-10 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;

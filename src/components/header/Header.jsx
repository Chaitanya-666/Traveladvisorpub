import { AppBar, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Search, SearchIconWrapper, StyledInputBase, SuggestionsBox, ToolbarStyled, Title
} from './styles.js';
export default function Header({ Mapcoords, setMapcoords }) {

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  // the last one of map coords and setmap coords better to rename it acc to header one 
  const [HmapCoords, setHMapCoords] = useState([19.076, 72.8777]);

  // Move the coordinate update logic into a useEffect
  useEffect(() => {
    if (Mapcoords[0] !== 0 && Mapcoords[1] !== 0) {
      setHMapCoords(Mapcoords);
    }
  }, [Mapcoords]);
  const fetchSuggestions = async (query) => {
    query = query.trim(); // optional: clean input
    if (query.length < 3) return;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`);

      if (!res.ok) {
        throw new Error(`Nominatim API error: ${res.status}`);
      }

      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]); // fallback to empty list
    }
  };


  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSuggestions(value);
  };

  const handleSelect = (place) => {
    if (!place || !place.lat || !place.lon) return;

    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setMapcoords([lat, lon]);
    setSuggestions([]);
    setSearchQuery(place.display_name);
  };

  return (
    <AppBar position="static">
      <ToolbarStyled>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          width: '100%',
          gap: { xs: 1, sm: 2 }
        }}>
          <Title
            variant="h5"
            sx={{
              flexGrow: { xs: 0, sm: 1 },
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }}
          >
            Travel Advisor
          </Title>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Title
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Explore new places
            </Title>

            <Search sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search location…"
                value={searchQuery}
                onChange={handleInputChange}
                inputProps={{ 'aria-label': 'search' }}
              />
              {suggestions.length > 0 && (
                <SuggestionsBox>
                  {suggestions.map((place, index) => (
                    <Box
                      key={`${place.place_id}-${index}`}
                      className="suggestion-item"
                      onClick={() => handleSelect(place)}
                    >
                      {place.display_name}
                    </Box>
                  ))}
                </SuggestionsBox>
              )}
            </Search>
          </Box>
        </Box>
      </ToolbarStyled>
    </AppBar>
  );
}

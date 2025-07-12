import { useState, useEffect, createRef } from 'react';
import { InputLabel, MenuItem, Grid } from '@mui/material';
import PlaceDetails from '../PlaceDetails/PlaceDetails';
import { StyledFormControl, StyledSelect, StyledCircularProgress, StyledGrid, StyledTypography, StyledList } from './styles';

const List = ({ filteredPlaces, type, setType, rating, setRating, childClicked, isLoading }) => {
  const [elRefs, setElRefs] = useState([]);

  useEffect(() => {
    setElRefs((refs) => Array(filteredPlaces?.length).fill().map((_, i) => refs[i] || createRef()));
  }, [filteredPlaces]);


  return (
    <StyledList >
      <StyledTypography variant="h4">Food & Dining around you</StyledTypography>
      {isLoading ? (
        <StyledCircularProgress size="5rem" />
      ) : (
        <>
          {/* used the first form control for type */}
          <StyledFormControl>
            <InputLabel id="type">Type</InputLabel>
            <StyledSelect id="type" value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="restaurants">Restaurants</MenuItem>
              <MenuItem value="hotels">Hotels</MenuItem>
              <MenuItem value="attractions">Attractions</MenuItem>
            </StyledSelect>
          </StyledFormControl>
          {/* used the second form control to filter out things by rating */}
          <StyledFormControl>
            <InputLabel id="rating">Rating</InputLabel>
            <StyledSelect id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
              <MenuItem value="0">All</MenuItem>
              <MenuItem value="3">Above 3.0</MenuItem>
              <MenuItem value="4">Above 4.0</MenuItem>
              <MenuItem value="4.5">Above 4.5</MenuItem>
            </StyledSelect>
          </StyledFormControl>
          <StyledGrid container spacing={3}>
            {filteredPlaces?.map((place, i) => (
              <Grid ref={elRefs[i]} key={i} item xs={12}>
                <PlaceDetails selected={Number(childClicked) === i} refProp={elRefs[i]} place={place} />
              </Grid>
            ))}
          </StyledGrid>
        </>
      )}
    </StyledList>
  );
};

export default List;
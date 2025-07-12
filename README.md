# TravelAdvisor webapp using React + Reactleafleft
## All important theoretical + implementation details  
### about mui (new)
  - Could use v6.3.0 with somewhat difficulties but understood 2 major workflows of using mui 
    - either using `styled` api alongside maintaining a seperate `.js` file for each styled components making it easier for us to use across various components
    - or for ease simply using `sx` prop but this method is cubersome for large projects , better to create reusable styled components 
### about react leaflet
  - Best free alternative to google maps react , easy to use and modify , does have manual effort of writing custom map events , etc but overall was a great free component 
### additional concepts used when building the project
  - primarily learnt usage of `axios` alongside `restapis`
  - can use lots of free apis like without worrying much about registration keys or plans 
    - `https://api.open-meteo.com/v1/forecast`
    -  `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`
### project challenges / key learnings 
  1. map component crashed whenever panning because of markercoordinates becoming undefined at some point 
    - ### Problem
          The application was crashing when panning the map due to an error related to `undefined` coordinates. Specifically, the error occurred because the markerCoord
          was `undefined` at some point, causing the 

          Marker

          component to fail.

          - react leaflet accepts coords in 2 element array latitude then longitutde not objects geolocation should be changed 
    - ### Solution
            To solve this issue, we ensured that the 

            markerCoord

            is always defined before rendering the 

            Marker

            component. Here's the detailed explanation:
  2. wasnt able to place location markers on the map related to entities , nor their details or anything at all despite actually containing them in the list  
    - ### Problem
            for some reason it is causing the markers not to be displayed the actual issue could be very strict check especially later checks with === number but initially the coords are in string so we cannot really get a number like that 
    - ### Solution
        ```js
          removed the .filter(place =>
            'latitude' in place && // Check if the 'latitude' key exists
            'longitude' in place && // Check if the 'longitude' key exists
            typeof place.latitude === 'number' && // Ensure 'latitude' is a number
            typeof place.longitude === 'number' // Ensure 'longitude' is a number
          )
        ```
  3. another problem is to let list get a proper `ChildClicked` index so that if we click on desired marker corresponding item is filtered out from the list 
    - ### Problem
        because how we used the filter and map methods outside the index of clicked index may not be the original one in entire set of `places` which causes the childClicked to be undefined 
    - ### Solution 
        Simply do one thing because the fact that we are trying to just display top 10 locations with greater than equal to 4 stars rating whenever we have the 4 star or higher rating place in the filter condition stores its original index and later that will be used to identify the clicked child 
        ```js
            if (Number(place.rating) >= 4.0) {
              place._originalIndex = originalIndex;
              return true;
            }
            return false;
        ```  
  4. couldnt use the autocomplete easily due to it being a part of google maps places api 
    - ### Problem 
      google maps places api made it extremely easy to use autcomplete features to get locations directly but since this project couldnt use gmaps api directly hence a workaround was found
    - ### Solution 
      using leaflet +  Nominatim Search API ( powered by OpenStreetMap ) because of following reasons 
        - We are working with Leaflet, which aligns well with OpenStreetMap data
        - We wanted to avoid Google Places API or anything that requires billing
        - It allows fast prototyping and learning without setup
  5. env issue 
    - ### Problem 
       wanted to make sure to make use of `.env` to learn a good practice about hiding important apis from public view , but due to some reason wasnt able to use .env properly 
    - ### Solution 
      learnt about naming consideration on how bundler matters so prefix of bundler or some other convention needs to be followed when using .env variables , most important mistake made though was placing .env incorrectly , placed it not in project root but one level above it , hence vite was unable to detect it , fixed by moving .env to its proper place 
      basically u need to place .env in proper place i.e project root with naming convention ( the bundler matters )
        ```js
            // Will work - prefixed with VITE_
              VITE_API_KEY=123456
              VITE_API_URL=https://api.example.com

              // Won't work - no VITE_ prefix
              API_KEY=123456 
              RAPIDAPI_KEY=123456
        ```
### project issues 
  while the rest of project works fantastically the only issues so far are just 2 which will be hopefully fixed soon 
  1. slightly problematic ui for mobile devices , list items are shown enlarged for mobile devices , possibly just textual information can be shown in list , for now thats on hold 

  2. the endpoint of `https://travel-advisor.p.rapidapi.com/hotels/list-in-boundary` doesnt work reliably even in `rapidapi` playground this was noted where while response was 200 OK it gave an empty array , sadly if this is api issue ( because the apis of list-in-boundary are also marked deprecated ) then nothing can be done 

  one minor issue noted is 
  1. map shakes uncontrollably if the marker is held by touching it , causing map to constantly update its bound possible fix includes to only update bounds if center has been shifted significantly by +10 units lat and lng etc
# &copy; Chaitanya-666 2025
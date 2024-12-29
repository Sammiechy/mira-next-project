import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'

const LocationComp = () => {
    const [location, setLocation] =useState("");
    const [places, setPlaces] = useState([]);

    const debounce = (func: (...args: any[]) => void, delay: number): (...args: any[]) => void => {
      let timer: NodeJS.Timeout | null = null;
      return (...args: any[]) => {
        if (timer) {
          clearTimeout(timer);
        }
    
        timer = setTimeout(() => {
          func(...args);
        }, delay);
      };
    };

    const getLocation=async(value:any)=>{
      const apiKey="AIzaSyAcGHmYB10XEwBKo0lw_hNar-BhjleepQ4";
      const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=${apiKey}&types=(regions)`;
      if (!value) {
        setPlaces([]);
        return;
      }
      try{
        const response = await fetch(endpoint);
        const data = await response.json();
        if (data.status === "OK") {
          setPlaces(data.predictions);
        } else {
          console.error("Error fetching places: ", data.status);
          setPlaces([]);
        }
      }catch(err){

      }

    }

    const fetchPlacesDebounced = debounce(getLocation, 5000)

    const handleChange=(e:any)=>{
      setLocation(e.target.value)
      fetchPlacesDebounced(e.target.value);
    }

  
console.log(places,"places------")
    
  return (
    <div>
        <FormControl fullWidth  >
    {/* <InputLabel id="demo-simple-select-error-label">Location</InputLabel> */}
    <TextField
      // labelId="demo-simple-select-error-label"
      name="locationID"
      label="Location"
      id="demo-simple-select-error"
      value={location}                      
      onChange={(e:any)=>{handleChange(e)}}
    >
      {/* <MenuItem value={"1"}>Chandigarh</MenuItem>
      <MenuItem value={"2"}>Mohali</MenuItem>
      <MenuItem value={"3"}>Delhi</MenuItem>
      <MenuItem value={"4"}>Pune</MenuItem>
      <MenuItem value={"5"}>Hyderabad</MenuItem> */}
    </TextField>
    {/* <FormHelperText>{touched && errors.locationID}</FormHelperText> */}
  </FormControl>
  </div>
  )
}

export default LocationComp
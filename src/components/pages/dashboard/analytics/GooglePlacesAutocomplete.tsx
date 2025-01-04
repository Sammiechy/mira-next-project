"use client";
import React, { useEffect, useState } from 'react';
import { LoadScript,useLoadScript, Autocomplete } from '@react-google-maps/api';
import { FormControl, FormHelperText, TextField } from '@mui/material';

const GOOGLE_API_KEY = 'AIzaSyAcGHmYB10XEwBKo0lw_hNar-BhjleepQ4';  // Replace with your actual API key

interface GooglePlacesAutocompleteProps {
    setFieldValue: (field: string, value: any) => void;
    error: boolean;
    name: string;
    values: any;
    helperText: string | boolean;
    // defaultValue: any;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
    setFieldValue,
    error,
    name,
    values,
    // defaultValue,
    helperText,
}) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_API_KEY,
        libraries: ['places'],
    })
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [inputValue, setInputValue] = useState<any>(''); 
    const handleLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
        setAutocomplete(autocompleteInstance);
    };
    console.log(values,"fhbdj")
    useEffect(()=>{
  
    setInputValue(values);
  
    },[])

    const handlePlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            console.log(place,'placeplace')
            setInputValue(place?.formatted_address);
            // if (place.formatted_address) {
            //     setFieldValue(name, place.formatted_address);
            // }
            const data = {
              target: {
                name: place?.formatted_address,
                value: place?.place_id || '',
              },
            };
            
            setFieldValue("locationID", data);
        }
    };


    if (loadError) return <p>Error loading Google Maps script</p>;
    if (!isLoaded) return <p>Loading...</p>;

    return (
        // <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={['places']}>
             <FormControl fullWidth>
                <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
                    <TextField
                        // type="text"
                        // placeholder="Location"
                        label="Location"
                        value={inputValue  || ""}
                        error={error}
                        helperText={error?"Location is required":""}
                        onChange={(e) => {setFieldValue(name, e.target.value),setInputValue(e.target.value)}}
                        style={{
                            width: '100%',
                            // padding: '10px',
                            // color:error?"red":"#fff",
                            // borderColor: error ? 'red' : '#ccc',
                            // borderWidth: '1px',
                            // borderRadius: '5px'
                        }}
                    />
                </Autocomplete>
            </FormControl>
        // </LoadScript>
    );
};

export default GooglePlacesAutocomplete;

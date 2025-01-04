"use client";
import React, { useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { FormHelperText } from '@mui/material';

const GOOGLE_API_KEY = 'AIzaSyAcGHmYB10XEwBKo0lw_hNar-BhjleepQ4';  // Replace with your actual API key

interface GooglePlacesAutocompleteProps {
    setFieldValue: (field: string, value: any) => void;
    error: boolean;
    name: string;
    values: any;
    helperText: string | boolean;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
    setFieldValue,
    error,
    name,
    values,
    helperText,
}) => {
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [inputValue, setInputValue] = useState<string>(values?.locationID?.target?.name || ''); 
    const handleLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
        setAutocomplete(autocompleteInstance);
    };

    const handlePlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            // console.log(place,'placeplace')
            // if (place.formatted_address) {
            //     setFieldValue(name, place.formatted_address);
            // }
            const data = {
              target: {
                name: place.formatted_address,
                value: place?.place_id || '',
              },
            };
            setFieldValue("locationID", data);
        }
    };

    return (
        <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={['places']}>
            <div>
                <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
                    <input
                        type="text"
                        placeholder="Type an address"
                        value={inputValue || values[name] || ""}
                        onChange={(e) => setFieldValue(name, e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderColor: error ? 'red' : '#ccc',
                            borderWidth: '1px',
                            borderRadius: '5px'
                        }}
                    />
                </Autocomplete>
                <FormHelperText>{error && 'Please enter location'}</FormHelperText>
            </div>
        </LoadScript>
    );
};

export default GooglePlacesAutocomplete;

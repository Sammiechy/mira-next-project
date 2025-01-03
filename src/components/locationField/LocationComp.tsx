import { googleApi } from '@/config';
import { SEARCH_PLACES } from '@/hooks/queries/queries';
import { useQuery } from '@apollo/client';
import { Autocomplete, FormControl, FormHelperText, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'

const LocationComp = (props: any) => {
  const [location, setLocation] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectOption, setSelectOption] = useState <any>(
    props.defaultValue
      ? { description: props.defaultValue, place_id: '' }
      : null
  );

  const { data, loading, error } = useQuery(SEARCH_PLACES, {
    variables: { input: location },
    skip: !location,
  });

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

  const fetchPlacesDebounced = useCallback(
    debounce((value: string) => {
      setLocation(value);
    }, 3000),
    []
  )

  useEffect(() => {
    setPlaces(data?.searchPlaces);
  }, [data])

  const handleChange = (event: any, value: string) => {
    // setLocation(value);
    fetchPlacesDebounced(value);
  }

  const handleSelection = (event: any, newValue: any) => {
    setSelectOption(newValue || null);
    const data = {
      target: {
        name: newValue.description,
        value: newValue?.place_id || '',
      },
    };
    props.setFieldValue("locationID", data);
  };


  return (
    <div>
      <FormControl fullWidth>
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          getOptionLabel={(option: any) => option.description || ''}
          options={places || []}
          value={selectOption}
          isOptionEqualToValue={(option: any, value: any) => option.id === value?.id}
          onChange={(e, newValue) => handleSelection(e, newValue)}
          onInputChange={handleChange}

          renderInput={(params: any) => (
            <TextField
              {...params}
              name={props.name}
              error={props?.error}
              defaultValue={props.defaultValue?.description || ''}
              helperText={props?.helperText}
              label="Location... "
              slotProps={{
                input: {
                  ...params.InputProps,
                  type: 'search',
                },
              }}
            />
          )}
        />

        <FormHelperText>{props?.touched && props?.errors.locationID}</FormHelperText>
      </FormControl>
    </div>
  )
}

export default LocationComp
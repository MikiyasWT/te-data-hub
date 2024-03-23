import { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';



export const useDebounce = (callback:any, delay:any) => {

    const debouncedCallback = useMemo(
      () =>
        debounce((...args) => {
          callback(...args);
        }, delay),
      [callback, delay]
    );
  
    return debouncedCallback;
  };
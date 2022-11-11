import {useEffect,useState} from 'react'
import { getStorage } from '../utils/storage';

export const useLocalStorage = (storageKey:string, fallbackState:string) => {
  const [value, setValue] = useState(
    getStorage(storageKey) ?? fallbackState
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
};


export default useLocalStorage
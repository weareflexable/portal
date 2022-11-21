import {useEffect,useState} from 'react'
import { getStorage } from '../utils/storage';

export const useLocalStorage = <T>(storageKey:string, fallbackState:T) => {
  const [value, setValue] = useState(()=> 
  {
    const value = getStorage(storageKey)
    if(value !== 'undefined' && value !== '{}' && value !== '[]'){
      console.log(value)
        return JSON.parse(value||'{}') 
    }
    console.log(fallbackState)
    return fallbackState
    }
  ); 
  console.log(value)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
};


export default useLocalStorage

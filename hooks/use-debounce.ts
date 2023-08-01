import { useEffect, useState } from "react";

export const useDebounce = <T>(value:T,delay?:number):T => {
    
    // Holds the most recent value that has been debounced.
    const [debouncedValue,setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // only after 500 ms (or) stopped typing, the debounced value will be set
        const timer = setTimeout(() => setDebouncedValue(value),delay || 500)

        // To avoid potential memory leaks
        return () => {
            clearTimeout(timer)
        }
    },[value,delay])
    
    return debouncedValue
}
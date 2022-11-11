


export const setStorage = (key:string,value:string) =>{
    if(typeof window !== 'undefined'){
        localStorage.setItem(key,value)
    }
}

export const getStorage = (key:string) =>{
    if(typeof window !== 'undefined'){
        return JSON.parse(localStorage.getItem(key)||'')
    }
}
export const deleteStorage = (key:string) =>{
    if(typeof window !== 'undefined'){
        return localStorage.removeItem(key)
    }
}


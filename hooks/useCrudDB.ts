import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {useState} from 'react'
import { useAuthContext } from '../context/AuthContext'


 
// type Item<T> 
type Config={
    fetchUrl: string,
    mutateUrl: string
}

export default function useCrudDB<T>(config:Config,queryId:string){
    const {fetchUrl, mutateUrl} = config
    
    const {paseto} = useAuthContext()
    
    // const [state, setState] = useState<T[]>(initState? initState:[])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<T>()
    

    const fetchData = async(url:string)=>{
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/${url}`,{
            headers:{
                "Authorization": paseto
            }
        })
        return data?.payload;
    }

    const {data, isLoading, isSuccess} = useQuery([queryId],()=>fetchData(fetchUrl))

    // return empty array if req successful and no payload
    const state = data && data
    console.log('from hook',state)

    function closeCreateForm(){
        setShowCreateForm(false)
    }

    function closeEditForm(){
        setShowEditForm(false)
    }

    const createItem = (newItem:T)=>{
        const stateCopy =  [...state]
        stateCopy.push(newItem)
        // setState(stateCopy);
        setShowCreateForm(false);
    }

    function deleteItem (itemId: string){
        const stateCopy = state.slice();
        //@ts-ignore
        const updatedState = stateCopy.filter(state=>state.id !== itemId)
        // setState(updatedState)
    }

    function editItem(updatedItem:T){

        // copy state to avoid mutation
        const stateCopy = state.slice()
        // find index of updated service in old services
        //@ts-ignore
        const itemIndex: number = stateCopy.findIndex(item=>item.id === updatedItem.id)
        // update edited service
        stateCopy[itemIndex]= updatedItem;
        // update service in state
        // setState(stateCopy)
        setShowEditForm(false)
    }


    const selectItemToEdit=(item:T)=>{
        setShowEditForm(true)
        setItemToEdit(item)
    }

    return {
        state, 
        deleteItem, 
        isLoading,
        editItem, 
        createItem, 
        closeCreateForm, 
        openCreateForm: ()=>setShowCreateForm(true),
        closeEditForm,
        openEditForm: ()=>setShowEditForm(true),
        showCreateForm, 
        showEditForm, 
        itemToEdit,
        selectItemToEdit
    }
}
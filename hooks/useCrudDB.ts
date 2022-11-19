import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import {useState} from 'react'
import { useAuthContext } from '../context/AuthContext'
import { ServiceItem, ServicePayload } from '../types/Services'


 
// type Item<T> 
type Config={
    fetchUrl: string,
    mutateUrl: string
}

export default function useCrudDB<T>(config:Config,queryId:string):{
    state:T[],
    deleteItem: (id:string)=>void
    isLoading: boolean,
    editItem: (id:T)=>void,
    createItem: (newItem:any)=>void,
    closeCreateForm: ()=>void,
    openCreateForm: ()=>void,
    closeEditForm: ()=>void,
    openEditForm: ()=>void,
    showCreateForm: boolean,
    showEditForm: boolean,
    itemToEdit: T | undefined,
    selectItemToEdit: (item:T)=>void

}{
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

    const createDataHandler = async(newItem:any)=>{
        console.log('paseto',paseto)
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/${mutateUrl}`,{
            headers:{
                "Authorization": paseto
            },
            body:JSON.stringify(newItem)
        })
        return data
    }

    const createData = useMutation(createDataHandler)
    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData

    console.log(isCreatingData, createdData)
    const {data, isLoading, isSuccess} = useQuery([queryId],()=>fetchData(fetchUrl))


    // return empty array if req successful and no payload
    const state: T[] = data && data

    function closeCreateForm(){
        setShowCreateForm(false)
    }

    function closeEditForm(){
        setShowEditForm(false)
    }

    const createItem = (newItem:T) =>{

        console.log('new item',newItem)
        createData.mutate(newItem)
        // setState(stateCopy);
        // setShowCreateForm(false);
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
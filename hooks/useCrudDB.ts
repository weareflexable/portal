import { useQuery, useMutation,useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {useState} from 'react'
import { useAuthContext } from '../context/AuthContext'
import { ServiceItem, ServicePayload } from '../types/Services'
import {notification} from 'antd'
import utils from '../utils/env'

 
// type Item<T> 
type Config={
    fetchUrl: string,
    mutateUrl: string,
    patchUrl?: string
}

export default function useCrudDB<T>(config:Config,queryKeys:string[]):{
    state:T[],
    deleteItem: (id:string)=>void
    isLoading: boolean,
    editItem: (id:any)=>void,
    isPatchingData: boolean,
    createItem: (newItem:any)=>void,
    closeCreateForm: ()=>void,
    openCreateForm: ()=>void,
    closeEditForm: ()=>void,
    openEditForm: ()=>void,
    isCreatingData: boolean,
    showCreateForm: boolean,
    showEditForm: boolean,
    itemToEdit: T | undefined,
    selectItemToEdit: (item:T)=>void

}{
    const {fetchUrl, mutateUrl, patchUrl} = config
    const {paseto} = useAuthContext()

    const queryClient = useQueryClient()
    
    // const [state, setState] = useState<T[]>(initState? initState:[])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<T>()
    

    const fetchData = async(url:string)=>{
        const {data} = await axios.get(`${utils.NEXT_PUBLIC_NEW_API_URL}${url}`,{
            headers:{
                //@ts-ignore
                "Authorization": paseto
            }
        })
        return data.data;
    }

    const createDataHandler = async(newItem:any)=>{
        console.log('paseto',paseto)
        const {data} = await axios.post(`${utils.NEXT_PUBLIC_NEW_API_URL}${mutateUrl}`, newItem,{
            headers:{
                //@ts-ignore
                "Authorization": paseto
            },
        })
        return data
    }

    const patchDataHandler = async(updatedItem:any)=>{
        const {data} = await axios.put(`${utils.NEXT_PUBLIC_NEW_API_URL}${patchUrl}`,updatedItem,{
            headers:{
                //@ts-ignore
                "Authorization": paseto
            }
        })
        return data
    }

    const patchData = useMutation(patchDataHandler,{
        onSuccess:()=>{

            queryClient.invalidateQueries({queryKey:[...queryKeys]})

            notification['success']({
                message: 'Updated record succesfully!',
              });
            closeEditForm()
        },
        onError:()=>{
            notification['error']({
                message: 'Encountered an error while updating record',
              });
            //show error notification
        }
    })

    const createData = useMutation(createDataHandler,
        {
            onSuccess:()=>{
            // Invalidate query after a new item has been create
            queryClient.invalidateQueries({queryKey:[...queryKeys]})

            // Show success notification
            notification['success']({
                message: 'Created record succesfully',
              });
            closeCreateForm()
        },
        onError:()=>{
            notification['error']({
                message: 'Encountered an error while creating record',
              });
        }
        })
        
    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData
    const {isLoading:isPatchingData, data: patchedData} = patchData

    const {data, isLoading, isSuccess} = useQuery({queryKey:[...queryKeys],queryFn:()=>fetchData(fetchUrl),enabled:paseto !== ''})

    // return empty array if req successful and no payload
    const state: T[] = data && data

    function closeCreateForm(){
        setShowCreateForm(false)
    }

    function closeEditForm(){
        setShowEditForm(false)
    }

    const createItem = (newItem:T) =>{

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
        patchData.mutate(updatedItem)
    }


    const selectItemToEdit=(item:T)=>{
        console.log(item)
        setShowEditForm(true)
        setItemToEdit(item)
    }

    return {
        state, 
        deleteItem, 
        isLoading,
        isCreatingData,
        isPatchingData,
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
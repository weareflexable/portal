import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import {useState} from 'react'
import { useAuthContext } from '../context/AuthContext'
import { ServiceItem, ServicePayload } from '../types/Services'
import {notification} from 'antd'

 
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
    editItem: (id:T)=>void,
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
    
    // const [state, setState] = useState<T[]>(initState? initState:[])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<T>()
    

    const fetchData = async(url:string)=>{
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/${url}`,{
            headers:{
                //@ts-ignore
                "Authorization": JSON.parse(paseto)
            }
        })
        return data?.payload;
    }

    const createDataHandler = async(newItem:any)=>{
        console.log('paseto',paseto)
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/${mutateUrl}`, newItem,{
            headers:{
                //@ts-ignore
                "Authorization": JSON.parse(paseto)
            },
        })
        return data
    }

    const patchDataHandler = async(updatedItem:any)=>{
        const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/${patchUrl}`,updatedItem,{
            headers:{
                //@ts-ignore
                "Authorization": JSON.parse(paseto)
            }
        })
        return data
    }

    const patchData = useMutation(patchDataHandler,{
        onSuccess:()=>{
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
        {onSuccess:()=>{
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

    const {data, isLoading, isSuccess} = useQuery([...queryKeys],()=>fetchData(fetchUrl))


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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import axios from 'axios'
import {useState} from 'react'
import { useAuthContext } from '../context/AuthContext'
import utils from '../utils/env'


export default function useMutateData<T>(url:string){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()

    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<T>()


    

    const createDataHandler = async(newItem:any)=>{
        const {data} = await axios.post(`${utils.NEXT_PUBLIC_NEW_API_URL}/api/v1.0/${url}`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
        onSuccess:()=>{
            // Invalidate query
            queryClient.invalidateQueries({queryKey:['orgs']})
            closeCreateForm()
            notification['success']({
                message: 'Created record succesfully!',
              });
        },
        onError:()=>{
            notification['error']({
                message: 'Encountered an error while creating record',
              });
            // leave modal open
        } 
    })
    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData



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
        //@ts-ignore
        // setState(updatedState)
    }

    function editItem(updatedItem:T){


        // update service in state
        // setState(stateCopy)
        setShowEditForm(false)
    }


    const selectItemToEdit=(item:T)=>{
        setShowEditForm(true)
        setItemToEdit(item)
    }

    return{
        isCreatingData,
        createData,
        createItem,
        editItem,
        showCreateForm,
        showEditForm,
        closeCreateForm,
        closeEditForm,
        openCreateForm: ()=>setShowCreateForm(true),
        openEditForm: ()=>setShowEditForm(true),
        itemToEdit,
        selectItemToEdit
    }
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import axios from 'axios'
import {useState} from 'react'
import { useAuthContext } from '../context/AuthContext'


export default function useMutateData<T>(url:string){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()

    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<T>()


    

    const createDataHandler = async(newItem:any)=>{
        console.log('paseto',paseto)
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/${url}`, newItem,{
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
            notification['success']({
                message: 'Created record succesfully!',
              });
            closeCreateForm()
        },
        onError:()=>{
            notification['error']({
                message: 'Encountered an error while creating record',
              });
            //show modal
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
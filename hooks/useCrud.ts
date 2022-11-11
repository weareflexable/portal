import {useState} from 'react'
import { Org } from '../types/OrganisationTypes';
import { Staff } from '../types/Staff';
import { Venue } from '../types/Venue';


// type Item<T> 

export default function useCrud<T>(){
    const [state, setState] = useState<T[]>([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<T>()

    function closeCreateForm(){
        setShowCreateForm(false)
    }

    function closeEditForm(){
        setShowEditForm(false)
    }

    const createItem = (newItem:T)=>{
        // const stateCopy =  state.slice()
        const stateCopy =  [...state]
        stateCopy.push(newItem)
        setState(stateCopy);
        setShowCreateForm(false);
    }

    function deleteItem (itemId: string){
        const stateCopy = state.slice();
        const updatedState = stateCopy.filter(state=>state.id !== itemId)
        setState(updatedState)
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
        setState(stateCopy)
        setShowEditForm(false)
    }


    const selectItemToEdit=(item:T)=>{
        setShowEditForm(true)
        setItemToEdit(item)
    }

    return {
        state, 
        deleteItem, 
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
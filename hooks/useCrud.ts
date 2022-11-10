import {useState} from 'react'
import { Org } from '../types/OrganisationTypes';
import { Venue } from '../types/Venue';


type Item = Venue

export default function useCrud(){
    const [state, setState] = useState<Item[]>([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<Item>()

    function closeCreateForm(){
        setShowCreateForm(false)
    }


    function closeEditForm(){
        setShowCreateForm(false)
    }

    const createItem = (newItem:Item)=>{
        const stateCopy =  state.slice()
        stateCopy.push(newItem)
        setState(stateCopy);
        setShowCreateForm(false);
    }

    function deleteItem (itemId: string){
        const stateCopy = state.slice();
        const updatedState = stateCopy.filter(state=>state.id !== itemId)
        setState(updatedState)
    }

    const editItem = (updatedItem:Item)=>{

        // copy state to avoid mutation
        const stateCopy = state.slice()
        // find index of updated service in old services
        const itemIndex = stateCopy.findIndex(item=>item.id === updatedItem.id)
        // update edited service
        stateCopy[itemIndex]= updatedItem;
        // update service in state
        setState(stateCopy)
        setShowEditForm(false)
    }


    const selectItemToEdit=(item:Item)=>{
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
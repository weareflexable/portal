import React,{useState} from 'react'
import {Card,Form,Input, InputNumber,Button} from 'antd'
import BillingsForm from '../BillingsForm/BillingsForm'

export default function AccountsView(){

    const [bankDetails, setBankDetails] =  useState({})

    return(
        <BillingsForm/>        
    )
}
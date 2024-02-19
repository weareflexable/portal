
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const {Text,Title} = Typography
const {Option} = Select
import React, { ReactNode, useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Modal, notification, Select} from 'antd'
import axios from 'axios';

import { useAuthContext } from '../../context/AuthContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { Bank } from "./Types/Banks.types";
import { usePlacesWidget } from "react-google-autocomplete";
import useUrlPrefix from '../../hooks/useUrlPrefix'
import { useOrgContext } from "../../context/OrgContext";
import { useRouter } from "next/router";
import useRole from "../../hooks/useRole";




export default function BillingsView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const {currentOrg} = useOrgContext()

    const router = useRouter()

    const [selectedBank, setSelelectedOrg] = useState<any|Bank>({})
    const urlPrefix = useUrlPrefix()


    async function fetchBankAccount(){
        const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank/stripe?orgId=${currentOrg.orgId}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data.data;
    }

    const bankAccountQuery = useQuery({
      queryKey: ['bank','details','admin',currentOrg.id],
      queryFn: fetchBankAccount,
      enabled: paseto !== undefined,
    })


    function connectToStripeOnboarding(){

    }

    console.log(bankAccountQuery.data)


        return (
            <div>
              <div style={{display:'flex', marginTop:'1rem', marginBottom:'1rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                 <Title style={{ margin:'0'}} level={2}>Billings</Title>
             </div>
              <EmptyState>
                <Button disabled={bankAccountQuery.isLoading} type='primary'>{bankAccountQuery.isLoading?'Checking for your account...':'Create Account'}</Button>
              </EmptyState>
            </div>
    )



}









interface EmptyStateProps{
  children: ReactNode
}

function EmptyState({children}:EmptyStateProps){

  return(
    <div style={{border: '1px solid #d6d6d6', marginTop:'2rem', borderRadius:'4px', height:'50vh', display:'flex', justifyContent:'center', alignItems:'center', padding: '2rem'}}>
      <div style={{maxWidth:'350px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <Title level={4}>Create New Account</Title> 
        <Text style={{textAlign:'center'}}>Add an account to get started receiving payouts from your tickets purchases on the marketplace</Text>
        <div style={{marginTop:'1rem', display:'flex',justifyContent:'center'}}>
            {children}
        </div>
      </div>
    </div>
  )
}

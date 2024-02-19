
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
            <main>
              <header style={{display:'flex', flexDirection:'column', marginTop:'1rem', marginBottom:'3rem', width:'100%', }}>
                 <Title style={{ margin:'0'}} level={2}>Payout</Title>
                 <Text>Manage your organizations billing information</Text> 
             </header>
             { bankAccountQuery.isLoading || bankAccountQuery.isRefetching
             ? <Text>Fetching your account...</Text>
             : bankAccountQuery.data.account !== null
             ? <EmptyState>
                <Button disabled={bankAccountQuery.isLoading} type='primary'>{bankAccountQuery.isLoading?'Checking for your account...':'Create Account'}</Button>
              </EmptyState>
              :
              <>
              <section style={{background:'#f1f1f1', maxWidth:'800px', marginBottom:'2rem', padding: '30px 24px', borderRadius:'8px'}}>
                <div style={{display:'flex', marginBottom:'2rem', justifyContent:'space-between'}}>
                  <div>
                    <Title style={{marginBottom:'0'}} level={5}>Schachindra Kumar</Title>
                    <Text >Company Account</Text>  
                  </div>
                  <div>
                    <Text >United States • USD</Text>  
                  </div>
                </div>

                <div style={{display:'flex', marginBottom:'2rem',  justifyContent:'space-between'}}>
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <Text strong>**** **** **** 5647</Text>  
                    <Text type="secondary">Account No</Text>  
                  </div>
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <Text strong>110000490</Text>  
                    <Text type="secondary">Routing No</Text>  
                  </div>
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <Text strong>Checking</Text>  
                    <Text type="secondary">Account Type</Text>  
                  </div>
                </div>

                <div style={{display:'flex', justifyContent:'flex-end'}}>
                  <Button type="link">Edit Card information</Button>
                  <Button type="link" danger>Delete Account</Button>
                </div>
             </section>
             {/* statistics */}
             <article style={{display:'flex', maxWidth:'800px', border:'1px solid #d8d8d8', padding:'1.5rem 2rem', justifyContent:'space-around'}}>
                <div style={{display:'flex', flex:'1', flexDirection:'column'}}>
                  <Text type="secondary">Event Sales</Text>
                  <Text strong style={{fontSize:'2rem'}}>$38</Text> 
                </div>
                <div style={{display:'flex', flex:'1', flexDirection:'column'}}>
                  <Text type="secondary">Community Sales</Text>
                  <Text strong style={{fontSize:'2rem'}}>$68</Text> 
                </div>
                <div style={{display:'flex', flex:'1', flexDirection:'column'}}>
                  <Text type="secondary">Service Sales</Text>
                  <Text strong style={{fontSize:'2rem'}}>$168</Text> 
                </div>
                <div style={{display:'flex', flex:'1', flexDirection:'column'}}>
                  <Text type="secondary">Total Sales</Text>
                  <Text strong style={{fontSize:'2rem'}}>$1,368</Text> 
                </div>
             </article>

              </>
             }
              
            </main>
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

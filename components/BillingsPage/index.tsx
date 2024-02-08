
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const {Text,Title} = Typography
const {Option} = Select
import { SearchOutlined, PlusOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import React, { ReactNode, useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Modal, notification, Select} from 'antd'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../context/AuthContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { Bank } from "./Types/Banks.types";
import { usePlacesWidget } from "react-google-autocomplete";
import useUrlPrefix from '../../hooks/useUrlPrefix'
import { useOrgContext } from "../../context/OrgContext";
import { useRouter } from "next/router";
import { useServicesContext } from "../../context/ServicesContext";
import { EditableCountry, EditableRadio, EditableText } from "../shared/Editables";
import useRole from "../../hooks/useRole";
const {TextArea} = Input

const countryList = require('country-list')


export default function BillingsView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const {currentOrg} = useOrgContext()
    const {isAdmin} = useRole()

    const router = useRouter()

    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)


    type DataIndex = keyof Bank;

    const [selectedBank, setSelelectedOrg] = useState<any|Bank>({})
    const [currentFilter, setCurrentStatus] = useState({id:'1',name: 'Verified'})

    // async function fetchAllBanks(){
    //     const res = await axios({
    //         method:'get',
    //         //@ts-ignore
    //         url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    //         headers:{
    //             "Authorization": paseto
    //         }
    //     })

    //     return res.data;
    // }
    async function fetchBanks(){
        const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank?orgId=${currentOrg.orgId}&pageNumber=${pageNumber}&pageSize=${pageSize}&status=${currentFilter.id}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
    }

    const urlPrefix = useUrlPrefix()

    async function changeStatus({id, statusNumber}:{id:string, statusNumber: string}){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank`,
            data:{
                // key:'status',
                status: statusNumber, // 0 means de-activated in db
                id: id 
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }

    const changeStatusMutation = useMutation(['data'],{
        mutationFn: changeStatus,
        onSuccess:(data:any)=>{
            queryClient.invalidateQueries({queryKey:['banks',currentFilter]})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })

    function deActivateBankHandler(bank:Bank){
        // setSelelectedOrg(org.orgId)
        changeStatusMutation.mutate({id: bank.id, statusNumber:'0'})
    }

    function verifyBankHandler(bank:Bank){
        // setSelelectedOrg(org.orgId)
        changeStatusMutation.mutate({id:bank.id, statusNumber:'1'})
    }
    function rejectBankHandler(bank:Bank){
        // setSelelectedOrg(org.orgId)
        changeStatusMutation.mutate({id:bank.id, statusNumber:'3'})
    }
    function reviewBankHandler(bank:Bank){
        // setSelelectedOrg(org.orgId)
        changeStatusMutation.mutate({id:bank.id, statusNumber:'2'})
    }

    function reActivateBankHandler(bank:Bank){
        changeStatusMutation.mutate({id:bank.id, statusNumber:'1'})
    }

    
      // const allBanksQuery = useQuery({queryKey:['all-banks'], queryFn:fetchAllBanks, enabled:paseto !== '', staleTime:Infinity})
      // const allBanksLength = allBanksQuery.data && allBanksQuery.data.data.length
      
      
      const banksQuery = useQuery({queryKey:['banks', currentFilter], queryFn:fetchBanks, enabled:paseto !== '' })
      const data = banksQuery.data && banksQuery.data.data
      const totalLength = banksQuery.data && banksQuery.data.dataLength;

  
  

    function getCurrentFilterActions(){
        switch(currentFilter.id){
            // 1 = verified
            case '1': return verifiedBankActions 
            break;
            // 2 = unVerified
            case '2': return isAdmin? adminUnVerifiedBankActions: unVerifiedBankActions  
            break;
            // 0 = deActivated
            case '0': return deActivatedBankActions 
            break;
            case '3': return rejectedBankActions 
            default: return verifiedBankActions
        }
    }

    function viewOrgDetails(org:Bank){
      // set state
      setSelelectedOrg(org)
      // opne drawer
      setIsDrawerOpen(true)

    }



  
  
    
      const onMenuClick=(e:any, record:Bank) => {
        const event = e.key
        switch(event){
          case 'deActivate': deActivateBankHandler(record);
          break;
          case 'accept': verifyBankHandler(record)
          break;
          case 'reject': rejectBankHandler(record)
          break;
          case 'review': reviewBankHandler(record)
          break;
          case 'reActivate': reActivateBankHandler(record)
          break;
          case 'viewDetails': viewOrgDetails(record)
        }
      };
      
  
    const columns: ColumnsType<Bank> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        fixed:'left',
        width:'270px',
        ellipsis:true,
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    {/* <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={'/favicon.ico'}/> */}
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text style={{textTransform:'capitalize'}}>{record.bankName}</Text>  
                        <Text style={{textTransform:'capitalize'}} type="secondary">{record.accountType}</Text>
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Account Name',
        dataIndex: 'beneficiaryName',
        key: 'beneficiaryName',
        width:'200px',
      },

      {
        title: 'Account No',
        dataIndex: 'accountNo',
        key: 'accountNo',
        width:'150px'
      },
     
      // {
      //   title: 'Currency',
      //   dataIndex: 'currency',
      //   key: 'currency'
      // },
      {
          title: 'Created On',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width:'120px',
          render: (_,record)=>{
              const date = dayjs(record.createdAt).format('MMM DD, YYYY')
              return(
            <Text type="secondary">{date}</Text>
            )
        },
    },
    {
      dataIndex: 'actions', 
      key: 'actions',
      fixed:'right',
      width: currentFilter.id == '0' ? '120px' : '70px',
      render:(_,record)=>{
        const items = getCurrentFilterActions()
        if(currentFilter.id == '0'){
          return (<Button   onClick={()=>reActivateBankHandler(record)}>Reactivate</Button>)
        }
        return (
        <Dropdown trigger={['click']} menu={{ items , onClick: (e)=>onMenuClick(e,record) }}>
            <Button type='text' icon={<MoreOutlined rev={undefined} />}/>
          </Dropdown>)
      } 
    }
    ];

        return (
            <div>
              <div style={{display:'flex', marginTop:'1rem', marginBottom:'1rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                 <Title style={{ margin:'0'}} level={2}>Billings</Title>
             </div>
              <EmptyState>
                <Button type='primary'>Create Account</Button>
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

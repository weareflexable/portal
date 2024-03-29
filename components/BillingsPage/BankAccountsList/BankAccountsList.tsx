import React from 'react'
import {Card,List,Typography,Button,Avatar, Descriptions} from 'antd'
import {PlusCircleOutlined} from '@ant-design/icons'
import { useRouter } from 'next/router'
import { BankAccount } from '../../../types/BankAccount'
import { useOrgContext } from '../../../context/OrgContext'

const {Title,Text} = Typography


interface BankAccountListProps{
    bankAccounts: Array<any>,
    onCreateBankAccount: ()=>void,
    onSelectBankAccount: (service:BankAccount)=>void,
    onDeleteBankAccount: (itemKey: string)=>void,
    isLoading: boolean,
}

export default function BankAccountListProps({onDeleteBankAccount, isLoading,  onSelectBankAccount, bankAccounts, onCreateBankAccount}:BankAccountListProps){

    const router = useRouter()
    const {isAdmin} = useOrgContext()
 

    return(
        <div style={{display:'flex',flexDirection:'column', width:'100%',padding:'1em'}}>
            <List
            itemLayout="horizontal"
            dataSource={bankAccounts}
            loading={isLoading}
            bordered={false}
            renderItem={(item:BankAccount) => (
            <List.Item 
                style={{border:'none', background:'#f9f9f9',marginBottom:'.5em',padding:'1em', borderRadius:'4px'}}
                actions={[
                <Button 
                    danger 
                    size='small' 
                    disabled={!isAdmin} 
                    type='text' onClick={()=>onDeleteBankAccount(item.id)} 
                    key={item.id}>Delete</Button> , <Button size='small' type='link'  onClick={()=>onSelectBankAccount(item)} key={item.id}>Edit</Button>  
                 ]}
            >
                <List.Item.Meta
                key={item.id}
                title={item.bankName}
                description={
                    <div style={{display:'flex', width:'100%', flexDirection:'column'}}>
                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>Acct No:</Text>
                            <Text>{item.accountNo}</Text>
                        </div>
                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>Address:</Text>
                            <Text>{item.beneficiaryAddress}</Text>
                        </div>
                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>Swift Code:</Text>
                            <Text>{item.swiftCode}</Text>
                        </div>

                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>Routing No:</Text>
                            <Text>{item.routingNumber}</Text>
                        </div>

                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>Account name:</Text>
                            <Text>{item.beneficiaryName}</Text>
                        </div>

                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>Currency:</Text>
                            <Text>{item.currency}</Text>
                        </div>

                    </div> 
                 }
                /> 
            </List.Item>
             )}
             />           
        </div>
    )
}
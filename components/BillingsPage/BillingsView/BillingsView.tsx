import React,{useState} from 'react'
import {Card,Form,Input, Typography,Modal, InputNumber,Space,Button,Row,Col,Statistic} from 'antd'
const {Text} = Typography
import BillingsForm from '../BillingsForm/BillingsForm'

export default function AccountsView(){

    const [bankDetails, setBankDetails] =  useState<FormData[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)


    // TODO: create a CRUD hook
    const addBankDetails = (formData:FormData)=>{
        console.log(formData);
        const clonedBanks = bankDetails.slice();
        clonedBanks.push(formData);
        setBankDetails(clonedBanks)
    }

    const deleteBankDetails = (detailsId: string)=>{
        const clonedBanks = bankDetails.slice();
        const updatedBanks = clonedBanks.filter(bank=>bank.id !== detailsId);
        setBankDetails(updatedBanks)
    }

    return(
        <Space direction='vertical'>
            <Row gutter={16}>
                <Col span={12}>
                <Statistic title="Account Balance (USD)" value={112893} precision={2} />
                <Button disabled={bankDetails?false:true} style={{ marginTop: 16 }} type="primary">
                    Withdraw
                </Button>
                </Col>
            </Row>

            {bankDetails.length<1?<div style={{width:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <Text type='secondary'>You have to register add a bank account before you can withdraw</Text>
                <Button onClick={()=>setIsModalOpen(true)}>Add new bank account</Button>
            </div>: <Accounts openModal={()=>setIsModalOpen(true)}/> }

            <Modal title="Add a bank acount" open={isModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
                <BillingsForm/>        
            </Modal>
        </Space>
        )
    }

    interface AccountsProps{
        openModal: ()=>void
    }

    const Accounts = ({openModal}:AccountsProps)=>{
        return(
            <div>
                <Button onClick={openModal}>Add another bank</Button>
                listing of all bank cards
            </div>
        )
    }
    
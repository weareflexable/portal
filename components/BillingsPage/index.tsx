import React,{useState} from 'react'
import {Card,Form,Input, Typography,Modal, InputNumber,Space,Button,Row,Col,Statistic} from 'antd'
const {Text} = Typography
import BillingsForm from './CreateBankAccountForm/CreateBankAccountForm'
import {PlusCircleOutlined} from '@ant-design/icons'
import { useRouter } from 'next/router'
import { BankAccount } from '../../types/BankAccount'
import BankAccountsList from './BankAccountsList/BankAccountsList'
import EditBankAccountForm from './EditBankAccountForm/EditBankAccountForm'
import CreateBankAccountForm from './CreateBankAccountForm/CreateBankAccountForm'
import useCrudDB from '../../hooks/useCrudDB'
import { useOrgContext } from '../../context/OrgContext'

const mockBankAcounts: BankAccount[] = [
{
    id: '847847fdafdkvndaf2',
    beneficiaryName: 'Benjamin On Franklin',
    beneficiaryAddress: 'Syracuse new york',
    beneficiaryPhoneNumber: '+124574638',
    accountNo: 3748473833,
    bankName: 'Silver stone crest bank',
    swiftCode: '4875784738',
    routingNumber: 4959450837,
    currency:'USD',
    bankAddress:'West park, Bacon Hill syracuse NY'
}
]
    


export default function BillingsView(){

    const {back} = useRouter()
    const {currentOrg} = useOrgContext()

    const hookConfig = {
        mutateUrl:'/manager/org/bank',
        fetchUrl: `/manager/org/bank?key=org_id&value=${currentOrg.orgId}&pageNumber=0&pageSize=3`,
        patchUrl:`/manager/org/bank`
    }

    const {
         state,
         showCreateForm, 
         openCreateForm,
         showEditForm,
         itemToEdit,
         selectItemToEdit,
         isPatchingData,
         isLoading,
         isCreatingData,
         createItem,
         editItem,
         deleteItem,
         closeCreateForm,
         closeEditForm
        } = useCrudDB<BankAccount>(hookConfig,['banks'])


    return(
        <div >
            {/* <Row gutter={16}>
                <Col span={12}>
                <Statistic title="Account Balance (USD)" value={112893} precision={2} />
                <Button disabled={bankDetails?false:true} style={{ marginTop: 16 }} type="primary">
                    Withdraw
                </Button>
                </Col>
            </Row> */}


            <Button type='link'  style={{display:'flex', alignItems:'center'}} icon={<PlusCircleOutlined />} onClick={openCreateForm}>Add new bank account</Button>
             <BankAccountsList
                bankAccounts={state}
                onCreateBankAccount={openCreateForm}
                onDeleteBankAccount={deleteItem}
                onSelectBankAccount={selectItemToEdit}
                isLoading={isLoading}
            />
            

             <Modal title="Create new bank acount" open={showCreateForm} footer={null} onCancel={closeCreateForm}>
                 <CreateBankAccountForm
                    onCreateBankAccount={createItem}
                    isCreatingData={isCreatingData}
                />        
            </Modal>

             <Modal title="Edit bank account" open={showEditForm} footer={null} onCancel={closeEditForm}>
                 <EditBankAccountForm
                    onCloseEditForm={closeEditForm}
                    onEditBankAccount={editItem}
                    initValues={itemToEdit}
                    isPatchingData={isPatchingData}
                />        
            </Modal>
        </div>
        )
    }
    
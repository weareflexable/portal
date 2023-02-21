
import {useEffect, useState} from 'react'
import type { NextPage } from 'next'

import { Button,Typography,Modal, Row, Layout, Col, Skeleton} from 'antd';

const {Title} = Typography; 
import { useAuthContext } from '../../context/AuthContext';
import {OrgFormData } from '../../types/OrganisationTypes';
import { nftStorageClient } from '../../utils/nftStorage';
import RegisterOrgForm from '../../components/LoungePage/RegisterOrgForm/RegisterOrgForm';
import {PlusCircleOutlined,PlusOutlined} from '@ant-design/icons'
import dynamic from 'next/dynamic';
import useMutateData from '../../hooks/useMutateData';
import { useRouter } from 'next/router';
import { Content } from 'antd/lib/layout/layout';
import CurrentUser from '../../components/Header/CurrentUser/CurrentUser';

const DynamicOrgs = dynamic(()=>import('../../components/OrganizationsPage/OrganizationList/OrganizationView'),{
    ssr:false,
})


const Organizations: NextPage = () => {

    const [isHydrated, setIsHydrated] = useState(false)    

    const {logout} = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        setIsHydrated(true)
    }, [])


    return(
        <>
       
                <Row style={{background: '#ffffff'}}>
                    <Col offset={1} span={22}>
                        <div style={{display:'flex', padding:'1rem 0', justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                            <Title style={{margin:'0'}} level={3}>Welcome to the lounge</Title>
                            {isHydrated?<CurrentUser/>: <Skeleton.Input active={true} size={'default'} />}
                        </div>
                    </Col>
                </Row>
            
            <Row style={{background: '#f4f4f4',height:'100%',minHeight:'100vh'}}>
                <Col offset={1} span={22}>
                    <div style={{width:'100%', display:'flex', marginTop:'2rem', marginBottom:'2rem', justifyContent:'space-between', alignItems:'center'}}>
                        <Title style={{margin:'0'}} level={2}>My Organizations</Title>
                        
                    </div>
                    <Content 
                        style={{
                        width:`98%`,
                        maxWidth:'100%', 
                        }}
                    > 
                        <DynamicOrgs/>
                    </Content>
                </Col>
            </Row>


            
        {/* </div> */}
        </>
    )
}


export default Organizations



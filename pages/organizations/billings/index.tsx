import { Content } from 'antd/lib/layout/layout'
import { Typography, Row, Button, Col } from 'antd'
const {Title} = Typography
import {ArrowLeftOutlined} from '@ant-design/icons'
import React from 'react'
import BillingsView from '../../../components/BillingsPage'
import AppLayout from '../../../components/shared/Layout/layout'
import { useRouter } from 'next/router'
import ServiceLayout from '../../../components/shared/Layout/ServiceLayout'

export default function Billings(){

    const router = useRouter()
    
    return(
        <div style={{background:'#f6f6f6', height:'100%', minHeight:'100vh'}}>
           
         <BillingsView/>
    </div>
    )
}

Billings.PageLayout = ServiceLayout

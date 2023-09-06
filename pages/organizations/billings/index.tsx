import { Content } from 'antd/lib/layout/layout'
import { Typography, Row, Button, Col } from 'antd'
const {Title} = Typography
import {ArrowLeftOutlined} from '@ant-design/icons'
import React from 'react'
import BillingsView from '../../../components/BillingsPage'
import AppLayout from '../../../components/Layout/layout'
import { useRouter } from 'next/router'
import ServiceLayout from '../../../components/Layout/ServiceLayout'
import BillingsLayout from '../../../components/Layout/BillingsLayout'

export default function Billings(){

    const router = useRouter()
    
    return(
        <div style={{background:'#f6f6f6', height:'100%', minHeight:'60vh'}}>
         <BillingsView/>
    </div>
    )
}

Billings.PageLayout = BillingsLayout

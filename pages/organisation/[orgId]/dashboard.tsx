import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import AppLayout from '../../../components/shared/Layout/layout'
import { useAuthContext } from '../../../context/AuthContext'

export default function Dashboard(){


    return(
        <AppLayout>

        <Content
            style={{
              padding: '1em',
              margin:'1em',
              background:'white' ,
              width:`98%`,
              maxWidth:'100%',
              height: '100%',
              minHeight:'100vh',
            }}
          >
             <div>Dashboard will be here</div> 
          </Content>
        </AppLayout>
    )
}
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
  import { Layout, Menu } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import StoreForm from '../../components/DashboardPage/StoreForm/StoreForm';
  import StoreView from '../../components/DashboardPage/StoreView/StoreView'
  
  const { Header, Sider, Content } = Layout;
  
  const Dashboard: React.FC = () => {
    
    const [collapsed, setCollapsed] = useState(false); 
  
    return (
      <Layout style={{minHeight:'100vh'}} className=' h-full'>
        <Sider collapsible collapsed={collapsed}>
          <div className="h-6 m-5" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['store']}
            items={[
              {
                key: 'store',
                icon: <UserOutlined />,
                label: 'Store',
              },
              {
                key: 'staff',
                icon: <VideoCameraOutlined />,
                label: 'Organisation staff',
              },
              {
                key: 'profile',
                icon: <UploadOutlined />,
                label: 'Profile',
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header style={{background:'white'}}>
            <MenuFoldOutlined className='lg:text-2xl' onClick={() => setCollapsed(!collapsed)}/>
          </Header>
          <Content
            className="bg-white p-6 my-7 mx-7 "
            style={{
              minHeight: 280,
              width: 800 
            }}
          >
            
            <StoreView/>
          </Content>
        </Layout>
      </Layout>
    );
  };

export default Dashboard
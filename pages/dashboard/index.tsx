import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
  import { Layout, Menu, Typography ,Button} from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import StaffView from '../../components/DashboardPage/StaffView/StaffView';
import StoreForm from '../../components/DashboardPage/StoreForm/StoreForm';
import StoreView from '../../components/DashboardPage/StoreView/StoreView'

const {Text} = Typography;
const { Header, Sider, Content } = Layout;
  
  const Dashboard: React.FC = () => {
    
    const [collapsed, setCollapsed] = useState(false); 
    const [path, setPath] = useState('store')

    const router = useRouter()
    const currentPath = router.asPath.split("/")
    console.log(currentPath)

    let contentRender = <StoreView/>
    if(path === 'staff'){
      contentRender = <StaffView/>
    }
    
  
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
                label: <Button type='link' onClick={()=>setPath('store')} href='#store'>Store</Button> ,
              },
              {
                key: 'staff',
                icon: <VideoCameraOutlined />,
                label: <Button type='link' onClick={()=>setPath('staff')} href='#staff'>Staff</Button>,
              },
              {
                key: 'profile',
                icon: <UploadOutlined />,
                label: <Button type='link' href='#profile'>Profile</Button>,
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
            
            {contentRender}
          </Content>
        </Layout>
      </Layout>
    );
  };

export default Dashboard
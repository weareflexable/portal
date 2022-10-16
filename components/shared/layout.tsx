import {

    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
  import {  Menu, Breadcrumb, Typography ,Button, Layout} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import CurrentUser from '../Header/CurrentUser/CurrentUser';
import OrgSwitcher from '../Header/OrgSwitcher/OrgSwitcher';


const { Header, Sider, Content } = Layout;

  interface LayoutProps{
    children: ReactNode
  }
  const AppLayout: React.FC<LayoutProps> = ({children}) => {
    
    const [collapsed, setCollapsed] = useState(false); 
    const {asPath} = useRouter()  
    const currentRouterString = asPath.split('/')[1]
  
    return (
      <Layout style={{minHeight:'100vh'}} className=' h-full'>
        <Sider collapsible onCollapse={() => setCollapsed(!collapsed)} collapsed={collapsed} >
          <div className="h-6 m-5" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[currentRouterString]}
            items={[
              {
                key: 'dashboard',
                icon: <UserOutlined />,
                label: <Link type='link' href='/dashboard'>Dashboard</Link> ,
              },
              {
                key: 'stores',
                icon: <UserOutlined />,
                label: <Link type='link' href='/stores'>Stores</Link> ,
              },
              {
                key: 'staffs',
                icon: <VideoCameraOutlined />,
                label: <Link type='link' href='/staffs'>Staffs</Link> ,
              }
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header style={{lineHeight:'1.4',background:'white', width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
            {/* <div style={{ display:'flex', alignSelf:'flex-end'}}> */}
              <OrgSwitcher org='Avery Juice Bar'/>
              <CurrentUser user={{email:'mbappai@yahoo.com',role:'admin'}}/>
            {/* </div> */}
          </Header> 
          <Breadcrumb style={{ margin: '16px 2em' }}>
            <Breadcrumb.Item>Stores</Breadcrumb.Item>
            <Breadcrumb.Item>Bills restaurant</Breadcrumb.Item>
          </Breadcrumb>

          <Content
            className="bg-white p-6 my-7 mx-7 "
            style={{
              minHeight: 280,
              width: 800 
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  };

export default AppLayout
import {

    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
  import {  Menu, Breadcrumb, Typography ,Button, Layout} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import CurrentUser from '../../Header/CurrentUser/CurrentUser';
import OrgSwitcher from '../../Header/OrgSwitcher/OrgSwitcher';
import UnAuthenticatedView from '../UnAuthenticated/UnAuthenticatedView';


const { Header, Sider, Content } = Layout;

  interface LayoutProps{
    children: ReactNode
  }
  const AppLayout: React.FC<LayoutProps> = ({children}) => {
    
    const [collapsed, setCollapsed] = useState(false); 
    const {asPath} = useRouter()  
    const {isAuthenticated,setIsAuthenticated} = useAuthContext()
    
    const splittedRoutes = asPath.split('/')

  
    return (
      <Layout style={{minHeight:'100vh'}} className=' h-full'>
        <Sider collapsible onCollapse={() => setCollapsed(!collapsed)} collapsed={collapsed} >
          <div className="h-6 m-5" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[splittedRoutes[1]]}
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
              },
              {
                key: 'organisation',
                icon: <VideoCameraOutlined />,
                label: <Link type='link' href='/organisation'>Organisation</Link> ,
              }
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header style={{lineHeight:'1.4',background:'white', width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
            {
              !isAuthenticated ? <Button onClick={()=>setIsAuthenticated(true)}>Login</Button>
              :(
                <>
                  <OrgSwitcher org='Avery Juice Bar'/>
                  <CurrentUser user={{email:'mbappai@yahoo.com',role:'admin'}}/>
                </>
                )
            }

          </Header> 

          {/* <Breadcrumb style={{ margin: '16px 2em' }}>
            <Breadcrumb.Item>Stores</Breadcrumb.Item>
          </Breadcrumb> */}

          <Content
            className="bg-white p-6 my-7 mx-7 "
            style={{
              width: 800,
              margin: '0 1em 0',
              height: '100%',
              minHeight:'100vh'
            }}
          >
            {isAuthenticated? children : <UnAuthenticatedView/>}
          </Content>
        </Layout>
      </Layout>
    );
  };

export default AppLayout
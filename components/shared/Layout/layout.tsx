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
    children: ReactNode,
    width?: number
  }
  const AppLayout: React.FC<LayoutProps> = ({children,width=80}) => {
    
    const [collapsed, setCollapsed] = useState(false); 
    const {asPath,basePath} = useRouter()  
    const {isAuthenticated,setIsAuthenticated} = useAuthContext()
    
    console.log(asPath)
    const splittedRoutes = asPath.split('/')
    const orgId = splittedRoutes[2]
 
  
    return (
      <Layout style={{minHeight:'100vh'}} className=' h-full'>
        <Sider collapsible onCollapse={() => setCollapsed(!collapsed)} collapsed={collapsed} >
          <div className="h-6 m-5" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[splittedRoutes[3]]}
            items={[
              {
                key: 'dashboard',
                icon: <UserOutlined />,
                label: <Link type='link' href={`/organisation/${orgId}/dashboard`}>Dashboard</Link> ,
              },
              {
                key: 'bookings',
                icon: <VideoCameraOutlined />,
                label: <Link type='link' href={`/organisation/${orgId}/bookings`}>Bookings</Link> ,
              },
              {
                key: 'venues',
                icon: <UserOutlined />,
                label: <Link type='link' href={`/organisation/${orgId}/venues`}>Services</Link> ,
              },
              {
                key: 'staffs',
                icon: <VideoCameraOutlined />,
                label: <Link type='link' href={`/organisation/${splittedRoutes[2]}/staffs`}>Staff</Link> ,
              },
              {
                key: 'billing',
                icon: <VideoCameraOutlined />,
                label: <Link type='link' href={`/organisation/${orgId}/billings`}>Billings</Link> ,
              }
            ]}
          />
        </Sider>
        <Layout style={{width:'50%'}} className="site-layout">
          <Header style={{lineHeight:'1.4',background:'white', width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
            {
              !isAuthenticated ? <Button onClick={()=>setIsAuthenticated(true)}>Login</Button>
              :(
                <>
                  <OrgSwitcher orgId='#645372ab3' org='Avery Juice Bar'/>
                  <CurrentUser user={{email:'mbappai@yahoo.com',role:'admin'}}/>
                </>
                )
            }

          </Header> 

          {/* <Breadcrumb style={{ margin: '16px 2em' }}>
            <Breadcrumb.Item>Stores</Breadcrumb.Item>
          </Breadcrumb> */}

          <Content
            style={{
              padding: '1em',
              margin:'1em',
              background:'white' ,
              width:`${`${width}%`}`,
              maxWidth:'100%',
              height: '100%',
              minHeight:'100vh',
            }}
          >
            {isAuthenticated? children : <UnAuthenticatedView/>}
          </Content>
        </Layout>
      </Layout>
    );
  };

export default AppLayout
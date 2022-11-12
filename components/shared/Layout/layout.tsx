import {

    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
  import {  Menu, Breadcrumb, Typography ,Button, Layout, MenuProps} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import CurrentUser from '../../Header/CurrentUser/CurrentUser';
import OrgSwitcher from '../../Header/OrgSwitcherButton/OrgSwitcherButton';
import OrgSwitcherModal from '../OrgSwitcherModal/OrgSwitcherModal';
import UnAuthenticatedView from '../UnAuthenticated/UnAuthenticatedView';



const { Header, Sider, Content } = Layout;

  interface LayoutProps{
    children: ReactNode,
    width?: number
  }

  const items1: MenuProps['items'] = ['1', '2', '3'].map(key => ({
    key,
    label: `nav ${key}`,
  }));
  
  const AppLayout: React.FC<LayoutProps> = ({children,width=80}) => {
    
    const [collapsed, setCollapsed] = useState(false); 
    const {asPath,basePath} = useRouter()  
    const {isAuthenticated,setIsAuthenticated} = useAuthContext()
    const [showSwitcherModal, setSwitcherModal] = useState(false) 
    
    console.log(asPath)
    const splittedRoutes = asPath.split('/')
    const orgId = splittedRoutes[2]

  
    return (

      <Layout style={{minHeight:'100vh'}} className=' h-full'>
        <OrgSwitcherModal
          isModalOpen={showSwitcherModal}
          onCloseModal={()=>setSwitcherModal(!showSwitcherModal)}
        />

              <Header style={{lineHeight:'1.4',background:'white', width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <Menu
                style={{height:'100%',display:'flex', flex:'3'}}
                  theme="light"
                  mode="horizontal"
                  defaultSelectedKeys={[splittedRoutes[3]]}
                  items={[
                    {
                      key: 'dashboard',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link style={{border: '1px solid'}} type='link' href={`/organisation/${orgId}/dashboard`}>Dashboard</Link> </div> ,
                    },
                    {
                      key: 'bookings',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link type='link' href={`/organisation/${orgId}/bookings`}>Bookings</Link> </div> ,
                    },
                    {
                      key: 'services',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link type='link' href={`/organisation/${orgId}/services`}>Services</Link> </div> ,
                    },
                    {
                      key: 'staff',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link type='link' href={`/organisation/${splittedRoutes[2]}/staff`}>Staff</Link> </div> ,
                    },
                  ]}
                />
                {
                  !isAuthenticated ? <Button onClick={()=>setIsAuthenticated(true)}>Login</Button>
                  :(
                    <div style={{display:'flex',flex:'2'}}>
                      <OrgSwitcher onOpenSwitcher={()=>setSwitcherModal(!showSwitcherModal)}/>
                      <CurrentUser user={{email:'mbappai@yahoo.com',role:'admin'}}/>
                    </div>
                    )
                }
    
              </Header> 
        <Layout style={{width:'100%'}} className="site-layout">
        {/* <Sider collapsible onCollapse={() => setCollapsed(!collapsed)} collapsed={collapsed} >
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[splittedRoutes[3]]}
            items={[
              {
                key: 'venues',
                icon: <UserOutlined />,
                label: <Link type='link' href={`/organisation/${orgId}/venues`}>Services</Link> ,
              },
              {
                key: 'staff',
                icon: <VideoCameraOutlined />,
                label: <Link type='link' href={`/organisation/${splittedRoutes[2]}/staff`}>Staff</Link> ,
              },
              {
                key: 'billing',
                icon: <VideoCameraOutlined />,
                label: <Link type='link' href={`/organisation/${orgId}/billings`}>Billings</Link> ,
              }
            ]}
          />
        </Sider> */}

            {isAuthenticated? children : <UnAuthenticatedView/>}
        </Layout>
      </Layout>
    );
  };

export default AppLayout
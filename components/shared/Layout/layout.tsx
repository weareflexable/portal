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
import ServicesSwitcherModal from '../ServicesSwitcherModal/ServicesSwitcherModal';
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
    const {asPath} = useRouter()  
    const {isAuthenticated,setIsAuthenticated} = useAuthContext()
    const [showSwitcherModal, setSwitcherModal] = useState(false) 
    
    console.log(asPath)
    const splittedRoutes = asPath.split('/')
    const selectedRoute = splittedRoutes[5]
    splittedRoutes.pop()
    const basePath = splittedRoutes.join('/')
  
    return (

      <Layout style={{minHeight:'100vh',height:'100%'}}>
        {/* <OrgSwitcherModal
          isModalOpen={showSwitcherModal}
          onCloseModal={()=>setSwitcherModal(!showSwitcherModal)}
        /> */}
        <ServicesSwitcherModal
          isModalOpen={showSwitcherModal}
          onCloseModal={()=>setSwitcherModal(!showSwitcherModal)}
        />

              <Header style={{lineHeight:'1.4',background:'white', width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <Menu
                style={{height:'100%',display:'flex', flex:'3'}}
                  theme="light"
                  mode="horizontal"
                  defaultSelectedKeys={[selectedRoute]}
                  items={[
                    {
                      key: 'dashboard',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link style={{border: '1px solid'}} type='link' href={`${basePath}/dashboard`}>Dashboard</Link> </div> ,
                    },
                    {
                      key: 'bookings',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link type='link' href={`${basePath}/bookings`}>Bookings</Link> </div> ,
                    },
                    {
                      key: 'serviceItems',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link type='link' href={`${basePath}/serviceItems`}>Service Items</Link> </div> ,
                    },
                    {
                      key: 'staff',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link type='link' href={`${basePath}/staff`}>Staff</Link> </div> ,
                    },
                    {
                      key: 'billings',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link type='link' href={`${basePath}/billings`}>Billings</Link> </div> ,
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
              <Layout style={{width:'100%',height:'100%'}}>
                  {isAuthenticated? children : <UnAuthenticatedView/>}
              </Layout>
      </Layout>
    );
  };

export default AppLayout
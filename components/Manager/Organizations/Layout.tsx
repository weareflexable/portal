import { Layout, Menu,Typography } from "antd";
import { useRouter } from "next/router";
const {Text} = Typography;
const {Content, Sider} = Layout
import { ReactNode, useEffect, useState } from "react";


interface Props{
    children: ReactNode
}
export default function ManagerOrgsLayout({children}:Props){

    const router = useRouter()
    const [pageRoutes, setPageRoutes] = useState({basePath:'',selectedRoute:'dashboard'})

    const splittedRoutes = router.asPath.split('/')
    console.log(splittedRoutes)
    const selectedRoute = splittedRoutes && splittedRoutes[3]
    splittedRoutes.pop()

    // useEffect(() => {
    //     if(router.isReady){
    //       const basePath =splittedRoutes.join('/')
    //         setPageRoutes({
    //           basePath:basePath,
    //           selectedRoute:selectedRoute,
    //         })
    //       }
    //   }, [router.isReady])
    

    function navigateToSubPage(pageRoute:string){
        router.push(`/manager/organizations/${pageRoute}`)
    }

    const navItems = [
        {
            key:'approved',
            label: <Text onClick={()=>navigateToSubPage('approved')}>Approved</Text> 
            // label: 'Approved' 
        },
        {
            key:'inReview',
            label: <Text onClick={()=>navigateToSubPage('inReview')}>In Review</Text>
        },
        {
            key:'denied',
            label: <Text onClick={()=>navigateToSubPage('denied')}>Denied</Text>
        },
        {
            key:'deActivated',
            label: <Text onClick={()=>navigateToSubPage('deActivated')}>De-activated</Text>
        },
    ]

    return(
        <Layout style={{ background: "#ffffff"}}>
        <Sider style={{ background: "#ffffff" }} width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[selectedRoute]}
            style={{ height: '100%', margin:0 }}
            items={navItems}
          />
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
            {children}
        </Content>
      </Layout>
    )
}
import { Layout, Menu,Typography } from "antd";
import { useRouter } from "next/router";
const {Text} = Typography;
const {Content, Sider} = Layout
import { ReactNode } from "react";


interface Props{
    children: ReactNode
}
export default function ManagerOrgsLayout({children}:Props){

    const router = useRouter()

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
            defaultSelectedKeys={['approved']}
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
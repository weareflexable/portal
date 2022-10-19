import React,{useState} from 'react';
import {Typography,Space,Dropdown, MenuProps,Menu} from 'antd'
import {DownOutlined} from '@ant-design/icons'
const {Text,Title,Paragraph} = Typography;


interface OrgSwitcherProps{
    org: string,
    orgId: string
}

const menuArray = [
    {
      label: 'Conura org',
      key: '1',
    },
    {
      label: 'Mike banas inc',
      key: '2',
    },
  ];

export default function OrgSwitcher({org='Avery Juice',orgId='#3243257543'}:OrgSwitcherProps){

    // const [currentOrg,setCurrentOrg] = useState(org)

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {

        const key=  e.target
        console.log(e.target)
      };
      
      const handleMenuClick: MenuProps['onClick'] = e => {
        console.log('click', e);
      };

const menu = (
    <Menu
      onClick={handleMenuClick}
      items={menuArray}
    />
  );

    
    return (
            <Dropdown trigger={['click']} overlay={menu}>
              <Space>
                <div style={{display:'flex',flexDirection:'column'}}>
                  <Text style={{marginBottom:0}}>{org}</Text>
                  <Paragraph type='secondary'>{orgId}</Paragraph>
                </div>
                <DownOutlined/>
              </Space>
            </Dropdown>
          )
}

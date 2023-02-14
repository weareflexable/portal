import { Button, Tabs} from "antd";
import type { TabsProps } from 'antd';
import { useState } from "react";

export default function PlatformView(){

    const [currentTab, setCurrentTab] = useState("1") 

    const items: TabsProps['items'] = [
        {
          key: '1',
          label: `Service types`,
          children: <ServiceTypesView/>,
        },
        {
          key: '2',
          label: `Service-item types`,
          children: <ServiceItemTypesView/>,
        },
      ];

    function onChangeTab(key:string){
        setCurrentTab(key)
        console.log(key)
    }

    return(
        <Tabs defaultActiveKey={currentTab} items={items} onChange={onChangeTab} />
        )
    }
    
    
    
    
function ServiceTypesView(){
        console.log('rendering servicetypes')
        return(
            <div>
            List of service types and actions
            <Button>Create new service type</Button>
        </div>
    )
}

function ServiceItemTypesView(){
    console.log('rendering serviceItemtypes')
    return(
        <div>
            List of service item types and actions
            <Button>Create new service type</Button>
        </div>
    )
}
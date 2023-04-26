import { Button } from "antd"
import ServiceLayout from "../../../components/shared/Layout/ServiceLayout"



function Communities(){
    return(
        <div style={{background:'#f7f7f7', minHeight:'100vh'}}>
            <Button>Click me</Button>
        </div>
    )
}

Communities.PageLayout = ServiceLayout

export default Communities
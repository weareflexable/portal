import { Card, Statistic } from "antd";


export default function ServiceStats(){
    return(
        <Card>
        <Statistic
          title="Total services"
          value={0}
        />
      </Card>
    )
}
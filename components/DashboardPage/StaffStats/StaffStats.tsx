import { Card, Statistic } from "antd";


export default function StaffStats(){
    return(
        <Card>
        <Statistic
          title="Total staff"
          value={0}
        />
      </Card>
    )
}
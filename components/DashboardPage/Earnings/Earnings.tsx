import { Card, Statistic } from "antd";
import { Area } from '@ant-design/plots';


export default function Earnings(){

    const data = [
            {
              "timePeriod": "2006 Q3",
              "value": 1
            },
            {
              "timePeriod": "2006 Q4",
              "value": 1.08
            },
            {
              "timePeriod": "2007 Q1",
              "value": 1.17
            },
            {
              "timePeriod": "2007 Q2",
              "value": 1.26
            },
            {
              "timePeriod": "2007 Q3",
              "value": 1.34
            },
    ]

    const config = {
        data,
        xField: 'timePeriod',
        yField: 'value',
        xAxis: {
          range: [0, 1, 2, 3, 4, 5],
        },
      };


    return(
    <Card>
        <Statistic
          title="Total earnings"
          value={0.00}
          precision={2}
          prefix="$"
        /> 
        <Area height={500} {...config} />
    </Card>
    )
}
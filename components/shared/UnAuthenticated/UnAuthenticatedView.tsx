import * as React from 'react';
import {Button, Result} from 'antd'

export default function UnAuthenticatedView(){
    return(
    <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page. Check back after you authenticated"
        extra={<Button type="primary">Proceed to login</Button>}
     />
    )
}
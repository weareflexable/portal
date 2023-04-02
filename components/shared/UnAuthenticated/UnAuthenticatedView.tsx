import * as React from 'react';
import {Button, Result} from 'antd'

export default function UnAuthenticatedView(){

    const handleLogin=()=>{
        location.href=`${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to=portal`
    }

    return(
    <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page. Check back after you authenticated"
        extra={<Button onClick={handleLogin} type="primary">Proceed to login</Button>}
     />
    )
}
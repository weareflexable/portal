import React from 'react'
import dynamic from 'next/dynamic'
import ServiceLayout from '../../../components/shared/Layout/ServiceLayout'

const DynamicServices = dynamic(()=>import('../../../components/ServicesPage/ServicesView/ServicesView'),{
    ssr:false
})

 function Services(){

    return( 
        <DynamicServices/>
    )
}


Services.PageLayout = ServiceLayout 

export default Services
import React from 'react'
import dynamic from 'next/dynamic'

const DynamicServices = dynamic(()=>import('../../../components/ServicesPage/ServicesView/ServicesView'),{
    ssr:false
})

export default function Services(){

    return( 
            <DynamicServices/>
    )
}

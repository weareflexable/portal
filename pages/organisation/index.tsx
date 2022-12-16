import React from 'react'
import dynamic from 'next/dynamic'
import ServicesView from '../../components/ServicesPage/ServicesView/ServicesView'

const DynamicServices = dynamic(()=>import('../../components/ServicesPage/ServicesView/ServicesView'),{
    ssr:false
})

export default function Services(){

    return( 
            <DynamicServices/>
            // <ServicesView/>
    )
}
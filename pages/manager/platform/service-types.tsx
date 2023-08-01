import { Button, Col, Row, Layout, Typography, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
const {Title} = Typography
const {Content} = Layout
import ServiceTypesView from "../../../components/Manager/Platform/serviceTypesView";
import ManagerLayout from "../../../components/Layout/ManagerLayout";
import PlatformLayout from "../../../components/Layout/PlatformLayout";

export default function Platform(){
    return(
   
                        <ServiceTypesView/>
          

    )
}

Platform.PageLayout = PlatformLayout


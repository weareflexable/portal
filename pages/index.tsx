import {useState} from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import RegisterOrgForm from '../components/Accounts/RegisterOrgForm/RegisterOrgForm';
import LoginForm from '../components/Accounts/LoginForm/LoginForm';
import { useRouter } from 'next/router';

const Home: NextPage = () => {

  const {asPath} = useRouter()
  const currentPath = asPath.split('/')

  const [formType, setFormType] = useState(currentPath[1])

  const showRegisterForm = () =>{
    setFormType('#registerOrganisation')
  }

  const showLoginForm = () =>{
    setFormType('#login')
  }

  return (
    <div className='flex w-full h-full justify-center items-center' >
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      { formType === '#registerOrganisation'?<RegisterOrgForm toLoginForm={showLoginForm}/>:<LoginForm toRegisterOrg={showRegisterForm}/>}

    </div>
  )
}

export default Home

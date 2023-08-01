import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContextProvider } from '../context/AuthContext';
import { QueryCache, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { OrgContextProvider } from '../context/OrgContext';
import { ServicesContextProvider } from '../context/ServicesContext';
import ErrorBoundary from '../components/shared/ErrorBoundary/ErrorBoundary';
import Head from 'next/head'
import { ComponentType, ReactNode } from 'react';

type ComponentWithPageLayout = AppProps & {
  Component: AppProps['Component'] & {
    PageLayout?: ComponentType
  }
}

function MyApp({ Component, pageProps }: ComponentWithPageLayout) {


  const queryClient = new QueryClient({
 
  })


  

  return (
    <>
    <Head>
        <title> Portal | Flexable</title>
        {/* <meta name="description" content="Flexable login" /> */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        {/* <link rel="manifest" href="/site.webmanifest"/> */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#9f00a7"/>
        <meta name="theme-color" content="#ffffff"/>
    </Head>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <OrgContextProvider>
            <ServicesContextProvider>
              <ErrorBoundary name='entire app'>
                {/* <ConfigProvider theme={{token:{}}}> */}
                {Component.PageLayout?
                //  @ts-ignore
                  <Component.PageLayout>
                    <Component {...pageProps} />
                  </Component.PageLayout>
                : <Component {...pageProps} />
                   
              }
                {/* </ConfigProvider> */}
              </ErrorBoundary>
            </ServicesContextProvider>
        </OrgContextProvider>
      </AuthContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </>
  )
}

export default MyApp

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'
// import { SessionProvider } from 'next-auth/react'
import store from '../reducers/settings'

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <Provider store={store}>
      {/* <SessionProvider session={session}> */}
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      {/* </SessionProvider> */}
    </Provider>
  )
}

export default MyApp

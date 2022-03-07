import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'

const ChatApp: NextPage = ({ refreshToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const { route } = router.query;
    if (!route || (Array.isArray(route) && route[0] !== "channels" && route[0] !== "@me")) {
        return <>Error</>
    } else if (route[0] === "@me") {
        
    } else if (route[0] === "channels") {

    } else {
        // shouldn't reach here
        return <>Unexpected</>
    }
    return (
        <>
            {JSON.stringify(route)}
            {"\nCookies: \n"}
            {refreshToken}
        </>
    )
}

export default ChatApp;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    if (!ctx.req.cookies._rftcp) {
        return {
            redirect: {
                destination: '/chat/login',
                permanent: false
            }
        }
    }
    return {
      props: {
        refreshToken: ctx.req.cookies._rftcp
      }
    }
}
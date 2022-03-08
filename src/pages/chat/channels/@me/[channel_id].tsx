import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'

const ChatApp: NextPage = ({ refreshToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const { channel_id } = router.query;
    return (
        <>
            {JSON.stringify(channel_id)}
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
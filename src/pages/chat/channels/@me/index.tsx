import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import NextLink from "next/link"

const ChatApp: NextPage = ({ refreshToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <>
            <NextLink href="/chat/channels/@me/438">
                <a>T</a>
            </NextLink>
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
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import NextLink from "next/link"
import MainFrame from '../../../../components/chat/MainFrame'

const ChatApp: NextPage = ({ refreshToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <>
            <MainFrame>
            </MainFrame>
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
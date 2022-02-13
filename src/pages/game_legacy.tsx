
export default function Legacy() {
    return <></>
}

export function getServerSideProps() {
    return {
        redirect: {
            permanent: false,
            destination: "/free"
        }
    }
}
import React from 'react'
import type { NextPage } from 'next'

const Display: NextPage = () => {
    const [token, setToken] = React.useState<string>("");
    React.useEffect((): any => {
        const tok = localStorage.getItem("token") || "testvalue123"
        console.log(tok);
        if (tok) setToken(tok);
        localStorage.removeItem("token");
        window.addEventListener("beforeunload", () => {
            if (tok) localStorage.setItem("token", tok)
        })
    }, [])
    return (
        <>
            {token}
        </>
    )
}

export default Display;
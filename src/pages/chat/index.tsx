import React from 'react'
import type { NextPage } from 'next'
import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import ghostPng from "/public/ghost.png"

const Display: NextPage = () => {
    const [token, setToken] = React.useState<string>("");
    React.useEffect((): any => {
        const tok = localStorage.getItem("token") || "testvalue123"
        if (tok) setToken(tok);
        localStorage.removeItem("token");
        window.addEventListener("beforeunload", () => {
            if (tok) localStorage.setItem("token", tok)
        })
    }, [])
    return (
        <>
            {token}
            <Flex
                alignItems="center"
                justifyContent="center"
                >
                <Image
                    src={ghostPng} alt=""
                />
                {
                    console.log(ghostPng)
                }
            </Flex>
        </>
    )
}

export default Display;
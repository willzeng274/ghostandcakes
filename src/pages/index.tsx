import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { Link, Text } from "@chakra-ui/react";
import React from 'react'

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>No</title>
                <meta name="description" content="Ghost and Cakes - a game made with $13 billion budget" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <p>Imagine coming to this website</p>
            <br />
            <NextLink href="/game" passHref>
                <Link color="blue">
                    <Text>Play Ghost and Cakes</Text>
                </Link>
            </NextLink>
            <br />
            <NextLink href="/free" passHref>
                <Link color="blue">
                    <Text>Play Lower Budget version of Ghost and Cakes</Text>
                </Link>
            </NextLink>
            <br />
            <NextLink href="/crap" passHref>
                <Link color="blue">
                    <Text>Play Cake Invaders - A game caused by a miscalculation in Ghost and Cakes</Text>
                </Link>
            </NextLink>
            <br />
            <NextLink href="/chat" passHref>
                <Link color="blue">
                    <Text>Global chat in case you can&apos;t talk</Text>
                </Link>
            </NextLink>
        </div>
    )
}

export default Home
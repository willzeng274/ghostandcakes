import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { Link } from "@chakra-ui/react";
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
            <NextLink href="/game">
                <Link color="blue">
                    <a>Play Ghost and Cakes</a>
                </Link>
            </NextLink>
            <br />
            <br />
            <NextLink href="/free">
                <Link color="blue">
                    <a>Play Lower Budget version of Ghost and Cakes</a>
                </Link>
            </NextLink>
            <br />
            <br />
            <NextLink href="/crap">
                <Link color="blue">
                    <a>Play Cake Invaders - A game caused by a miscalculation in Ghost and Cakes</a>
                </Link>
            </NextLink>
            <br />
            <br />
            <NextLink href="/chat">
                <Link color="blue">
                    <a>Global chat in case you can&apos;t talk</a>
                </Link>
            </NextLink>
        </div>
    )
}

export default Home
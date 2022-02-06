import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
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
            <Link href="/game">
                <a>Play Ghost and Cakes</a>
            </Link>
            <br />
            <Link href="/free">
                <a>Lower Budget version of Ghost and Cakes</a>
            </Link>
        </div>
    )
}

export default Home
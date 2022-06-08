import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import useInterval from '../helpers/useInterval'
import Image from 'next/image';
import cakeSvg from "/public/cake-a.svg";
import { Box } from '@chakra-ui/react';
import ghostPng from "/public/ghost.png";

const Home: NextPage = () => {
  const [rotate, setRotate] = React.useState<number>(0);
  const [ghostX, setGhostX] = React.useState<number>(0);
  const [ghostY, setGhostY] = React.useState<number>(0);
  const [CX, setCX] = React.useState<number>(0);
  const [CY, setCY] = React.useState<number>(0);
  const [cakeX, setCakeX] = React.useState<number>(0);
  const [cakeY, setCakeY] = React.useState<number>(0);
  const [counter, setCounter] = React.useState<number>(0);
  React.useEffect((): void => {
    window.addEventListener("mousemove", (e) => {setCX(e.clientX); setCY(e.clientY);});
  }, []);
  useInterval(function() {
    setGhostY(ghostY => {
      return Math.round((ghostY + 1 * Math.sin(rotate)) * 100) / 100;
    });
    setGhostX(ghostX => {
      return Math.round((ghostX + 1 * Math.cos(rotate)) * 100) / 100;
    });
    setRotate((_ => {
      console.log(CX, CY, ghostX, ghostY, rotate);
      return Math.round(((((Math.atan2(ghostY - CY, ghostX - CX) + 180)  * 180 / Math.PI) - 60) % 360) * 100) / 100;
    })());
  }, 0.01);
  function handleMouseOver(): void {
    alert("Game Over!");
    setCounter(0);
  }
  function cakeRandom() {
    setCakeX(Math.floor(Math.random() * (window.innerWidth-100)));
    setCakeY(Math.floor(Math.random() * (window.innerHeight-100)));
  }
  function handleCakeClick(): void {
    cakeRandom();
    setCounter(counter => {
      return counter + 1;
    });
  }
  return (
    <div>
      <Head>
        <title>BUDGET VERSION</title>
        <meta name="description" content="Ghost and Cakes - a game made with $13 billion budget" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>{counter}</p>
      <Box style={{position: "fixed", top: `${cakeY}px`, left: `${cakeX}px`}}>
        <Image onClick={handleCakeClick} src={cakeSvg} alt="" />
      </Box>
      <Box width={100} height={100} style={{position: "fixed", top: `${ghostY}px`, left: `${ghostX}px`, transform: `rotate(${rotate}deg)`}}>
        <Image alt="" onMouseOver={handleMouseOver} src={ghostPng} />
      </Box>
    </div>
  )
}

export default Home

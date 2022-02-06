import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { useInterval } from '../helpers/useInterval'
import { useDispatch } from 'react-redux'

interface Vector {
  x: number;
  y: number;
}

interface Point {
  x: number;
  y: number;
}

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const [rotate, setRotate] = React.useState<number>(0);
  const [ghostX, setGhostX] = React.useState<number>(500);
  const [ghostY, setGhostY] = React.useState<number>(500);
  const [CX, setCX] = React.useState<number>(0);
  const [CY, setCY] = React.useState<number>(0);
  const [cakeX, setCakeX] = React.useState<number>(0);
  const [cakeY, setCakeY] = React.useState<number>(0);
  const [counter, setCounter] = React.useState<number>(0);
  const [speed, setSpeed] = React.useState<number>(1);
  React.useEffect((): void => {
    window.addEventListener("mousemove", (e) => {setCX(e.clientX); setCY(e.clientY);});
  }, []);
  React.useEffect((): void => {
    console.log(dispatch({type: "INCREMENT", payload: {value: 1}}));
  }, [dispatch]);
  // function get_vector_length(vector: Vector): number {
  //   return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  // }
  useInterval(function() {
    setRotate((_ => {
      return Math.round(((((Math.atan2(ghostY - CY, ghostX - CX) + 180)  * 180 / Math.PI) - 60) % 360) * 100) / 100;
    })());
    const a: number = CX - ghostX - 50, b: number = CY-ghostY - 40, c: number = Math.sqrt(a**2 + b**2);
    const ratio: number = speed/c, a1: number = a*ratio, b1 : number = b*ratio;
    setGhostX((ghostX: number) => {
      return ghostX + a1;
    });
    setGhostY((ghostY: number) => {
      return ghostY + b1;
    })
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
        <title>FREE VERSION</title>
        <meta name="description" content="Ghost and Cakes - a game made with $13 billion budget" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>{counter}</p>
      <img onClick={handleCakeClick} src="/cake-a.svg" alt="" style={{position: "fixed", top: `${cakeY}px`, left: `${cakeX}px`}} />
      <img alt="" onMouseOver={handleMouseOver} src="/ghost.png" width={100} height={100} style={{position: "fixed", top: `${ghostY}px`, left: `${ghostX}px`, transform: `rotate(${rotate}deg)`}} />
    </div>
  )
}

export default Home

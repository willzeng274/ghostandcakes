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
  const [ghostX, setGhostX] = React.useState<number>(50);
  const [ghostY, setGhostY] = React.useState<number>(10);
  const [CX, setCX] = React.useState<number>(0);
  const [CY, setCY] = React.useState<number>(0);
  const [cakeX, setCakeX] = React.useState<number>(0);
  const [cakeY, setCakeY] = React.useState<number>(0);
  const [counter, setCounter] = React.useState<number>(0);
  React.useEffect((): void => {
    window.addEventListener("mousemove", (e) => {setCX(e.clientX); setCY(e.clientY);});
  }, []);
  React.useEffect((): void => {
    console.log(dispatch({type: "INCREMENT", payload: {value: 1}}));
  }, [dispatch]);
  function get_vector_length(v: Vector): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }
  useInterval(function() {
    setRotate((_ => {
      return Math.round(((((Math.atan2(ghostY - CY, ghostX - CX) + 180)  * 180 / Math.PI) - 60) % 360) * 100) / 100;
    })());
    let vector_AB: Vector = {x: ghostX - CX, y: ghostY - CY};
    let vector_AC: Vector = {x: ghostX - CX, y: 0};
    let AB_DOT_AC: number = vector_AB.x * vector_AC.x
    let length_AB_AC: number = get_vector_length(vector_AB) * get_vector_length(vector_AC);
    let cos_theta: number = AB_DOT_AC / length_AB_AC;
    let theta: number = Math.acos(cos_theta);
    setGhostY(ghostY => {
      if (ghostY < CY) {
        return Math.round((ghostY + 3 * cos_theta + 25) * 100) / 100
      } else {
        return Math.round((ghostY - 3 * cos_theta + 25) * 100) / 100;
      }
    });
//     setGhostX(ghostX => {
//       if (ghostX < CX) {
//         return Math.round((ghostX + 1 * Math.sin(theta)) * 100) / 100;
//       } else {
//         return Math.round((ghostX - 1 * Math.sin(theta)) * 100) / 100;
//       }
//     });
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
        <title>NOT EVEN WORKING VERSION</title>
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


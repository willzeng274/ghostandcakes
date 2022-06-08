import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import useInterval from '../helpers/useInterval';
import { Box, Button, Flex, Progress, Text } from '@chakra-ui/react';
import useEventListener from '../helpers/listener';
import Image from 'next/image';
import cakeBSvg from '/public/cake-b.svg';
import cakeASvg from '/public/cake-a.svg';
import ghostPng from '/public/ghost.png';
cakeASvg.width = cakeBSvg.width;
cakeASvg.height = cakeBSvg.height;

const Game: NextPage = () => {
  const MyRef = useRef<HTMLCanvasElement | null>(null);
  const CakeRef = useRef<HTMLDivElement | null>(null);
  const Cake2Ref = useRef<HTMLDivElement | null>(null);
  const [rotate, setRotate] = useState<number>(0);
  const [ghostX, setGhostX] = useState<number>(500);
  const [ghostY, setGhostY] = useState<number>(500);
  const [CX, setCX] = useState<number>(0);
  const [CY, setCY] = useState<number>(0);
  const [cakeX, setCakeX] = useState<number>(0);
  const [cakeY, setCakeY] = useState<number>(0);
  const [cake2X, setCake2X] = useState<number>(0);
  const [cake2Y, setCake2Y] = useState<number>(0);
  const [cake2Visible, setCake2Vis] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0.5);
  const [mobile, setMobile] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const [over, setOver] = useState<boolean>(false);
  const [lb, setLb] = useState<number>(0);
  const [frozen, setFrozen] = useState<number>(0);
  const [freezeSpawn, setFreezeSpawn] = useState<number>(0);
  function getViewport() {
    var viewPortWidth;
    var viewPortHeight;
    if (typeof window.innerWidth != 'undefined') {
      viewPortWidth = window.innerWidth,
      viewPortHeight = window.innerHeight
    } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
       viewPortWidth = document.documentElement.clientWidth,
       viewPortHeight = document.documentElement.clientHeight
    }
    else {
      viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
      viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
    }
    return [viewPortWidth, viewPortHeight];
  }
  useEffect((): void => {
    if (!start || over) {
      return;
    }
    const canv: HTMLCanvasElement | null = MyRef.current;
    if (!canv) {
      return;
    }
    const ctx = canv.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.font = "48px Arial";
    ctx.fillText("Points: " + String(counter), canv.width/10, canv.height/1.6);
  }, [counter, start, over]);
  useEventListener("mousemove", (e: MouseEvent) => {
    if (localStorage.getItem('banned') === '1') {
      alert("You are banned from the game");
      window.location.href = "/";
      return;
    }
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const isMobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    if (isMobile && (e.target as HTMLBodyElement)?.classList[0] !== "no-drag") {
      return;
    }
    setCX(e.clientX);
    setCY(e.clientY);
  });
  useEffect((): void => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    setMobile(Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    ));
  }, [mobile]);
  useEffect((): void => {
    if (!localStorage.getItem("lb")) {
      localStorage.setItem("lb", String(lb))
    } else {
      setLb(+(localStorage.getItem("lb") as string))
    }
  }, []);
  useEffect((): void => {
    if (lb > 0) {
      localStorage.setItem("lb", String(lb))
    }
  }, [lb])
  useEventListener("keyup", () => {
    if (over) {
      setOver(false);
    }
    if (!start) {
      setStart(true);
    }
  });
  useEffect((): void => {
    if (!over) {
      setCounter(0);
    }
  }, [over]);
  useEventListener("mouseup", () => {
    if (!start) {
      setStart(true);
    }
    if (over) {
      setOver(false);
    }
  });
  useInterval(function () {
    setCake2Vis(true);
    setFreezeSpawn(Math.floor(Math.random() * (12000 - 6000 + 1) + 6000))
  }, freezeSpawn);
  useInterval(function () {
    if (frozen < 1) return;
    setFrozen(frozen-1);
  }, 50);
  useInterval(function() {
    if (over || !start) return;
    const [w, h] = getViewport();
    setRotate((_ => {
      return Math.round(((((Math.atan2(ghostY - CY, ghostX - CX) + 180)  * 180 / Math.PI) - 60) % 360) * 100) / 100;
    })());
    const a: number = CX - ghostX - 50, b: number = CY-ghostY - 40, c: number = Math.sqrt(a**2 + b**2);
    const sped: number = speed*(mobile ? 1 : Math.min(w/1538.1, h/806.1));
    const ratio: number = (frozen ? sped /3 : sped)/c, a1: number = a*ratio, b1 : number = b*ratio;
    setGhostX((ghostX: number) => {
      return ghostX + a1;
    });
    setGhostY((ghostY: number) => {
      return ghostY + b1;
    })
    if (!frozen) {
      if (counter < 10) {
        setSpeed(0.5);
      } else if (counter < 20) {
        setSpeed(0.75);
      } else if (counter < 30) {
        setSpeed(1);
      } else if (counter < 50) {
        setSpeed(1.5);
      } else if (counter < 100) {
        setSpeed(2);
      } else {
        setSpeed(Math.floor((counter / 50) * 100) / 100);
      }
    }
    if (Math.round(CX - ghostX - 50) === 0 && Math.round(CY- ghostY - 40) === 0) {
      if (!over) {
        handleMouseOver();
      }
    }
  }, 0.01);
  function handleMouseOver() {
    setCX(0);
    setCY(0);
    setCakeX(0);
    setCakeY(0);
    setGhostX(500);
    setGhostY(500);
    if (counter > lb) {
      setLb(counter);
    }
    setOver(true);
  }
  function between(x: number, min: number, max: number): boolean {
    return x >= min && x <= max;
  }
  function cakeRandom() {
    let [randX, randY]: [number, number] = [Math.floor(Math.random() * (window.innerWidth-100)), Math.floor(Math.random() * (window.innerHeight-100))]
    while (between(randX, ghostX-100, ghostX+100)) {
      randX = Math.floor(Math.random() * (window.innerWidth-100));
    }
    while (between(randY, ghostY-100, ghostY+100)) {
      randY = Math.floor(Math.random() * (window.innerHeight-100));
    }
    setCakeX(randX);
    setCakeY(randY);
  }
  function handleCakeClick(e: React.MouseEvent<HTMLImageElement>): void {
    const cakeR: HTMLDivElement | null = CakeRef.current;
    if (!cakeR) {
      return;
    }
    if (!e.isTrusted || (cakeR.style.width !== "10vw" && !mobile) || (cakeR.style.width !== "30vw" && mobile)) {
      alert("Cheater alert! You are banned");
      localStorage.setItem('banned', '1');
      window.location.href = "/";
      return;
    }
    cakeRandom();
    setCounter(counter+1);
  }
  function handleCake2Click(e: React.MouseEvent<HTMLImageElement>): void {
    setFrozen(50);
    const cakeR: HTMLDivElement | null = Cake2Ref.current;
    if (!cakeR) {
      return;
    }
    if (!e.isTrusted || (cakeR.style.width !== "10vw" && !mobile) || (cakeR.style.width !== "30vw" && mobile)) {
      alert("Cheater alert! You are banned");
      localStorage.setItem('banned', '1');
      window.location.href = "/";
      return;
    }
    const [randX, randY]: [number, number] = [Math.floor(Math.random() * (window.innerWidth-100)), Math.floor(Math.random() * (window.innerHeight-100))];
    setCake2X(randX);
    setCake2Y(randY);
    setCake2Vis(false);
  }
  return (
    <div>
      <Head>
        <title>FREE VERSION</title>
        <meta name="description" content="Ghost and Cakes - a game made with $13 billion budget" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        start ? 
          !over ?
            <>
              <Flex alignItems="center" justifyContent="center">
                <canvas ref={MyRef} style={{width: "10vw", alignSelf: "flex-start"}} />
                <Flex width="80vw" alignItems="center" justifyContent="center">
                  <Text width="10%">
                    {"Freeze: "}{frozen}
                  </Text>
                  <Progress width="90%" value={frozen} min={0} max={50} hasStripe />
                </Flex>
              </Flex>
              <Box ref={Cake2Ref} style={
                  {
                    position: "fixed",
                    top: `${cake2Y}px`,
                    left: `${cake2X}px`,
                    width: mobile ? "30vw": "10vw",
                    height: "auto",
                    display: cake2Visible ? "block" : "none",
                  }
              }>
                <Image alt="" className={"no-drag"} onMouseDown={handleCake2Click} src={cakeBSvg}  />
              </Box>
              <Box ref={CakeRef} style={
                  {
                    position: "fixed",
                    top: `${cakeY}px`,
                    left: `${cakeX}px`,
                    width: mobile ? "30vw" : "10vw",
                    height: "auto",
                  }
              }>
                <Image className={"no-drag"} onMouseDown={handleCakeClick} src={cakeASvg} alt="" />
              </Box>
              <Box style={{
                  position: "fixed",
                  top: `${ghostY}px`,
                  left: `${ghostX}px`,
                  transform: `rotate(${rotate}deg)`,
                  width: mobile ? "30vw" :"10vw",
                  height: "auto"
              }}>
                <Image alt=""
                onMouseOver={handleMouseOver}
                src={ghostPng} />
              </Box>
            </>
          :
            <>
              <p>Game Over!</p>
              <p>Score: {counter}</p>
              <p>Personal Best: {lb}</p>
              <p>Note: This is information is stored in your browser.</p>
              <Button onClick={() => setOver(false)}>Play Again</Button>
            </>
        :
          <>
            <Button onClick={() => setStart(true)}>Start Game</Button>
            <p>Game: You must click the cakes to gain points, and avoid your mouse being touched by the ghost!</p>
          </>
      }
    </div>
  )
}

export default Game;

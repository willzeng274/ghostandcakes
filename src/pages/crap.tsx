import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { useInterval } from '../helpers/useInterval'
import { useDispatch } from 'react-redux'
import { linkWithPhoneNumber } from 'firebase/auth'

interface Vector {
  x: number;
  y: number;
}

interface IBullet {
  left: number;
  top: number;
}

interface Invader {
  right: number;
  top: number;
}
 
const ghostX = 50;

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const player = React.useRef(null);
  const [rotate, setRotate] = React.useState<number>(0);
  // const [ghostX, setGhostX] = React.useState<number>(50);
  const [ghostY, setGhostY] = React.useState<number>(10);
  const [CX, setCX] = React.useState<number>(0);
  const [CY, setCY] = React.useState<number>(0);
  const [counter, setCounter] = React.useState<number>(0);
  const [bullets, setBullets] = React.useState<IBullet[]>([]);
  const [invaders, setInvaders] = React.useState<Invader[]>([]);
  const [over, setOver] = React.useState<boolean>(false);
  const [mobile, setMobile] = React.useState<boolean>(false);
  const [orientation, setOrientation] = React.useState<string>("");
  React.useEffect((): any => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const m = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    let orientation;
    if (m) {
      orientation = !window.screen.orientation.angle ? 'portrait' : 'landscape';
      setOrientation(orientation)
    }
    setMobile(m);
    if (m) {
      const abc: any = window.addEventListener("touchmove", (e) => {setCX(e.touches[0].clientX); setCY(e.touches[0].clientY);});
      return () => window.removeEventListener("touchmove", abc);
    } else {
      const abc: any = window.addEventListener("mousemove", (e) => {setCX(e.clientX); setCY(e.clientY);});
      return () => window.removeEventListener('mousemove', abc);
    }
  }, []);
  React.useEffect((): void => {
    console.log(dispatch({type: "INCREMENT", payload: {value: 1}}));
  }, [dispatch]);
  React.useEffect((): void => {
    if (over) {
      setBullets([]);
      setInvaders([]);
      setCounter(0);
    }
  }, [over])
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
    setGhostY(ghostY => {
      if (ghostY < CY) {
        return Math.round((ghostY + 3 * cos_theta) * 100) / 100
      } else {
        return Math.round((ghostY - 3 * cos_theta) * 100) / 100;
      }
    });
  }, 0.01);
  useInterval(function() {
    let invds = invaders;
    let newBullets: IBullet[] = bullets.map((item: IBullet) => {
      let newItem: IBullet = {
        left: item.left + 5,
        top: item.top,
      };
      return newItem;
    }).filter((item: IBullet, ind1) => {
      invds = invds.filter((_, ind2) => {
        const result = checkCollision(document.getElementById(`b_${ind1}`), document.getElementById(`i_${ind2}`));
        if (result) {
          setCounter(counter+1);
        }
        return !result;
      });
      return !(item.left > window.innerWidth)
    });
    setInvaders(invds.map((item: Invader) => {
      let newItem: Invader = {
        right: item.right + 0.5,
        top: item.top,
      };
      return newItem;
    }));
    setBullets(newBullets);
  }, 5);
  useInterval(function() {
    setBullets([...bullets, {left: ghostX, top: ghostY}])
  }, 250);
  useInterval(function() {
    let randY: number = Math.floor(Math.random() * (window.innerHeight-100));
    setInvaders([...invaders, {right: 0, top: randY}])
  }, 2000);
  function checkCollision(elm1: any, elm2: any) {
    if (!elm1 || !elm2) return;
    const elm1Rect = elm1.getBoundingClientRect();
    const elm2Rect = elm2.getBoundingClientRect();
    const playerRect = (player.current as any).getBoundingClientRect();
    const die: boolean = (elm2Rect.right >= playerRect.left &&
      elm2Rect.left <= playerRect.right) &&
      (elm2Rect.bottom >= playerRect.top &&
        elm2Rect.top <= playerRect.bottom);
    if (die) {
      setOver(true);
    }
    return (elm1Rect.right >= elm2Rect.left &&
        elm1Rect.left <= elm2Rect.right) &&
      (elm1Rect.bottom >= elm2Rect.top &&
        elm1Rect.top <= elm2Rect.bottom);
  }
  return (
    <div>
      <Head>
        <title>SPACE INVADERS</title>
        <meta name="description" content="Ghost and Cakes - a game made with $13 billion budget" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        !over ?
          mobile && orientation === "portrait" ?
            <>
              Please rotate your phone then refresh the webpage. This game works terrible in portrait mode.
            </>
          :
            <>
              <p>{counter}</p>
              {/* <img src="/cake-a.svg" alt="" style={{position: "fixed", top: `${cakeY}px`, left: `${cakeX}px`}} /> */}
              <img ref={player} alt="" src="/ghost.png" width={100} height={100} style={{position: "fixed", top: `${ghostY-25}px`, left: `${ghostX}px`, transform: `rotate(${rotate}deg)`}} />
              {bullets.map((i: IBullet, index: number) => <div style={{
                position: "fixed",
                top: `${i.top}px`,
                left: `${i.left}px`,
                height: "2vh",
                width: "3vw",
                backgroundColor: "purple"
              }} key={index} id={`b_${index}`}></div>)}
              {invaders.map((i: Invader, index: number) => <div style={{
                position: "fixed",
                top: `${i.top}px`,
                right: `${i.right}px`,
                height: "5vh",
                width: "2vw",
                backgroundColor: "green"
              }} key={index} id={`i_${index}`}></div>)}
            </>
        :
          <>
            {"Game Over!"}
          </>
      }
    </div>
  )
}

export default Home


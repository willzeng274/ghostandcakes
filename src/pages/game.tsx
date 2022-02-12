import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { useInterval } from '../helpers/useInterval'
import { useDispatch } from 'react-redux'
import { Fetch } from '../helpers/deta'
// import useDeviceDetect from '../helpers/device'

const Game: NextPage = ({ items }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useDispatch();
  const MyRef = React.useRef(null);
  const CakeRef = React.useRef(null);
  const [rotate, setRotate] = React.useState<number>(0);
  const [ghostX, setGhostX] = React.useState<number>(500);
  const [ghostY, setGhostY] = React.useState<number>(500);
  const [CX, setCX] = React.useState<number>(0);
  const [CY, setCY] = React.useState<number>(0);
  const [cakeX, setCakeX] = React.useState<number>(0);
  const [cakeY, setCakeY] = React.useState<number>(0);
  const [counter, setCounter] = React.useState<number>(0);
  const [speed, setSpeed] = React.useState<number>(0.5);
  const [bratio, setBratio] = React.useState<number>(1);
  const [mobile, setMobile] = React.useState<boolean>(false);
  const [start, setStart] = React.useState<boolean>(false);
  const [over, setOver] = React.useState<boolean>(false);
  const [lb, setLb] = React.useState<number>(0);
  const [zoom, setZoom] = React.useState<boolean>(false);
  React.useEffect((): void => {
    if (!start || over || zoom) {
      return;
    }
    const canv: any = MyRef.current;
    const ctx = canv.getContext("2d");
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.font = "30px Arial";
    ctx.fillText("Points: " + String(counter), 0, 25);
  }, [counter, start, over, zoom]);
  React.useEffect((): any => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    setMobile(Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    ));
    const abc: any = window.addEventListener("mousemove", (e) => {
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
      if (isMobile && (e?.target as any)?.classList[0] !== "no-drag") {
        return;
      }
      setCX(e.clientX);
      setCY(e.clientY);
    });
    console.log("LEADERBOARD: ", items);
    return () => window.removeEventListener("mouseover", abc);
  }, [items]);
  React.useEffect(() => {
    if (!localStorage.getItem("lb")) {
      localStorage.setItem("lb", String(lb))
    } else {
      setLb(+(localStorage.getItem("lb") as string))
    }
  }, [])
  React.useEffect(() => {
    if (lb > 0) {
      localStorage.setItem("lb", String(lb))
    }
  }, [lb])
  React.useEffect(() => {
    const ab: any = window.addEventListener("keyup", () => {
      if (over) {
        setOver(false);
      }
    });
    return () => window.removeEventListener("keyup", ab);
  }, [over]);
  React.useEffect(() => {
    const ab: any = window.addEventListener("keyup", () => {
      if (!start) {
        setStart(true);
      }
    });
    return () => window.removeEventListener("keyup", ab);
  }, [start]);
  React.useEffect(() => {
    const ab: any = window.addEventListener("mouseup", () => {
      if (!start) {
        setStart(true);
      }
      if (over) {
        setOver(false);
      }
    });
    return () => window.removeEventListener("mouseup", ab)
  }, [start, over]);
  React.useEffect(() => {
    if ((bratio !== 1 && !mobile) || (bratio !== 1.5 && mobile)) {
      setZoom(true);
    } else {
      console.log(bratio, mobile)
      setZoom(false);
    }
  }, [bratio]);
  React.useEffect((): void => {
    console.log(dispatch({type: "INCREMENT", payload: {value: 1}}));
  }, [dispatch]);
  useInterval(function() {
    const brio: number = Math.round(window.devicePixelRatio * 100) / 200;
    if (bratio !== brio) {
      setBratio(brio);
    }
    setRotate((_ => {
      return Math.round(((((Math.atan2(ghostY - CY, ghostX - CX) + 180)  * 180 / Math.PI) - 60) % 360) * 100) / 100;
    })());
    const a: number = CX - ghostX - 50, b: number = CY-ghostY - 40, c: number = Math.sqrt(a**2 + b**2);
    const sped: number = mobile ? speed * 1.5 : speed;
    const ratio: number = (sped)/c, a1: number = a*ratio, b1 : number = b*ratio;
    setGhostX((ghostX: number) => {
      return ghostX + a1;
    });
    setGhostY((ghostY: number) => {
      return ghostY + b1;
    })
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
    if (counter >= items[items.length-1].points) {
      // screw the leaderboard idea

      // fetch("/api/views", {
      //   method: "POST",
      //   headers: {
      //     Accept: '*',
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     name: prompt("Give name! You're on the leaderboard") || "user",
      //     points: counter
      //   })
      // }).then((res) => res.json()).then((res) => console.log(res))
    }
    setCounter(0);
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
  function handleCakeClick(e: any): void {
    const cakeR: any = CakeRef.current
    if (!e.isTrusted || (cakeR.style.width !== "10vw" && !mobile) || (cakeR.style.width !== "30vw" && mobile)) {
      alert("Cheater alert! You are banned");
      localStorage.setItem('banned', '1');
      window.location.href = "/";
      return;
    }
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
      {
        start ? 
          !over ?
            !zoom ?
              <>
                <canvas ref={MyRef} />
                <img
                  ref={CakeRef}
                  className={"no-drag"}
                  onClick={handleCakeClick}
                  src="/cake-a.svg"
                  alt=""
                  style={
                    {
                      position: "fixed",
                      top: `${cakeY}px`,
                      left: `${cakeX}px`,
                      width: mobile ? "30vw" : "10vw",
                      height: "auto",
                    }
                  }
                />
                <img
                  alt=""
                  onMouseOver={handleMouseOver}
                  src="/ghost.png" width={100} height={100}
                  style={{
                    position: "fixed",
                    top: `${ghostY}px`,
                    left: `${ghostX}px`,
                    transform: `rotate(${rotate}deg)`,
                    width: mobile ? "30vw" :"10vw",
                    height: "auto"
                  }}
                />
              </>
            :
              <>
                {"Please update your zoom level. This game cannot be played when zoomed in or out."}
              </>
          :
            <>
              <p>Game Over!</p>
              <p>Personal Best: {lb}</p>
              <p>Note: This is information is stored in your browser.</p>
              <button onClick={() => setOver(false)}>Restart</button>
            </>
        :
          <>
            <button onClick={() => setStart(true)}>Start Game</button>
            <p>Game: You must click the cakes to gain points, and avoid your mouse being touched by the ghost!</p>
          </>
      }
    </div>
  )
}

export default Game

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      items: (await Fetch()).sort((a, b) => -(a as any).points + (b as any).points)
    }
  }
}

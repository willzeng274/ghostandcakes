import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import useInterval from '../helpers/useInterval'
import {
  Box,
  Button,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Link
} from '@chakra-ui/react';
import Image from 'next/image'
import NextLink from 'next/link'

interface Vector {
  x: number;
  y: number;
}

interface IBullet {
  left: number;
  top: number;
  uuid: number;
}

interface Invader {
  right: number;
  top: number;
  ohp: number;
  hp: number;
}
 
const ghostX = 50;

const Home: NextPage = () => {
  const player = React.useRef(null);
  const [rotate, setRotate] = React.useState<number>(0);
  const [spawnRate, setSpawnrate] = React.useState<number>(0);
  const [spawnRateDefault, setSpawnrateDefault] = React.useState<number>(2000);
  const [ghostY, setGhostY] = React.useState<number>(10);
  const [CX, setCX] = React.useState<number>(0);
  const [CY, setCY] = React.useState<number>(0);
  const [counter, setCounter] = React.useState<number>(0);
  const [bullets, setBullets] = React.useState<IBullet[]>([]);
  const [invaders, setInvaders] = React.useState<Invader[]>([]);
  const [over, setOver] = React.useState<boolean>(false);
  const [mobile, setMobile] = React.useState<boolean>(false);
  const [orientation, setOrientation] = React.useState<string>("");
  const [dmg, setDmg] = React.useState<number>(1);
  const [bulletSpeed, setBulletSpeed] = React.useState<number>(8.5);
  const [bulletSpawn, setBulletSpawn] = React.useState<number>(500);
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
      let scren = screen || window;
      orientation = scren?.orientation || window?.screen?.orientation;
      if (orientation) {
        orientation = orientation.angle ? 'portrait' : 'landscape';
        setOrientation(orientation);
      }

      const mql = window.matchMedia("(orientation: portrait)");

      if(mql.matches) {  
        setOrientation("portrait");
      } else {  
        setOrientation("landscape");
      }

      mql.addListener(function(m) {
          if(m.matches) {
            setOrientation("portrait");
          }
          else {
            setOrientation("landscape");
          }
      });
    }
    setMobile(m);
    if (m) {
      const abc: any = window.addEventListener("touchstart", (e) => {setCX(e.touches[0].clientX); setCY(e.touches[0].clientY);});
      return () => window.removeEventListener("touchstart", abc);
    } else {
      const abc: any = window.addEventListener("mousemove", (e) => {setCX(e.clientX); setCY(e.clientY);});
      return () => window.removeEventListener('mousemove', abc);
    }
  }, []);
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
  }, 1);
  useInterval(function() {
    let invds = invaders;
    let newBullets: IBullet[] = bullets.reduce((arr: IBullet[], item: IBullet) => {
      if (!item) {
        return arr;
      }
      let collision: boolean = false;
      invds = invds.reduce((ar: Invader[], item2: Invader, ind2) => {
        if (!item2) {
          return ar;
        }
        const result = checkCollision(document.getElementById(`b_${item.uuid}`), document.getElementById(`i_${ind2}`));
        if (result) {
          collision = true;
          item2.hp -= dmg;
          if (item2.hp >= 1) {
            ar.push(item2);
          } else {
            setCounter(counter+item2.ohp);
          }
        } else {
          ar.push(item2);
        }
        return ar;
      }, []);
      if (!collision && !(item.left > window.innerWidth)) {
        arr.push(item);
      }
      return arr;
    }, []).map((item: IBullet) => {
      item.left += bulletSpeed;
      return item;
    });
    invds = invds.map((item: Invader) => {
      if (item.hp > 10) {
        item.right += 0.1;
      } else {
        item.right += 1.1-item.hp/10;
      }
      return item;
    });
    setInvaders(invds);
    setBullets(newBullets);
  }, 5);
  useInterval(function() {
    setBullets([...bullets, {left: ghostX+50, top: ghostY, uuid: Date.now()}])
  }, bulletSpawn);
  useInterval(function() {
    if (spawnRate === 5001) return;
    let randY: number = Math.floor(Math.random() * (window.innerHeight-100));
    let randHP: number = Math.ceil(Math.random() * 10);
    if (Math.random() > 0.9) {
      randHP = Math.ceil(Math.random() * (100 - 50 + 1) + 50)
    }
    setInvaders([...invaders, {right: 0, top: randY, hp: randHP, ohp: randHP }]);
    if (spawnRate === 0) {
      setSpawnrateDefault(Math.floor(Math.random() * (5000 - 500 + 1)) + 500);
    }
  }, spawnRate === 0 ? spawnRateDefault : spawnRate);
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
        <title>CAKE INVADERS</title>
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
            <Box overflow="hidden">
              <Flex flexDir="column" justifyContent={"center"} alignItems={"center"}>
                <Flex justifyContent={"center"} alignItems={"center"}>
                  <Text marginRight={3}>Points: {counter}</Text>
                  <Flex flexDir="column" height="inherit" justifyContent={"center"}>
                    <Slider marginBottom={5} width="50vw" aria-label='slider-ex-1' defaultValue={1} min={1} max={10} step={1} onChange={(v: number) => setDmg(v)}>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <Slider marginBottom={5} width="50vw" aria-label='slider-ex-1' defaultValue={2000} min={250} max={5001} step={1} onChange={(v: number) => setSpawnrate(v)}>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <Slider marginBottom={5} width="50vw" aria-label='slider-ex-1' defaultValue={8.5} min={1} max={10} step={0.5} onChange={(v: number) => setBulletSpeed(v)}>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <Slider marginBottom={5} width="50vw" aria-label='slider-ex-1' defaultValue={500} min={100} max={1000} step={1} onChange={(v: number) => setBulletSpawn(v)}>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Flex>
                  <Text marginLeft={3}>
                    {`Damage: ${dmg}\nSpawnRate: ${spawnRate === 0 ? spawnRateDefault : spawnRate === 5001 ? "NEVER" : spawnRate}ms ${spawnRate === 0 ? "DEFAULT" : ""}\nBullet Speed: ${bulletSpeed}\nBullet Spawnrate: ${bulletSpawn}ms\nPerformance: Low`}
                  </Text>
                </Flex>
                <Text>
                  {"Performance Issues? Contribute to GitHub "}
                  <NextLink href="https://github.com/NastyPigz/ghostandcakes" passHref>
                    <Link color="blue">
                      <a>here</a>
                    </Link>
                  </NextLink>
                </Text>
              </Flex>
              {/* <img src="/cake-a.svg" alt="" style={{position: "fixed", top: `${cakeY}px`, left: `${cakeX}px`}} /> */}
              <div ref={player} style={{
                position: "fixed",
                top: `${ghostY-25}px`,
                left: `${ghostX}px`,
                transform: `rotate(${rotate}deg)`,
              }}>
                <div style={{
                  position: "relative",
                  width: "7.5vw",
                  height: "7.5vw"
                }}>
                  <Image alt="" src="/ghost.png" layout="fill" objectFit="contain" priority={true} />
                </div>
              </div>
              {/* <img ref={player} alt="" src="/ghost.png" width={100} height={100} style={{position: "fixed", top: `${ghostY-25}px`, left: `${ghostX}px`, transform: `rotate(${rotate}deg)`}} /> */}
              {bullets.map((i: IBullet, index: number) => <div style={{
                position: "fixed",
                top: `${i.top}px`,
                left: `${i.left}px`,
                height: "1vh",
                width: "1vw",
                backgroundColor: "purple",
                borderRadius: "50%"
              }} key={index} id={`b_${i.uuid}`}></div>)}
              {invaders.map((i: Invader, index: number) => <div style={{
                position: "fixed",
                top: `${i.top}px`,
                right: `${i.right}px`,
                height: "5vh",
                width: "auto",
                backgroundColor: "green",
                textAlign: "center",
                color: "white",
                lineHeight: "5vh",
                paddingLeft: "0.5vw",
                paddingRight: "0.5vw"
              }} key={index} id={`i_${index}`}>{i.hp}</div>)}
            </Box>
        :
          <Box>
            <Text>{"Game Over!"}</Text>
            <Button onClick={() => setOver(false)}>
              <Text>Restart</Text>
            </Button>
          </Box>
      }
    </div>
  )
}

export default Home
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from 'next'

export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
      server: NetServer & {
        io: SocketIOServer;
      };
    };
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new SocketIOServer(res.socket.server as any, {
        path: "/api/ws",
    });
    res.socket.server.io = io
  }
  res.end()
}

export default SocketHandler
import { io } from "socket.io-client";

const resolveAuth = ()=>({
 token: localStorage.getItem("token") || undefined
});

export const socket = io(
 import.meta.env.VITE_SOCKET_URL ||
 "https://ornaq-backend-9m2y.onrender.com",
 {
   autoConnect:true,
   auth: resolveAuth()
 }
);

export const syncSocketAuth=()=>{
 socket.auth=resolveAuth();
 socket.disconnect().connect();
};
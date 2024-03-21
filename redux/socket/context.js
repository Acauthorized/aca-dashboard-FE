import { createContext, useEffect, useState, useContext, useRef } from "react";

import { toast } from "react-toastify";

//import socketIO from "socket.io-client";
import { io } from "socket.io-client";

import { APIURL } from "../baseURL";
const baseUrl = APIURL;

const StateContext = createContext();

const pro = //"https://jellyfish-app-as8az.ondigitalocean.app";
"https://dolphin-app-lu45l.ondigitalocean.app";
const dev = "http://localhost:3300";

export const StateContextProvider = ({ children }) => {
  const socket = io(
    pro,
 
{
  path: "/socket.io",
    rememberUpgrade: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
   // reconnectionDelay: 1000,
    //reconnectionDelayMax: 2000,
    randomizationFactor: 0.5,
    timeout: 3000,
  transports: ['websocket' ,"polling"]
}
    //  { path: "/socket.io", transports: ["websocket"] },
    // {
    //   reconnection: false,
    // }




  );



  // const socket = io(pro, {
  //   path: '/socket.io/',
  // //  transports: ["websocket"] ,

  //    transports: ["websocket", "polling"],
  //    rejectUnauthorized: false,
  //    allowRequest: (req, callback) => {
  //     callback(null, false);
  //   }
  //    //secure: true,
  //    //handshake: false,
  //   //   allowEIO3: true

  // }

  // );

  return (
    <StateContext.Provider value={{ socket }}>{children}</StateContext.Provider>
  );
};

export const useContextApp = () => {
  const context = useContext(StateContext);
  return context;
};

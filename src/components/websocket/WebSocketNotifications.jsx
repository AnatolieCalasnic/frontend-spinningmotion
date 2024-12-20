import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let stompClient = null;

const WebSocketNotifications = () => {
  useEffect(() => {
    const connect = () => {
      const socket = new SockJS('http://localhost:8080/ws');
      stompClient = Stomp.over(socket);
      
      stompClient.connect({}, () => {
        console.log('WebSocket Connected!');
        
        // Subscribe to authentication notifications
        stompClient.subscribe('/topic/auth', (notification) => {
          const message = JSON.parse(notification.body);
          
          // Choose toast type based on notification type
          const toastType = message.type.toLowerCase();
          toast(message.message, {
            type: toastType,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light"
          });
        });
      }, (error) => {
        console.error('WebSocket connection error:', error);
        // Attempt to reconnect after 5 seconds
        setTimeout(connect, 5000);
      });
    };

    connect();

    return () => {
      if (stompClient !== null && stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []);

  return null;
};

export default WebSocketNotifications;
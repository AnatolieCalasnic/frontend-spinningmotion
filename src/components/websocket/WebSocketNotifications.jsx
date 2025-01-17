import { useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let stompClient = null;
let reconnectTimeout = null;

const WebSocketNotifications = () => {
  const connect = useCallback(() => {
    if (stompClient !== null) {
      try {
        stompClient.disconnect();
      } catch (e) {
        console.error('Error disconnecting:', e);
      }
    }

    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);

    stompClient.heartbeat.outgoing = 5000;
    stompClient.heartbeat.incoming = 5000;
    stompClient.reconnect_delay = 2500;

    stompClient.connect({}, () => {
      console.log('WebSocket Connected!');
      
      // Subscribe to authentication notifications
      stompClient.subscribe('/topic/auth', (notification) => {
        const message = JSON.parse(notification.body);
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

      stompClient.subscribe('/topic/active-users', (message) => {
        const activeUsers = JSON.parse(message.body);
        window.dispatchEvent(new CustomEvent('activeUsersUpdate', { 
          detail: { count: activeUsers } 
        }));
      });
      stompClient.subscribe('/topic/inventory', (message) => {
        const inventoryData = JSON.parse(message.body);
        console.log('Received inventory update:', inventoryData); 
        window.dispatchEvent(new CustomEvent('inventoryUpdate', {
          detail: { inventory: inventoryData }
        }));
      });

      // Request initial active users count
      stompClient.send("/app/request-active-users", {}, "");
      stompClient.send("/app/request-inventory", {}, "");
    }, (error) => {
      console.error('WebSocket connection error:', error);
      reconnectTimeout = setTimeout(connect, 5000);
    });
  }, []);

  useEffect(() => {
    connect();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!stompClient?.connected) {
          connect();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (stompClient?.connected) {
        stompClient.disconnect();
      }
    };
  }, [connect]);

  return null;
};

export default WebSocketNotifications;
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function buildWsUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
  if (apiUrl.startsWith('/')) {
    // Relative URL = production behind nginx → use current origin
    return `${window.location.origin}/ws`;
  }
  // Absolute URL = local dev → swap /api for /ws
  return apiUrl.replace(/\/api$/, '/ws');
}

let client: Client | null = null;

export function getStompClient(): Client {
  if (!client) {
    client = new Client({
      webSocketFactory: () => new SockJS(buildWsUrl()),
      reconnectDelay: 5000,
    });
    client.activate();
  }
  return client;
}

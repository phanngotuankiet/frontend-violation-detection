import { io, Socket } from "socket.io-client";
import { QAEvent } from "../src/websocket/websocket.types";

class SocketService {
  private socket: Socket;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  constructor() {
    this.socket = io("http://localhost:3000", {
      withCredentials: true,
    });

    this.socket.on("qaEvent", (event: QAEvent) => {
      this.notifyListeners("qaEvent", event);
    });
  }

  public subscribe(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  public unsubscribe(event: string, callback: (data: any) => void) {
    const callbacks = this.listeners.get(event) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((callback) => callback(data));
  }
}

export const socketService = new SocketService();

import { useEffect } from "react";
import { socketService } from "../../api/socket.service";
import { QAEvent } from "../websocket/websocket.types";

export const useSocket = (callback: (event: QAEvent) => void) => {
  useEffect(() => {
    socketService.subscribe("qaEvent", callback);
    return () => {
      socketService.unsubscribe("qaEvent", callback);
    };
  }, [callback]);
};

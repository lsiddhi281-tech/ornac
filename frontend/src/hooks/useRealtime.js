import { useEffect } from "react";
import { socket } from "../services/socket";

export const useRealtime = ({ onStockUpdate, onOrderUpdate, onPaymentUpdate, userId }) => {
  useEffect(() => {
    if (userId) socket.emit("join:user", userId);
    if (onStockUpdate) socket.on("stock:updated", onStockUpdate);
    if (onOrderUpdate) {
      socket.on("order:status-updated", onOrderUpdate);
      socket.on("orderCreated", onOrderUpdate);
      socket.on("admin:order-updated", onOrderUpdate);
      socket.on("order:created", onOrderUpdate);
    }
    if (onPaymentUpdate) socket.on("paymentStatusUpdated", onPaymentUpdate);

    return () => {
      if (onStockUpdate) socket.off("stock:updated", onStockUpdate);
      if (onOrderUpdate) {
        socket.off("order:status-updated", onOrderUpdate);
        socket.off("orderCreated", onOrderUpdate);
        socket.off("admin:order-updated", onOrderUpdate);
        socket.off("order:created", onOrderUpdate);
      }
      if (onPaymentUpdate) socket.off("paymentStatusUpdated", onPaymentUpdate);
    };
  }, [onStockUpdate, onOrderUpdate, onPaymentUpdate, userId]);
};

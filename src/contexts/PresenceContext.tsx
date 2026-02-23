import { createContext, useContext } from "react";

interface PresenceContextType {
  isOnline: (id: string) => boolean;
}

export const PresenceContext = createContext<PresenceContextType>({
  isOnline: () => false,
});

export const usePresenceContext = () => useContext(PresenceContext);

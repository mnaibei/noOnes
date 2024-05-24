import { createContext } from "react";

export const UserContext = createContext<{ userInfo: any; logout: () => void }>(
  { userInfo: null, logout: () => {} }
);

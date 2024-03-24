import React from "react";
import { LoginProps } from "../utils/types";
import UserInfo from "./UserInfo";

export default function Dashboard({ token, setToken }: LoginProps) {
  return (
    <div className="w-full h-full px-10 pt-10">
      <UserInfo token={token} setToken={setToken} />
    </div>
  );
}

import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {

  const navigate = useNavigate();

  useEffect(() => {
    const adminSession = document.cookie.split("; ")
      ?.find((cookie) => cookie.startsWith("adminSession="))
      ?.split("=")[1];
    if (!adminSession) navigate("/admin/login");
  }, []);

  return (
    <div>
        <button onClick={() => fetch("http://116.203.53.136/api/admin/starttournament")}>Start Tournament</button>
        <button onClick={() => fetch("http://116.203.53.136/api/admin/newround")}>Start New Round</button>
        <button>Undo Last Round</button>
        <button>Change Result (Matchup, Round)</button>
        <button>Delete Player</button>
        <button>Player Inactive</button>
        <button>Rename Player</button>
        <button onClick={() => fetch("http://116.203.53.136/api/admin/resetdb")}>ResetDb</button>
        <button onClick={() => fetch("http://116.203.53.136/api/admin/cleardb")}>ClearDb</button>
    </div>
  )
}

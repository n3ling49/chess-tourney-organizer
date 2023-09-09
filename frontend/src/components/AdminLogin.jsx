import React, { useEffect } from 'react'
import styles from './Register.module.scss'
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

const navigate = useNavigate();

useEffect(() => {
    const adminSession = document.cookie.split("; ")
    ?.find((cookie) => cookie.startsWith("adminSession="))
    ?.split("=")[1];
    if (adminSession) navigate("/admin");
}, []);

function handleSubmit(e) {
    e.preventDefault();
    console.log(e.target.password.value);
  
    fetch("http://116.203.53.136/api/admin/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: e.target.password.value }),
    })
    .then((res) => {
    if(res.ok) navigate("/admin");
    })
}

  return (
    <div className={styles.container}>
      <form className={styles.register} method="post" onSubmit={handleSubmit}>
        <label htmlFor="password">Enter admin password:</label>
        <input type="password" name="password" id="password" required className={styles.input}/>
        <input type="submit" value="OK" className={styles.submit}/>
      </form>
    </div>
  )
}

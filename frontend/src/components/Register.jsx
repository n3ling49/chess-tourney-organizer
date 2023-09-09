import React, {useEffect} from "react";
import styles from "./Register.module.scss";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = document.cookie.split("; ")
      ?.find((cookie) => cookie.startsWith("session="))
      ?.split("=")[1];
    if (session) navigate("/");
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(e.target.name.value);
    fetch("http://116.203.53.136/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: e.target.name.value }),
    })
    .then((res) => {
      if(res.ok) navigate("/");
    })
  }

  return (
    <div className={styles.container}>
      <form className={styles.register} method="post" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name:</label>
        <input type="text" name="name" id="name" placeholder="John Doe" required className={styles.input}/>
        <input type="submit" value="OK" className={styles.submit}/>
      </form>
    </div>
  );
}

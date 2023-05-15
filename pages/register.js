import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from 'next/styles/Home.module.css'
import login from 'next/styles/Login.module.css'

import {useState, useEffect} from 'react';
import { useRouter } from 'next/router'



const inter = Inter({ subsets: ['latin'] })

//This is the login page for unauthenticated users
export default function Register() {
  const router = useRouter();
  const [formData, setFormdata] = useState({username: '',email: '', password:''})
  const [response_message, setResponse] = useState('')

  async function isGood (formData) {
    //Check if all the formData are OK. Only then should the func return True. Otherwise return False. 

    const result = await fetch ('/api/checkForm', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {'Content-Type' : 'application/json'}
    }); 
    const data = await result.json();
    if (result.status == 400) {
      console.log(data.response)
      setResponse(data.response);
      return false;
  }
  else {
    console.log(data.response)
    setResponse('');
    return true;
  }
}

  //This this changes the formData state when the user changes any of the input fields
  
  const handleChange = (event) => {
    setFormdata({ ...formData, [event.target.name]: event.target.value }); 
  };
  useEffect(() => {
    isGood(formData);
  }, [formData]);
 



  //This is the function that is called when the user submits the form
  const handleSubmit = async (event) => {
    event.preventDefault(); //Prevent the page from reloading
    const result = await fetch ('/api/register', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json'}
    });
    const data = await result.json();

    if (data.response == "granted") {
      router.push({
        pathname: '/',
        query: {login: true},
      })
    }
    else {
      alert("Fix the details fam")
    }
  }
  
  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
       
        <div className={styles.title}>
          <h1>
            Welcome Back
          </h1>
        </div>

       

        <form onSubmit={handleSubmit} className={login.form}>
            <input className={login.input}
            name="username"
            placeholder="Username"
            onChange={handleChange}
            />
            <input className={login.input}
            name="email"
            placeholder="Email"
            onChange={handleChange}
            />
            <input className={login.input}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            />
            <button type="submit" className={login.submit}>
                Register
            </button>
            <span className={login.error}>  {response_message} </span>
         

        </form>
      </main>
    </>
  )
}

import "./Login.css";
import React, { useState } from "react";
import {
  Redirect
} from "react-router-dom";
import axios from 'axios'
import Cookies from 'universal-cookie';

// "proxy": "http://localhost:8000"

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginOK, setLoginOK] = useState("req not send");
  const [formError, setFormError] = useState(false);

  const cookies = new Cookies();

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function handleLogin(e) {
    e.preventDefault();

    setLoginOK('req not send');

    if (validateForm()) {
      setFormError(false);
      // axios
      return axios.post(`/user/login`, {username: username, password: password})
        .then(
          response => {
            console.log(response.data);
            cookies.set('username', response.data.username, { path: '/', sameSite: true, maxAge: 2592000 });
            setLoginOK('success');
          },
          error => {
            console.log('An error occurred.', error)
            setLoginOK('fail');
          }
        );
    } else {
      setFormError(true);
    }
  }

  if (loginOK === 'success' || cookies.get('username') !== undefined) {
    window.location.href = '/';
    return null;
  } 
  else
    return (
      <div className="col-start-3 col-span-2 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500" id="username" 
            type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 mb-3" id="password" 
            type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </div>

        {
          formError &&
          <div className="text-red-500 mb-6">
            Error: To log in, please enter both username and password!
          </div>
        }

        {
          loginOK === 'fail' &&
          <div className="text-red-500 mb-6">
            Authentication error!
          </div>
        }

        <div className="flex items-center justify-between">
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" type="button" 
            onClick={handleLogin}>
            Log In
          </button>
          {/* <a className="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker" href="#">
            Forgot Password?
          </a> */}
        </div>
      </div>
    );
}

export function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isUsernameExist, setIsUsernameExist] = useState("req not send");
  const [signupOK, setSignupOK] = useState("req not send");
  const [formError, setFormError] = useState(false);

  const cookies = new Cookies();

  function validateUsername(value) {
    return axios.get(`/user/isusernameused/${value}`)
      .then(response => {
        console.log(response.data);
        setIsUsernameExist(response.data.isUsernameUsed? 'yes' : 'no');
        setUsername(value);
      },
      error => {
        console.log('An error occurred.', error)
      }
    );
  }

  function validatePassword() {
    return password2.length === 0 || password.length > 0 && password === password2;
  }

  function validateForm() {
    return isUsernameExist === 'no' && validatePassword();
  }
  
  function handleSignup(e) {
    e.preventDefault();

    setSignupOK('req not send');

    if (validateForm()) {
      setFormError(false);
      // axios
      return axios.post(`/user/signup`, {username: username, password: password})
        .then(
          response => {
            console.log(response.data);
            cookies.set('username', response.data.username, { path: '/', sameSite: true });
            setSignupOK('success');
          },
          error => {
            console.log('An error occurred.', error)
            setSignupOK('fail');
          }
        );
    } else {
      setFormError(true);
    }
  }

  if (signupOK === 'success' || cookies.get('username') !== undefined) {
    window.location.href = '/';
    return null;
  } 
  else
    return (
      <div className="col-start-3 col-span-2 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500" id="username" type="text" placeholder="Username" 
            onChange={(e) => validateUsername(e.target.value)} />

          {
            isUsernameExist === 'yes' &&
              <div className="text-red-500 mb-6">
                Username already exists!
              </div>
          }

        </div>
        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500" id="password" type="password" placeholder="Password" 
            onChange={(e) => (setPassword(e.target.value))} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="password">
            Confrim Password
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 mb-3" id="password2" type="password" placeholder="Password Again" 
            onChange={(e) => (setPassword2(e.target.value))}/>

          {
            !validatePassword() &&
              <div className="text-red-500 mb-6">
                Please make two passwords identical!
              </div>
          }

        </div>

        {
          formError &&
          <div className="text-red-500 mb-6">
            Error: make sure all fields are correct!
          </div>
        }

        {
          signupOK === 'fail' &&
          <div className="text-red-500 mb-6">
            Signup error!
          </div>
        }

        <div className="flex items-center justify-between">
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" type="button" 
            onClick={handleSignup}>
            Sign Up
          </button>
        </div>
      </div>
    );

}
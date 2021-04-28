import React, { useEffect, useState } from "react";
import axios from 'axios'
import Cookies from 'universal-cookie';
import './Settings.css';

export default function Settings() {
    const [isLoggedout, setIsLoggedout] = useState('req not send');

    const cookies = new Cookies();
    let username = cookies.get('username');

    function handleLogout(e) {
        e.preventDefault();

        return axios.post(`/user/logout`)
            .then(
                response => {
                    cookies.remove('username');
                    setIsLoggedout('success');
                },
                error => {
                    console.log('An error occurred.', error)
                    setIsLoggedout('fail');
                }
            );
    }

    if (isLoggedout === 'success' && username === undefined) {
        window.location.href = '/';
        return null;
    } 
    return (
        <div className="py-2 col-start-2 col-span-4">
            <h2>Your username: {username}</h2>
            {
                isLoggedout === 'fail' &&
                <div className="text-red-500 mb-6">
                  Logout error!
                </div>
            }
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-3" type="button" 
                onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
}
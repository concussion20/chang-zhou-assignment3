import React, { useEffect, useState } from "react";
import axios from 'axios'
import Cookies from 'universal-cookie';
import './Home.css';
import PostTitle from './PostTitle';

export default function Home() {
    const [posts, setPosts] = useState([]);

    const cookies = new Cookies();
    let username = cookies.get('username');
  
    useEffect(() => {
        return axios.get(`/post/`)
            .then(response => {
                console.log(response.data);
                setPosts(response.data);
            },
            error => console.log('An error occurred.', error));
    }, []);

    let postTitles = posts.map((post, i) => (
        <PostTitle key={i} _id={post._id} username={post.username} title={post.title} url={post.url} content={post.content} 
            created_at={post.created_at} hide_view_comment_btn={false} 
            hide_edit_del_btn={username === undefined || username !== post.username}
            hide_content={true} />
    ));
  
    return (
      <div className="py-2 col-start-2 col-span-4">
         {postTitles} 
      </div>
    );
}
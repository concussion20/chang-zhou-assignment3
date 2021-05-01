import "./CreatePost.css";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Redirect
} from "react-router-dom";
import axios from 'axios'

export default function CreatePost() {
    // form
    let { postId } = useParams();
    const [newPostId, setNewPostId] = useState(postId);
    const [post, setPost] = useState({});
    const [formError, setFormError] = useState(false);
    const [publishOK, setPublishOK] = useState("req not send");

    let urlRef;
    let detailsRef;
    let titleRef;

    useEffect(() => {
      if (postId) {
        return axios.get(`/post/${postId}`)
          .then(response => {
            console.log(response.data);
            setPost(response.data);
            // urlRef.value = post.url;
            // detailsRef.value = post.content;
            // titleRef.value = post.title;
          },
          error => console.log('An error occurred.', error));
      } 
    }, []);

    function validateUrlContent() {
      if ((urlRef.value.length > 0 && detailsRef.value.length > 0) || (urlRef.value.length === 0 && detailsRef.value.length === 0)) {
        setFormError(true)
        return false;
      } else {
        setFormError(false)
        return true;
      }
    }
    
    function validateForm() {
      return titleRef.value.length > 0 && validateUrlContent();
    }

    function handlePublish(e) {
      e.preventDefault();

      setPublishOK('req not send');
  
      if (validateForm()) {
        setFormError(false);
        // edit post
        if (postId) {
          let newPost = {
            _id: postId,
            title: titleRef.value,
            url:urlRef.value,
            content: detailsRef.value
          }
          return axios.put(`/post`, {post: newPost})
            .then(
              response => {
                console.log(response.data);
                setPublishOK('success');
                setNewPostId(response.data._id);
              },
              error => {
                console.log('An error occurred.', error)
                setPublishOK('fail');
              }
            );
        } 
        // add post
        else {
          let newPost = {
            title: titleRef.value,
            url:urlRef.value,
            content: detailsRef.value
          }
          return axios.post(`/post`, {post: newPost})
          .then(
            response => {
              console.log(response.data);
              setPublishOK('success');
              setNewPostId(response.data._id);
            },
            error => {
              console.log('An error occurred.', error)
              setPublishOK('fail');
            }
          );
        }
      } else {
        setFormError(true);
      }
    }

    if (publishOK === 'success' && newPostId !== undefined) {
      return (<Redirect to={{pathname: `/postdetail/${newPostId}`}} />);
    } 
    return (
      <div className="col-start-2 col-span-4">
        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500" id="title" 
            defaultValue={post.title ? post.title : ""} ref={ref => titleRef = ref} type="text" placeholder="Title"/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="url">
            URL
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500" id="url" 
            defaultValue={post.url ? post.url : ""} ref={ref => urlRef = ref} type="text" placeholder="URL" onChange={validateUrlContent} />
        </div>
        <div className={formError?'mb-4':'mb-6'}>
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="details">
            Details
          </label>
          <textarea className={`resize border rounded-md w-full h-40 ${formError?'':'mb-3'}`} id="details" 
            defaultValue={post.content ? post.content : ""} ref={ref => detailsRef = ref} onChange={validateUrlContent} />
        </div>

        {
          formError &&
          <div className="text-red-500 mb-6">
            Error: Please make sure all fields are correct. 
            <br />
            i.e. title can't be empty and can't set both url and details!
          </div>
        }

        <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" type="button"
          onClick={handlePublish}>
          Publish Post
        </button>
      </div>
    );
}
import "./Post.css";
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
import axios from 'axios';
import Cookies from 'universal-cookie';
import PostTitle from './PostTitle';
import Comment from './Comment';
// import {redirect, getLoggedinUsername} from './Loggedin';

export default function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [formError, setFormError] = useState(false);
  const [publishOK, setPublishOK] = useState("req not send");

  const cookies = new Cookies();
  let username = cookies.get('username');
  // let username = getLoggedinUsername();

  let commentRef;
  let commentElements;

  useEffect(() => {
    // load post
    axios.get(`/post/${postId}`)
      .then(response => {
        console.log(response.data);
        setPost(response.data);
      },
      error => console.log('An error occurred.', error));
    
    // load comments
    axios.get(`/comment/postid/${postId}`)
      .then(response => {
        console.log(response.data);
        setComments(response.data);
      },
      error => console.log('An error occurred.', error));
  }, [publishOK]);

  function validateNewComment() {
    return commentRef.value.length > 0 && commentRef.value.trim().length > 0;
  }

  function handleAddComment(e) {
    e.preventDefault();

    setPublishOK('req not send');
  
    if (validateNewComment()) {
      setFormError(false);
      // add comment
      let newComment = {
        post_id: postId,
        content: commentRef.value
      }
      commentRef.value = '';
      return axios.post(`/comment`, {comment: newComment})
        .then(
          response => {
            setPublishOK('success');
          },
          error => {
            console.log('An error occurred.', error)
            setPublishOK('fail');
          }
        );
    } else {
      setFormError(true);
    }
  }

  function handleDeleteComment(e, _id) {
    e.preventDefault();

    setPublishOK('req not send');

    return axios.delete(`/comment/${_id}`)
      .then(
        response => {
          console.log(response.data);
          setPublishOK('success');
        },
        error => {
          console.log('An error occurred.', error);
          setPublishOK('fail');
        }
      );
  }

  function validateUpdateComment(newContent) {
    return newContent.length > 0 && newContent.trim().length > 0;
  }

  function handleUpdateComment(e, _id, newContent) {
    e.preventDefault();

    setPublishOK('req not send');

    if (!validateUpdateComment(newContent)) {
      return false;
    } 

    // update comment
    let newComment = {
      _id: _id,
      content: newContent
    }
    return axios.put(`/comment`, {comment: newComment})
      .then(
        response => {
          console.log(response.data);
          setPublishOK('success');
          return true;
        },
        error => {
          console.log('An error occurred.', error)
          setPublishOK('fail');
          return true;
        }
      );
  }

  commentElements = comments.map((comment, i) => (
    <Comment key={i} _id={comment._id} username={comment.username} content={comment.content} created_at={comment.created_at}
      post_id={comment.post_id} hide_edit_del_btn={ username === undefined || username !== comment.username }
      handle_delete_comment_func={handleDeleteComment} handle_update_comment_func={handleUpdateComment} />
  ));

  // if (publishOK === 'success') {
  //   return (<Redirect to={{pathname: `/post/${postId}`}} />);
  // } 

  return (
    <div className="col-start-2 col-span-4">
      <PostTitle _id={post._id} username={post.username} title={post.title} url={post.url} content={post.content} 
        created_at={post.created_at} hide_view_comment_btn={true} 
        hide_edit_del_btn={ username === undefined || username !== post.username } 
        hide_content={false}/>
      {
        username &&
        <div className="mt-10 mb-28">
          <textarea className="resize border rounded-md w-1/2 h-40 mb-3" id="newcomment" 
            ref={ref => commentRef = ref} />
          {
            formError &&
            <div className="text-red-500 mb-6">
              Error: comment can't be all whitespace characters!
            </div>
          }
          <p>
            <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" type="button"
              onClick={handleAddComment}>
              Add Comment
            </button>
          </p>
        </div>
      }
      <p className="text-lg leading-7 text-gray-900 sm:text-lg sm:truncate mb-2">
        Comments:
      </p>
      <div className="col-start-2 col-span-4">
        {commentElements} 
      </div>
    </div>
  );
}
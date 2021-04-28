import './PostTitle.css';
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useParams
} from "react-router-dom";
import axios from 'axios';
// import Cookies from 'universal-cookie';

export default function PostTitle(props) {
  const [deleteOK, setDeleteOK] = useState("req not send");

  // const cookies = new Cookies();
  // let username = cookies.get('username');

  function handleDelete(e) {
    e.preventDefault();

    setDeleteOK('req not send');

    return axios.delete(`/post/${props._id}`)
      .then(
        response => {
          console.log(response.data);
          setDeleteOK('success');
        },
        error => {
          console.log('An error occurred.', error);
          setDeleteOK('fail');
        }
      );
  }

  if (deleteOK === 'success') {
    return (<Redirect to="/" />)
  } 

  console.log(props.content);
  console.log(typeof props.content);

  return (
    <div className="py-2 col-start-2 col-span-4 mb-6">
      <p className="text-lg leading-7 text-gray-900 sm:text-lg sm:truncate">
        {
          props.url ? <a href={props.url}>{props.title}</a> : <Link to={{pathname: `/postdetail/${props._id}`}}>{props.title}</Link>
        }
      </p>
      <span className="text-gray-500">
        &nbsp;&nbsp; by {props.username} | {props.created_at}
         {/* {props.numComments}  */}
        {
          !props.hide_view_comment_btn && <Link to={{pathname: `/postdetail/${props._id}`}} > | view comments </Link>
        }
      </span>
      <br />
      {
        !props.hide_content && !props.url && props.content &&
        <div className="mt-3">
          <p dangerouslySetInnerHTML={{__html: props.content.replaceAll('\n', '<br />')}} />
        </div>
      }
      {  
        !props.hide_edit_del_btn &&
        <div className="mt-3">
          <Link to={{pathname: `/editpost/${props._id}`}}>
            <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" type="button">
              Edit
            </button>
          </Link>
          &nbsp;&nbsp;&nbsp;
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" type="button" 
            onClick={handleDelete}>
            Delete
          </button>
        </div>
      }
    </div>
  )
}
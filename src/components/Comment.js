import "./Comment.css";
import React, { useState, useEffect } from "react";
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

export default function Comment(props) {
  // const [comment, setComment] = useState({...props});
  // const [deletePressed, setDeletePressed] = useState(false);
  // const [updateOK, setUpdateOK] = useState("req not send");
  const [formError, setFormError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  let commentRef;

  // useEffect(() => {
  //   // load comment
  //   axios.get(`/comment/commentid/${comment._id}`)
  //     .then(response => {
  //       // console.log(response.data);
  //       // console.log('load comment', response.data);
  //       setComment(response.data);
  //     },
  //     error => console.log('An error occurred.', error));
  // }, [updateOK]);

  // function handleDelete(e) {
  //   e.preventDefault();

  //   setDeleteOK('req not send');

  //   return axios.delete(`/comment/${props._id}`)
  //     .then(
  //       response => {
  //         console.log(response.data);
  //         setDeleteOK('success');
  //       },
  //       error => {
  //         console.log('An error occurred.', error);
  //         setDeleteOK('fail');
  //       }
  //     );
  // }

  // function validateNewComment() {
  //   return commentRef.value.length > 0 && commentRef.value.trim().length > 0;
  //   // return comment.length > 0 && comment.trim().length > 0;
  // }

  // function cancelUpdate() {
  //   setIsEditing(false);
  // }

  // function handleUpdate(e) {
  //   e.preventDefault();

  //   setUpdateOK('req not send');

  //   if (isEditing) {
  //     if (!validateNewComment()) {
  //       setFormError(true);
  //       return;
  //     } 
  //     setFormError(false);

  //     // update comment
  //     let newComment = {
  //       _id: comment._id,
  //       content: commentRef.value
  //     }
  //     return axios.put(`/comment`, {comment: newComment})
  //       .then(
  //         response => {
  //           console.log(response.data);
  //           cancelUpdate();
  //           setUpdateOK('success');
  //         },
  //         error => {
  //           console.log('An error occurred.', error)
  //           setUpdateOK('fail');
  //         }
  //       );
  //   } else {
  //     setIsEditing(true);
  //   }
  // }

  // if (deletePressed) {
  //   return null;
  //   // return (<Redirect to={{pathname: `/post/${comment.post_id}`}} />)
  // } 

//   function convertNewLine2UnicodeChar(myString) {
    
//     // console.log("sadsdsa" + String.fromCharCode(10));
//     // myString = myString.replace(/\r?\n/g, 'saddsfdsdsf');
//     // myString = myString.replace(/[\r\n]/g, String.fromCharCode(10));
//     myString = myString.replace('\\n', '<br>');
//     console.log(myString);
//     return myString;
//   }

  return (
    <div className="col-start-2 col-span-4 mb-3 ml-3">
      <span className="text-gray-500">
        by {props.username} | {props.created_at}
      </span>
      {
        isEditing ? 
          <p>
            <textarea className="resize border rounded-md w-1/2 h-40 mb-3" id="newcomment" 
              defaultValue={props.content} ref={ref => commentRef = ref} />
            {/* onChange={(e) => setComment(e.target.value)} */}
          </p>
          : 
          <p dangerouslySetInnerHTML={{__html: props.content.replaceAll('\n', '<br />')}} />
      }
      {
        formError &&
        <div className="text-red-500 mb-6">
          Error: comment can't be all whitespace characters!
        </div>
      }
      {  
        !props.hide_edit_del_btn &&
        <div className="mt-3">
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" type="button"
            onClick={isEditing ? 
            (e) => {
              if (!props.handle_update_comment_func(e, props._id, commentRef.value))
                setFormError(true);
              else {
                setFormError(false);
                setIsEditing(false);
              }
            }
            : (e) => {
              setIsEditing(true);
            }}>
            {isEditing ? 'Confirm' : 'Edit'}
          </button>
          &nbsp;&nbsp;&nbsp;
          {
            isEditing && 
            <span> 
              <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" type="button"
                onClick={(e) => setIsEditing(false)}>
                Cancel
              </button>
              &nbsp;&nbsp;&nbsp;
            </span>
          }
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" type="button" 
            onClick={(e) => {
              props.handle_delete_comment_func(e, props._id)
            }}>
            Delete
          </button>
        </div>
      }
    </div>
  );
}
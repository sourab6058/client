import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Button, Icon, Transition } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostorMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        const newData = data.getPosts.filter((p) => p.id !== postId);
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: {
              newData,
            },
          },
        });
      }
      if (callback) {
        callback();
      }
    },
    variables: {
      postId,
      commentId,
    },
  });

  const deleteBtnMarkup = confirmOpen ? (
    <>
      <p>Are You Sure?</p>
      <Button onClick={() => setConfirmOpen(false)}>NO</Button>
      <Button onClick={deletePostorMutation}>YES</Button>
    </>
  ) : (
    <Button color="red" floated="right" onClick={() => setConfirmOpen(true)}>
      <Icon name="trash" />
    </Button>
  );

  return <Transition.Group>{deleteBtnMarkup}</Transition.Group>;
}

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        body
        createdAt
      }
      commentsCount
    }
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default DeleteButton;

import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  Grid,
  Image,
  Button,
  Icon,
  Label,
  Form,
} from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import DeleteButton from "./deleteButton";
import LikeButton from "./likeButton";

function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;

  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    props.history.push("/");
  }

  let postMarkup;

  if (!data) {
    postMarkup = <p>Loding Post..</p>;
  } else {
    const {
      id,
      username,
      createdAt,
      body,
      likesCount,
      likes,
      commentsCount,
      comments,
    } = data.getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              floated="right"
              size="small"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likesCount }} />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log("Comment")}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>

                  <Label basic color="blue" pointing="left">
                    {commentsCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment..</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="comment.."
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === username && (
                    <DeleteButton postId={postId} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        username
        body
        createdAt
      }
      commentsCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      username
      body
      createdAt
      likesCount
      likes {
        id
        username
        createdAt
      }
      commentsCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;

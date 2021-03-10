import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likesCount
      likes {
        username
        createdAt
      }
      commentsCount
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

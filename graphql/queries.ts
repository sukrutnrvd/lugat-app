import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
      id
      username
      email
    }
  }
`;

export const DICTIONARIES = gql`
  query Dictionaries {
    dictionaries {
      id
      name
      words {
        id
        word
        tags
      }
    }
  }
`;

export const DICTIONARY = gql`
  query Dictionary($id: String!) {
    dictionary(id: $id) {
      id
      name
      words {
        id
        word
        tags
      }
    }
  }
`;

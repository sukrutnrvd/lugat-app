import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      success
      expiresAt
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!) {
    signup(user: { username: $username, email: $email }) {
      success
      expiresAt
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOtp($email: String!, $otp: String!) {
    verifyOtp(email: $email, otp: $otp) {
      success
      token
    }
  }
`;

export const DELETE_DICTIONARY = gql`
  mutation DeleteDictionary($id: String!) {
    deleteDictionary(id: $id) {
      id
      name
    }
  }
`;

export const CREATE_DICTIONARY = gql`
  mutation CreateDictionary($name: String!) {
    createDictionary(dictionary: { name: $name }) {
      id
      name
    }
  }
`;

export const UPDATE_DICTIONARY = gql`
  mutation UpdateDictionary($id: String!, $name: String!) {
    updateDictionary(id: $id, dictionary: { name: $name }) {
      id
      name
    }
  }
`;

export const CREATE_WORD = gql`
  mutation CreateWord($word: CreateWordInput!) {
    createWord(word: $word) {
      id
    }
  }
`;

export const DELETE_WORD = gql`
  mutation DeleteWord($id: String!) {
    deleteWord(wordId: $id) {
      id
    }
  }
`;

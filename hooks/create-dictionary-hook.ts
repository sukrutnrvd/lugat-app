import { CREATE_DICTIONARY } from "@/graphql/mutation";
import { useMutation } from "@apollo/client";

const useCreateDictionary = () => {
  return useMutation(CREATE_DICTIONARY);
};

export default useCreateDictionary;

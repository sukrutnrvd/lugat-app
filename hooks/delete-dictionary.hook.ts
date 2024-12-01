import { DELETE_DICTIONARY } from "@/graphql/mutation";
import { useMutation } from "@apollo/client";

const useDeleteDictionary = () => {
  return useMutation(DELETE_DICTIONARY);
};

export default useDeleteDictionary;

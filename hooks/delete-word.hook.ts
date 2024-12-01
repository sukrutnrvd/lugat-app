import { DELETE_WORD } from "@/graphql/mutation";
import { useMutation } from "@apollo/client";

const useDeleteWord = () => {
  return useMutation(DELETE_WORD);
};

export default useDeleteWord;

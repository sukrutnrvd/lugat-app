import { CREATE_WORD } from "@/graphql/mutation";
import { useMutation } from "@apollo/client";

const useCreateWord = () => {
  return useMutation(CREATE_WORD);
};

export default useCreateWord;

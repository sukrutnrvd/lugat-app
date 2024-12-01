import { UPDATE_DICTIONARY } from "@/graphql/mutation";
import { useMutation } from "@apollo/client";

const useUpdateDictinary = () => {
  return useMutation(UPDATE_DICTIONARY);
};

export default useUpdateDictinary;

import { DICTIONARY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";

const useDictionary = (id: string) => {
  const { loading, data, error, refetch } = useQuery(DICTIONARY, {
    variables: {
      id,
    },
  });
  return { loading, dictionary: data?.dictionary, error, refetch };
};

export default useDictionary;

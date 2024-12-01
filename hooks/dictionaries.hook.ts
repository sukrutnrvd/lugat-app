import { DICTIONARIES } from "@/graphql/queries";
import { useQuery } from "@apollo/client";

const useDictionaries = () => {
  const { data, error, loading, refetch } = useQuery(DICTIONARIES);
  return { dictionaries: data?.dictionaries, error, loading, refetch };
};

export default useDictionaries;

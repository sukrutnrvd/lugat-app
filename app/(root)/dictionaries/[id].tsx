import { Alert, Button, Text, View } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import {
  Link,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import React, { useEffect } from "react";

import useDeleteWord from "@/hooks/delete-word.hook";
import useDictionary from "@/hooks/dictionary.hook";

const Dictionary = () => {
  const { id } = useLocalSearchParams();
  const { dictionary, error, loading, refetch } = useDictionary(id as string);
  const [deleteWord] = useDeleteWord();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      title: `Dictionary: ${dictionary?.name}`,
      headerRight: () => (
        <View className="gap-2 flex-row">
          <Button
            title="Add Word"
            onPress={() => {
              router.push(`/create-word?dictionaryId=${id}`);
            }}
          />
        </View>
      ),
    });
  }, [dictionary, loading, error]);

  const createDeleteAlert = (wordId: string) => {
    Alert.alert("Delete Word", "Are you sure you want to delete this word?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        style: "destructive",
        text: "Delete",
        onPress: () => handleDeleteWord(wordId),
      },
    ]);
  };

  const handleDeleteWord = async (wordId: string) => {
    const response = await deleteWord({
      variables: {
        id: wordId,
      },
    });

    if (response.data?.deleteWord) {
      await refetch();
    }
  };

  return (
    <View className="flex flex-row gap-4 flex-wrap p-4">
      {dictionary?.words.map((word: any) => (
        <View
          className="p-4 flex-row justify-between bg-white rounded-lg shadow-md w-full"
          key={word.id}
        >
          <View className="gap-2">
            <Text className="text-lg font-bold">{word.word}</Text>
            {word.tags.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {word.tags.map((tag: string, index: number) => (
                  <View
                    className="bg-gray-200 px-2 py-1 rounded-full"
                    key={index}
                  >
                    <Text className="text-sm text-gray-700">{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          <View className="absolute top-2 right-2 flex-row gap-2">
            <Link href={`/word/update-word/${word.id}`}>
              <AntDesign name="edit" size={24} color="black" />
            </Link>
            <Entypo
              name="trash"
              size={24}
              color="red"
              onPress={() => createDeleteAlert(word.id)}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default Dictionary;

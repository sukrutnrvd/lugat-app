import {
  Alert,
  Modal,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import AntDesign from "@expo/vector-icons/AntDesign";
import Dialog from "react-native-dialog";
import Entypo from "@expo/vector-icons/Entypo";
import { Link } from "expo-router";
import React from "react";
import useCreateDictionary from "@/hooks/create-dictionary-hook";
import useDeleteDictionary from "@/hooks/delete-dictionary.hook";
import useDictionaries from "@/hooks/dictionaries.hook";
import useUpdateDictinary from "@/hooks/update-dictionary-hook";

export default function HomeScreen() {
  const { dictionaries, error, loading, refetch } = useDictionaries();
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = React.useState(false);
  const [deleteDictionary] = useDeleteDictionary();
  const [createDictionary] = useCreateDictionary();
  const [updateDictionary] = useUpdateDictinary();
  const [dictionaryId, setDictionaryId] = React.useState("");

  const [dictionaryName, setDictionaryName] = React.useState("");
  const [name, setName] = React.useState("");

  const createDeleteAlert = (id: string) => {
    Alert.alert(
      "Delete Dictionary",
      "Are you sure you want to delete this dictionary?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          style: "destructive",
          text: "Delete",
          onPress: () => handleDelete(id),
        },
      ]
    );
  };

  const handleDelete = async (id: string) => {
    const { data: response } = await deleteDictionary({
      variables: {
        id,
      },
    });
    if (response?.deleteDictionary?.id) await refetch();
  };

  const handleCreate = async () => {
    const { data: response } = await createDictionary({
      variables: {
        name,
      },
    });
    if (response?.createDictionary?.id) {
      await refetch();
      setIsDialogVisible(false);
    }
  };

  const handleUpdate = async (dictionaryId: string) => {
    const id = dictionaries.find(
      (dictionary: any) => dictionary.id === dictionaryId
    ).id;

    const { data: response, errors } = await updateDictionary({
      variables: {
        id,
        name: dictionaryName,
      },
    });

    if (response?.updateDictionary?.id) {
      await refetch();
      setIsEditDialogVisible(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View className="p-3">
          {loading && <Text>Loading...</Text>}

          {error && <Text>Error: {error.message}</Text>}

          {!dictionaries && dictionaries?.lenght === 0 && !loading && (
            <Text>No dictionaries found</Text>
          )}

          {dictionaries && (
            <View className="flex-row gap-1 flex-wrap items-center">
              {dictionaries.map((dictionary: any) => (
                <View
                  key={dictionary.id}
                  className="bg-white rounded-lg p-4 my-2 shadow w-max"
                >
                  <View className="flex-row gap-1 items-center justify-end">
                    <Entypo
                      onPress={() => createDeleteAlert(dictionary.id)}
                      name="trash"
                      size={20}
                      color="#b91c1c"
                    />
                    <AntDesign
                      onPress={() => {
                        setIsEditDialogVisible(true);
                        setDictionaryId(dictionary.id);
                      }}
                      name="edit"
                      size={20}
                      color="black"
                    />
                  </View>
                  <Link href={`/dictionaries/${dictionary.id}`}>
                    <Text className="text-lg font-bold mb-2">
                      {dictionary.name}
                    </Text>
                  </Link>
                </View>
              ))}

              <Pressable onPress={() => setIsDialogVisible(true)}>
                <View
                  className="w-14 h-14 rounded-full
                  bg-white flex items-center justify-center shadow"
                >
                  <AntDesign name="plus" size={20} color="black" />
                </View>
              </Pressable>
            </View>
          )}
        </View>
        <Dialog.Container
          visible={isDialogVisible}
          onBackdropPress={() => setIsDialogVisible(false)}
          onRequestClose={() => setIsDialogVisible(false)}
        >
          <Dialog.Title
            style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}
          >
            Add Dictionary
          </Dialog.Title>
          <Dialog.Description
            style={{ color: "#000", fontSize: 16, fontWeight: "normal" }}
          >
            Enter the name of the dictionary
          </Dialog.Description>
          <Dialog.Input
            style={{ color: "#000", fontSize: 16, fontWeight: "normal" }}
            className="text-gr"
            onChangeText={(text) => setName(text)}
            label="Dictionary name"
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => setIsDialogVisible(false)}
          />
          <Dialog.Button label="Add" onPress={handleCreate} />
        </Dialog.Container>

        <Dialog.Container
          visible={isEditDialogVisible}
          onBackdropPress={() => setIsEditDialogVisible(false)}
          onRequestClose={() => setIsEditDialogVisible(false)}
        >
          <Dialog.Title
            style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}
          >
            Edit Dictionary
          </Dialog.Title>
          <Dialog.Description
            style={{ color: "#000", fontSize: 16, fontWeight: "normal" }}
          >
            Enter the name of the dictionary
          </Dialog.Description>
          <Dialog.Input
            style={{ color: "#000", fontSize: 16, fontWeight: "normal" }}
            onChangeText={(text) => setDictionaryName(text)}
            defaultValue={
              dictionaries?.find(
                (dictionary: any) => dictionary.id === dictionaryId
              )?.name
            }
            label="Dictionary name"
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => setIsEditDialogVisible(false)}
          />
          <Dialog.Button
            label="Update"
            onPress={() => handleUpdate(dictionaryId)}
          />
        </Dialog.Container>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

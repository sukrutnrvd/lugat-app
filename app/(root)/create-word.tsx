import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";

import Entypo from "@expo/vector-icons/Entypo";
import useCreateWord from "@/hooks/create-word.hook";

interface CreateWordForm {
  word: string;
  meanings?: {
    meaning: string;
    example: string;
  }[];
  tagInput?: string;
  tags?: { tag: string }[];
}

const CreateWordScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [createWord] = useCreateWord();

  const param = useGlobalSearchParams();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateWordForm>({
    defaultValues: {
      word: "",
      meanings: [],
      tags: [],
      tagInput: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "meanings",
  });

  const tagInput = watch("tagInput");

  const {
    fields: tagFields,
    remove: removeTag,
    append: appendTag,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const onSubmit = async (data: CreateWordForm) => {
    const response = await createWord({
      variables: {
        word: {
          dictionaryId: param.dictionaryId as string,
          word: data.word,
          meanings: data.meanings,
          tags: data.tags?.map((tag) => tag.tag),
        },
      },
    });
    console.log(response);

    if (response.data?.createWord) {
      router.push(`/dictionaries/${param.dictionaryId}`);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: "Create Word",
      headerRight: () => (
        <Button title="Save" onPress={handleSubmit(onSubmit)} />
      ),
    });
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="w-screen">
        <ScrollView>
          <View className="p-4 grid gap-y-4">
            <Controller
              control={control}
              name="word"
              rules={{
                required: "Word is required",
                pattern: {
                  value: /^[a-zA-Z]+$/,
                  message: "Word must be a string",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    className="bg-white p-4 rounded-lg border border-gray-300"
                    placeholder="Enter word"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.word && (
                    <Text className="text-red-500 mt-1">
                      {errors.word.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <View className="flex-row gap-4 items-center">
              <Controller
                control={control}
                name="tagInput"
                rules={{
                  maxLength: {
                    value: 20,
                    message: "Tag must be less than 20 characters",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="w-[75%]">
                    <TextInput
                      className="bg-white w-max p-4 rounded-lg border border-gray-300"
                      placeholder="Enter tags"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.tagInput && (
                      <Text className="text-red-500 mt-1">
                        {errors.tagInput.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              <View>
                <Button
                  onPress={() => {
                    if (!tagInput) return;
                    appendTag({ tag: tagInput! });
                    setValue("tagInput", "");
                  }}
                  title="Add Tag"
                />
              </View>
            </View>
            <View className="flex-row gap-4 flex-wrap">
              {tagFields.map((field, index) => (
                <View
                  className="p-2 bg-gray-100 items-center rounded-md flex-row gap-2"
                  key={field.id}
                >
                  <Text>{field.tag}</Text>
                  <Entypo
                    onPress={() => removeTag(index)}
                    name="cross"
                    size={24}
                    color="black"
                  />
                </View>
              ))}
            </View>
            {fields.map((field, index) => (
              <View className="gap-2 justify-end" key={field.id}>
                <Controller
                  control={control}
                  name={`meanings.${index}.meaning`}
                  rules={{
                    required: "Meaning is required",
                    pattern: {
                      value: /^[a-zA-Z]+$/,
                      message: "Meaning must be a string",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <TextInput
                        className="bg-white p-4 rounded-lg border border-gray-300"
                        placeholder="Enter meaning"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                      {errors.meanings?.[index]?.meaning && (
                        <Text className="text-red-500 mt-1">
                          {errors.meanings[index].meaning.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name={`meanings.${index}.example`}
                  rules={{
                    required: "Example is required",
                    pattern: {
                      value: /^[a-zA-Z]+$/,
                      message: "Example must be a string",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <TextInput
                        className="bg-white p-4 rounded-lg border border-gray-300"
                        placeholder="Enter example"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                      {errors.meanings?.[index]?.example && (
                        <Text className="text-red-500 mt-1">
                          {errors.meanings[index].example.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Button
                  color={"red"}
                  title="Remove"
                  onPress={() => remove(index)}
                />
              </View>
            ))}

            <Button
              title="Add Meaning"
              onPress={() => {
                append({ meaning: "", example: "" });
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default CreateWordScreen;

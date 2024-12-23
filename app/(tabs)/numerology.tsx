import Container from "@/components/container";
import Text from "@/components/ui/text";
import { View, TextInput, Pressable, ScrollView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { numerologyType } from "@/types/numerology";

// Custom date validation function
const isValidDate = (dateString: string) => {
  // Check if the date matches the format YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) {
    return false;
  }

  // Check if the date is a valid date
  const date = new Date(dateString);
  const [year, month, day] = dateString
    .split("-")
    .map((num) => parseInt(num, 10));

  // Check if the date is valid by comparing input to the constructed Date
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

const validationSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("First Name is required"),
  last_name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Last Name is required"),
  birthdate: Yup.string()
    .required("Date of Birth is required")
    .test(
      "is-valid-date",
      "Invalid date format or non-existent date",
      (value) => isValidDate(value),
    ),
});

// Function to auto-format the date input as YYYY-MM-DD
const formatDate = (text: string) => {
  // Remove all non-numeric characters
  let formattedText = text.replace(/\D/g, "");

  // Add dash after the year (4 digits)
  if (formattedText.length > 4) {
    formattedText = `${formattedText.slice(0, 4)}-${formattedText.slice(4)}`;
  }

  // Add dash after the month (2 digits)
  if (formattedText.length > 7) {
    formattedText = `${formattedText.slice(0, 7)}-${formattedText.slice(7, 9)}`;
  }

  return formattedText;
};

interface FormValues {
  first_name: string;
  last_name: string;
  birthdate: string;
}

export default function Numerology() {
  const initialValues: FormValues = {
    first_name: "",
    last_name: "",
    birthdate: "",
  };
  const [data, setData] = useState<numerologyType | null>(null);

  const onSubmit = async (values: FormValues) => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/data/astro/numerology/interpretations?token=${process.env.EXPO_PUBLIC_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      },
    );
    const data = await response.json();
    if (data) {
      setData(data);
    }
  };

  return (
    <Container>
      <ScrollView className="flex-1">
        <Text className="text-3xl font-bold text-center p-4">Numerology</Text>
        <View className="p-4 flex-1 pt-8">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
              resetForm,
            }) => (
              <View className="flex-1 gap-4">
                <View className="gap-2">
                  <Text>First Name</Text>
                  <TextInput
                    className="border border-gray-300 h-16 px-3 rounded-lg w-full text-white placeholder:text-gray-500"
                    onChangeText={handleChange("first_name")}
                    onBlur={handleBlur("first_name")}
                    value={values.first_name}
                    placeholder="John"
                  />
                  {touched.first_name && errors.first_name && (
                    <Text className="text-red-500">{errors.first_name}</Text>
                  )}
                </View>

                <View className="gap-2">
                  <Text>Last Name</Text>
                  <TextInput
                    className="border border-gray-300 h-16 px-3 rounded-lg w-full text-white placeholder:text-gray-500"
                    onChangeText={handleChange("last_name")}
                    onBlur={handleBlur("last_name")}
                    value={values.last_name}
                    placeholder="Doe"
                  />
                  {touched.last_name && errors.last_name && (
                    <Text className="text-red-500">{errors.last_name}</Text>
                  )}
                </View>

                <View className="gap-2">
                  <Text>Date of Birth</Text>
                  <TextInput
                    className="border border-gray-300 h-16 px-3 rounded-lg w-full text-white placeholder:text-gray-500"
                    // onChangeText={handleChange("birthdate")}
                    onChangeText={(text) => {
                      const formattedDate = formatDate(text);
                      setFieldValue("birthdate", formattedDate);
                    }}
                    onBlur={handleBlur("birthdate")}
                    value={values.birthdate}
                    placeholder="YYYY-MM-DD"
                    keyboardType="numeric"
                  />
                  {touched.birthdate && errors.birthdate && (
                    <Text className="text-red-500">{errors.birthdate}</Text>
                  )}
                </View>
                <Pressable
                  className="p-4 px-16 rounded-xl border border-primary bg-primary/70 active:bg-primary/80"
                  onPress={() => handleSubmit()}
                >
                  <Text className="text-center">Get Result</Text>
                </Pressable>
                <Pressable
                  className=""
                  onPress={() => {resetForm(); setData(null);}}
                >
                  <Text className="text-center">Reset</Text>
                </Pressable>
              </View>
            )}
          </Formik>
          {data && (
            <View className="p-4">
              <Text className="text-3xl font-semibold mt-4">{data.title}</Text>
              <Text className="text-lg mt-4">{data.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Container>
  );
}

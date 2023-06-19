import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_IP } from "@env";

const Login = () => {
  // if token exists navigate to home
  const value = AsyncStorage.getItem("token")
    .then((value) => {
      if (value) {
        navigation.navigate("Home");
      }
      return value;
    })
    .catch((error) => {
      console.log(error);
    });

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [wrongInfo, setWrongInfo] = useState("");
  const [somethingWrong, setSomethingWrong] = useState(false);
  const [wrong, setWrong] = useState(false);

  const navigation = useNavigation();

  const handleLogin = async () => {
    
    try {
      const response = await fetch(`http://${API_IP}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });
      const data = await response.json();
      
      if (!data.token) {
        throw data;
      }

      //save token to async storage
      await AsyncStorage.setItem("token", data.token);
      //navigate to home
      navigation.navigate("Home");
      setWrongInfo("");
      setSomethingWrong(false);
      setWrong(false);
    } catch (error) {
      console.log(error);
      if (error.status === 422 || error.status === 401) {
        setWrongInfo(error.message);
        setSomethingWrong(false);
        setWrong(true);
      } else if (error.status === 500) {
        setWrongInfo("");
        setSomethingWrong(true);
        setWrong(false);
      }
    }
  };

  //render login screen
  return (
    <KeyboardAvoidingView style={styles.container}>
      {wrong && <Text style={styles.wrong}>{wrongInfo}</Text>}
      {somethingWrong && (
        <Text style={styles.wrong}>Something went wrong please try again</Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="User Name"
          value={userName}
          onChangeText={(text) => setUserName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.haveAccount}>
          Don't have an account?
          <TouchableOpacity>
            <Text
              style={styles.haveAccountLink}
              onPress={() => navigation.navigate("SignUp")}
            >
              {" "}
              Sign Up
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  haveAccount: {
    fontWeight: "400",
    fontSize: 14,
    marginTop: 10,
  },
  haveAccountLink: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 14,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  wrong: {
    color: "red",
    fontWeight: "400",
    fontSize: 14,
    marginBottom: 10,
  },
});

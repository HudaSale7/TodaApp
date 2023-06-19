import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/core";
import { API_IP } from "@env";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

const Home = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [somethingWrong, setSomethingWrong] = useState(false);
  const navigation = useNavigation();
  //handle logout
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity>
          <Text
            onPress={() => {
              AsyncStorage.removeItem("token").then(() =>
                navigation.navigate("Login")
              );
            }}
            style={{ color: "red", marginRight: 10, fontWeight: "700" }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  //fetch all todos
  useEffect(() => {
    fetchToDo();
  }, []);

  //add todo
  const handleAddTodo = async () => {
    if (todo.length > 0) {
      try {
        
        //get token from async storage
        const token = await AsyncStorage.getItem("token");
        //send request to add todo
        const response = await fetch(`http://${API_IP}/task/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ content: todo }),
        });
        let data = await response.json();
        if (!response.ok) {
          throw data;
        }

        fetchToDo();
      } catch (error) {
        setSomethingWrong(true);
        console.log(error);
      }
    }
  };

  //fetch all todos from server and set state to todos
  const fetchToDo = async () => {
    try {
      //get token from async storage
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://${API_IP}/task/all`, {
        method: "GET",
        headers: {
          token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      //set todos state
      setTodos(data.tasks);
      setTodo("");
      setSomethingWrong(false);
    } catch (error) {
      setSomethingWrong(true);
      console.log(error);
    }
  };

  //delete todo
  const handleDeleteTodo = async (id) => {
    //remove todo from state to update ui
    setTodos(todos.filter((todo) => todo.id !== id));
    try {
      //get token from async storage
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://${API_IP}/task/delete/${id}`, {
        method: "DELETE",
        headers: {
          token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }

      fetchToDo();
    } catch (error) {
      setSomethingWrong(true);
      console.log(error);
    }
  };

  //mark todo as completed
  const handleComplete = async (id) => {
    //update todo in state to update ui
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    );
    try {
      // get token from async storage
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://${API_IP}/task/complete/${id}`, {
        method: "PUT",
        headers: {
          token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      fetchToDo();
    } catch (error) {
      setSomethingWrong(true);
      console.log(error);
    }
  };
  //render todo list
  return (
    <View style={styles.container}>
      {somethingWrong && (
        <Text style={styles.haveAccountLink}>
          Something went wrong please try again
        </Text>
      )}
      <View style={styles.addTodo}>
        <TextInput
          style={styles.input}
          placeholder="Add todo"
          onChangeText={(text) => setTodo(text)}
          value={todo}
        />
        <TouchableOpacity style={styles.btn} onPress={handleAddTodo}>
          <Text style={styles.textBtn}>ADD</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.list}
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todo}>
            <Checkbox
              value={item.completed}
              onValueChange={() => handleComplete(item.id)}
              style={styles.checkbox}
              color={item.completed ? "#0782F9" : undefined}
            />
            <Text style={styles.todoText}>{item.content}</Text>
            <Button title="Delete" onPress={() => handleDeleteTodo(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default Home;

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  addTodo: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
    gap: 10,
  },
  btn: {
    width: "20%",
    height: 50,
    backgroundColor: "#0782F9",
    borderRadius: 5,
  },
  textBtn: {
    color: "#fff",
    fontWeight: "700",
    padding: 14,
    textAlign: "center",
  },
  input: {
    width: "75%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  list: {
    width: "100%",
  },
  todo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  todoText: {
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    margin: 8,
    color: "#ccc",
  },
});

import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./color";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";
const IS_WORKING = "working";
export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [done, setDone] = useState(false);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    loadToDos();
  }, []);
  const travel = async () => {
    setWorking(false);
    await AsyncStorage.setItem(IS_WORKING, JSON.stringify("travel"));
  };
  const work = async () => {
    setWorking(true);
    await AsyncStorage.setItem(IS_WORKING, JSON.stringify("work"));
  };
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
    const isWorking = await AsyncStorage.getItem(IS_WORKING);
    if (JSON.parse(isWorking) === "work") setWorking(true);
    else setWorking(false);
  };

  const addTodo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = { ...toDos, [Date.now()]: { text, working, done, edit } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setDone(false);
    setEdit(false);
    setText("");
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
    return;
  };
  const doneToDo = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].done = !newToDos[key].done;
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  const editText = (key, payload) => {
    const newToDos = { ...toDos };
    newToDos[key].text = payload;
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  const editToDo = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].edit = !newToDos[key].edit;
    setToDos(newToDos);
    saveToDos(newToDos);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.grey : "white" }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder={working ? "Add a To Do" : "Where do want to go?"}
        returnKeyType="done"
        onChangeText={onChangeText}
        value={text}
        onSubmitEditing={addTodo}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <View style={styles.leftContent}>
                <TouchableOpacity onPress={() => doneToDo(key)}>
                  {toDos[key].done ? (
                    <Fontisto name="checkbox-active" size={20} color="black" />
                  ) : (
                    <Fontisto name="checkbox-passive" size={20} color="black" />
                  )}
                </TouchableOpacity>
                {toDos[key].edit ? (
                  <TextInput
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      height: 21.7,
                    }}
                    value={toDos[key].text}
                    autoFocus={true}
                    returnKeyType="done"
                    onChangeText={(payload) => editText(key, payload)}
                    onSubmitEditing={() => editToDo(key)}
                  />
                ) : (
                  <Text
                    style={toDos[key].done ? styles.doneText : styles.toDoText}
                  >
                    {toDos[key].text}
                  </Text>
                )}
              </View>
              <View style={styles.icons}>
                <TouchableOpacity onPress={() => editToDo(key)}>
                  <FontAwesome
                    name="pencil"
                    size={18}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color={theme.grey} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  doneText: {
    color: theme.grey,
    fontSize: 16,
    textDecorationLine: "line-through",
    marginLeft: 10,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

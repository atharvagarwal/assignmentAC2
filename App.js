import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "./utils/Api";

const RenderCard = ({ item, onClick, deleteUser }) => (
  <TouchableOpacity onPress={() => onClick(item.id)} style={styles.card}>
    <Text style={styles.cardText}>Name: {item.employee_name}</Text>
    <Text style={styles.cardText}>Salary: {item.employee_salary}</Text>
    <Text style={styles.cardText}>Age: {item.employee_age}</Text>
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        deleteUser(item.id);
      }}
    >
      <Text style={styles.addButtonText}>Delete</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function App() {
  const [data, setData] = useState([]);
  const [employee, setEmployee] = useState({
    name: "",
    salary: "",
    age: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  const getData = async () => {
    try {
      const data = await api.get("/employees");
      setData(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addEmployee = async () => {
    try {
      if (isUpdate) {
        await updateEmployee();
        return;
      }
      const data = await api.post("/create", {
        name: employee.name,
        salary: employee.salary,
        age: employee.age,
      });
      console.log(data);
      Alert.alert("Success", "Employee added successfully");
      closeModal();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
      closeModal();
    }
  };

  const updateEmployee = async () => {
    try {
      const data = await api.put("/update/" + updateId, {
        name: "test",
        salary: "123",
        age: "23",
      });
      Alert.alert("Success", "Employee updated successfully");
      closeModal();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
      closeModal();
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setIsUpdate(false);
    setUpdateId(null);
  };

  const handleInputChange = (field, value) => {
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [field]: value,
    }));
  };

  const deleteUser = async (id) => {
    try {
      const data = await api.delete("/delete/" + id);
      Alert.alert("Success", "Employee deleted successfully");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{ display: "flex", flexDirection: "row", gap: 20, padding: 10 }}
      >
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            openModal();
          }}
        >
          <Text style={styles.addButtonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text
            style={{
              fontSize: 26,
              marginBottom: 20,
              color: "white",
              fontWeight: "bold",
            }}
          >
            {isUpdate ? "Update Employee" : "Add Employee"}
          </Text>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={employee.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Salary"
              value={employee.salary}
              onChangeText={(text) => handleInputChange("salary", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={employee.age}
              onChangeText={(text) => handleInputChange("age", text)}
            />
            <TouchableOpacity style={styles.saveButton} onPress={addEmployee}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        style={{ width: "80%" }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RenderCard
            item={item}
            onClick={(id) => {
              setIsUpdate(true);
              setUpdateId(id);
              openModal();
            }}
            deleteUser={deleteUser}
          />
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    paddingTop: 50,
  },
  addButton: {
    backgroundColor: "#2B2730",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: "blue",
    width:70,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlign:"center",
    alignSelf:"center"
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#2B2730",
    color:"white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    alignSelf: "center",
    elevation: 3,
  },
  cardText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2B2730",
  },
  modalContent: {
    backgroundColor: "#2B2730",
    color:"white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
  },
  input: {
    borderWidth: 1,
    color: "white",
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    width:100,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlign:"center",
    alignSelf:"center"
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    width:100,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlign:"center",
    alignSelf:"center"
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

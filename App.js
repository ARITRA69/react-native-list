import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Table from "./components/Table";
import { DataProvider } from "./context/DataContext";
export default function App() {
  return (
    <DataProvider>
      <LinearGradient colors={["#050505", "#15003b"]} style={styles.container}>
        <Text style={styles.heading}>MEMBERS LIST</Text>
        <Table />
      </LinearGradient>
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "transparent",
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    paddingTop: 40,
  },
});

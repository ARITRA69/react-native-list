import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { DataContext } from "../context/DataContext";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { filterData } from "../utils/SearchUtils";

const TableRow = ({ rowData, handleCheckbox }) => (
  <View style={styles.row}>
    <TouchableOpacity
      onPress={() => handleCheckbox(rowData.id)}
      style={{ paddingLeft: 14 }}
    >
      {rowData.checked ? (
        <AntDesign name="checkcircle" size={24} color="#2866d7" />
      ) : (
        <Feather name="circle" size={24} color="#2866d7" />
      )}
    </TouchableOpacity>
    <Text style={styles.cell}>{rowData.id}</Text>
    <Text style={styles.cell}>{rowData.name}</Text>
    <Text style={styles.cell}>{rowData.email}</Text>
    <Text style={styles.cell}>{rowData.role}</Text>
  </View>
);

const Table = () => {
  const { members } = useContext(DataContext);
  const [displayedMembers, setDisplayedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    paginateData(members);
  }, [members, page]);

  useEffect(() => {
    const filteredData = filterData(members, searchQuery);
    paginateData(filteredData);
  }, [searchQuery]);

  const paginateData = (data) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);
    setDisplayedMembers(paginatedData);
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const goToFirstPage = () => {
    setPage(1);
  };

  const goToLastPage = () => {
    const totalPages = Math.ceil(members.length / itemsPerPage);
    setPage(totalPages);
  };

  const handleCheckbox = (id) => {
    const updatedDisplayedMembers = displayedMembers.map((member) =>
      member.id === id ? { ...member, checked: !member.checked } : member
    );
    setDisplayedMembers(updatedDisplayedMembers);

    const updatedCheckedItems = updatedDisplayedMembers.filter(
      (member) => member.checked
    );
    setCheckedItems(updatedCheckedItems);
  };

  const handleDelete = () => {
    const updatedMembers = members.filter(
      (member) => !checkedItems.find((checked) => checked.id === member.id)
    );
    setCheckedItems([]);
    setPage(1);
    paginateData(updatedMembers);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputAndButtonContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, role..."
          placeholderTextColor="#888"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        <TouchableOpacity
          style={[
            styles.deleteButtonContainer,
            { backgroundColor: checkedItems.length < 1 ? "#ccc" : "red" },
          ]}
          disabled={checkedItems === 0}
        >
          <FontAwesome5
            name="trash"
            size={24}
            color="white"
            onPress={handleDelete}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>ID</Text>
          <Text style={styles.headerText}>Name</Text>
          <Text style={styles.headerText}>Email</Text>
          <Text style={styles.headerText}>Role</Text>
        </View>
        {/* Table Rows */}
        <FlatList
          data={displayedMembers}
          renderItem={({ item }) => (
            <TableRow rowData={item} handleCheckbox={handleCheckbox} />
          )}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
      {/* Pagination */}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={goToFirstPage}
          disabled={page === 1}
          style={[styles.paginationButton, { opacity: page === 1 ? 0.5 : 1 }]}
        >
          <MaterialIcons name="first-page" size={24} color="#2866d7" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={prevPage}
          disabled={page === 1}
          style={[styles.paginationButton, { opacity: page === 1 ? 0.5 : 1 }]}
        >
          <AntDesign name="leftcircle" size={24} color="#2866d7" />
        </TouchableOpacity>
        <Text style={styles.paginationText}>{`Page ${page}`}</Text>
        <TouchableOpacity
          onPress={nextPage}
          disabled={page * itemsPerPage >= members.length}
          style={[
            styles.paginationButton,
            { opacity: page * itemsPerPage >= members.length ? 0.5 : 1 },
          ]}
        >
          <AntDesign name="rightcircle" size={24} color="#2866d7" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToLastPage}
          disabled={page * itemsPerPage >= members.length}
          style={[
            styles.paginationButton,
            { opacity: page * itemsPerPage >= members.length ? 0.5 : 1 },
          ]}
        >
          <MaterialIcons name="last-page" size={24} color="#2866d7" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Table;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  tableContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#807f80",
    borderRadius: 6,
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#807f80",
    paddingTop: 10,
    paddingBottom: 10,
    display: "flex",
    justifyContent: "center",

    backgroundColor: "#c3d4f4",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#4e4e4e",
    paddingTop: 10,
    paddingBottom: 10,
  },
  cell: {
    flex: 1,
    color: "#fff",
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
  },
  paginationText: {
    color: "#2866d7",
  },
  paginationButton: {
    backgroundColor: "transparent",
    padding: 5,
  },
  searchInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    color: "#ccc",
    width: "80%",
  },
  deleteButtonContainer: {
    alignItems: "center",
    padding: 6,
    backgroundColor: "red",
    borderRadius: 6,
  },
  inputAndButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});

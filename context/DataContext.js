import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <DataContext.Provider value={{ members }}>{children}</DataContext.Provider>
  );
};

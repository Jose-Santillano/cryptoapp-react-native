import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";

//Local data. (If the API is down)
import localData from "./data/data.json";

//Components.
import CoinItem from "./components/CoinItem";

const App = () => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  //Function to load data from API. (CoinGecko)
  const loadData = async () => {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en"
    );

    const data = await res.json();

    //We check the information of the API, if it is undefined, we use the local data.
    if (data.length === undefined) {
      console.log("CoinGecko API is down, local data used.");
      setCoins(localData);
    } else {
      //We send the data to the state.
      console.log("CoinGecko API is working.");
      setCoins(data);
    }
  };

  //We use useEffect to load the data when the app is loaded.
  useEffect(() => {
    console.log("Loaded");
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#141414" />

      <View style={styles.header}>
        <Text style={styles.title}>Cryptotal</Text>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search a Coin..."
          placeholderTextColor={"#858585"}
          onChangeText={text => setSearch(text.toLowerCase())}
        />
      </View>

      <FlatList
        style={styles.list}
        data={coins.filter((coin) => coin.name.toLowerCase().includes(search))}
        renderItem={({ item }) => {
          return <CoinItem coin={item} />;
        }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await loadData();
          setRefreshing(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#141414",
    alignItems: "center",
    flex: 1,
  },
  title: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 20,
  },
  list: {
    width: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 10,
  },
  searchInput: {
    color: "#ffffff",
    borderBottomColor: "#4657CE",
    borderBottomWidth: 1,
    width: "40%",
    textAlign: "left",
  }
});

export default App;

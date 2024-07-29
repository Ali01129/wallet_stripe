import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColorPalette } from '@/constants/Colors';
//icons
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { router } from 'expo-router';
import TransCard from '@/components/transCard';
import PackCard from '@/components/packCard';
import SizedBox from '@/components/sizedbox';
import Images from "@/constants/Images";
import { getData, saveData } from '../storage';
import BASE_URL from '../../utills';

const HomeIndex = () => {

  interface Transaction {
    type: "received" | "sent";
    amount: number;
    date: string;
    name: string;
  }

  const [usd, setUsd] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Transactions');
  const [modalVisible, setModalVisible] = useState(false);
  const [mainImage, setMainImage] = useState(Images.amongus);
  const images = [Images.amongus, Images.goku, Images.zoro, Images.amongus];
  const [name, setName] = useState('');
  const [sc,setSc]=useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const retrievedData:any = await getData();
        if (retrievedData) {
          const parsedData = JSON.parse(retrievedData);
          setUsd(parsedData.usd);
          setName(parsedData.name);
          setSc(parsedData.sc);
          const parsedData2 = JSON.parse(parsedData.transaction);
          setTransactions(parsedData2);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const retrievedData:any = await getData();
      const parsedData = JSON.parse(retrievedData);
      const token:any = parsedData.token;
      
      const response2=await fetch(`${BASE_URL}/wallet/all`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'auth-token':token,
        },
      });
      const data=await response2.json();
      setUsd(data.usd);
      setName(data.name);
      setSc(data.sc);
      setTransactions(data.transactions);
      saveData(token, data.name, data.usd, data.sc, data.transactions);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderContent = () => {
    if (activeTab === "Transactions") {
      return (
        <ScrollView
          style={{ width: '100%', height: 150 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {transactions.length != null ? transactions.map((transaction, index) => (
            <TransCard
              key={index}
              name={transaction.name}
              date={new Date(transaction.date).toLocaleDateString()}
              price={transaction.amount}
              type={transaction.type}
            />
          )) : <Text>No Transactions</Text>}
          <SizedBox height={70} />
        </ScrollView>
      );
    } else {
      return (
        <ScrollView style={{ width: '100%', height: 350 }}>
          <PackCard name='VIP' profit={20} coins={500} validity='4 months' />
          <PackCard name='VIP' profit={20} coins={500} validity='4 months' />
          <PackCard name='VIP' profit={20} coins={500} validity='4 months' />
          <SizedBox height={70} />
        </ScrollView>
      );
    }
  };

  const handleImageSelect = (image: any) => {
    setMainImage(image);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={styles.title}>Wallet</Text>
          <Text style={styles.subtitle}>{name}</Text>
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={mainImage} style={styles.pic} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={{flexDirection:'row'}}>
        <View style={{flex:1}}>
          <Text style={[styles.subtitle, { color: "black", fontSize: 14 }]}>
            Balance
          </Text>
          <Text style={[styles.title, { color: "black" }]}>${usd}</Text>
        </View>
        <View style={{marginRight:20}}>
          <Text style={[styles.subtitle, { color: "black", fontSize: 14 }]}>
            SmartCoin
          </Text>
          <Text style={[styles.title, { color: "black" }]}>sc.{sc}</Text>
        </View>
        </View>


        <View style={{justifyContent: "space-between",flexDirection: "row",marginTop: 20,}}>
          <View style={styles.menuItem}>
            <TouchableOpacity onPress={() => router.push('send')}>
              <View style={styles.menu1}>
                <Ionicons name="send" size={20} color={ColorPalette.text}/>
              </View>
            </TouchableOpacity>
            <Text style={styles.menuText}>Send</Text>
          </View>
          <View style={styles.menuItem}>
            <TouchableOpacity onPress={() => router.push('deposit')}>
              <View style={styles.menu1}>
                <FontAwesome name="money" size={20} color={ColorPalette.text} />
              </View>
            </TouchableOpacity>
            <Text style={styles.menuText}>Deposit</Text>
          </View>
          <View style={styles.menuItem}>
            <TouchableOpacity onPress={() => router.push('withdraw')}>
              <View style={styles.menu1}>
                <FontAwesome6 name="money-bill-trend-up" size={20} color={ColorPalette.text} />
              </View>
            </TouchableOpacity>
            <Text style={styles.menuText}>Withdraw</Text>
          </View>
          <View style={styles.menuItem}>
            <TouchableOpacity onPress={() => router.push("conversion")}>
              <View style={styles.menu1}>
                <MaterialIcons name="currency-exchange" size={20} color={ColorPalette.text} />
              </View>
            </TouchableOpacity>
            <Text style={styles.menuText}>Convert</Text>
          </View>
        </View>
      </View>

      {/* Tabs Section */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Transactions" && styles.activeTab]}
          onPress={() => setActiveTab("Transactions")}
        >
          <Text style={styles.tabText}>Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Packages" && styles.activeTab]}
          onPress={() => setActiveTab("Packages")}
        >
          <Text style={styles.tabText}>Packages</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      {renderContent()}

      {/* Image Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => handleImageSelect(image)}>
                <Image source={image} style={styles.modalImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeIndex;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: ColorPalette.background,
    padding: 16,
  },
  title: {
    marginLeft: 15,
    color: ColorPalette.text,
    fontSize: 25,
    fontWeight: "bold",
  },
  subtitle: {
    marginLeft: 15,
    color: "grey",
    fontSize: 15,
  },
  pic: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  card: {
    backgroundColor: ColorPalette.primary,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  menuItem: {
    alignItems: "center",
    flex: 1,
  },
  menu1: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: ColorPalette.textBlack,
    justifyContent: "center",
    elevation: 5,
    alignItems: "center",
  },
  menuText: {
    color: ColorPalette.textBlack,
    textAlign: "center",
    marginTop: 5,
    fontSize: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: ColorPalette.greyNav,
  },
  tabText: {
    color: ColorPalette.text,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    marginHorizontal: 16,
    backgroundColor: ColorPalette.greyNav,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  modalImage: {
    width: 60,
    height: 60,
    margin: 10,
    borderRadius: 50,
  },
});
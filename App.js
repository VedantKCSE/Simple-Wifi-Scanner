import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import WifiManager from "react-native-wifi-reborn";

export default function App() {
  const [wifiList, setWifiList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Wi-Fi Permission',
            message: 'This app needs access to your location to scan Wi-Fi networks.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          scanWifi();
        } else {
          setError('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
        setError('Error requesting location permission');
      }
    };

    const scanWifi = async () => {
      try {
        const wifiScan = await WifiManager.loadWifiList();
        setWifiList(wifiScan);
      } catch (error) {
        console.error(error);
        setError('Error loading Wi-Fi list');
      }
    };

    requestLocationPermission();

    const interval = setInterval(() => {
      requestLocationPermission();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Wi-Fi Networks:</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        wifiList.map((wifi, index) => (
          <View key={index} style={styles.network}>
            <Text>{wifi.SSID}</Text>
            <Text>Signal Strength: {wifi.level} dBm</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
  },
  network: {
    marginBottom: 5,
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});

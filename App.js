import React from 'react';
// import {usePermissions} from 'expo-permissions';
// import CallLogs from 'react-native-call-log';

import { StyleSheet, Button, Text, View, Alert, TextInput, Linking, ScrollView, PermissionsAndroid } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';


export default function App() {
  const [valueinput, onChangeText] = React.useState('');
  const [permission, askForPermission] = Permissions.usePermissions(Permissions.CONTACTS, { ask: true });
  const inputEl = React.useRef('');

  React.useEffect(() => {
    // console.log(permission);
    // askForPermission();
    // permission = '';rr
    inputEl.current.value = valueinput;

    async function contactPermission() {
      const permission = await Permissions.askAsync(Permissions.CONTACTS);
      if (permission.status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });
        if (data.length > 0) {
          const contact = data[0];
          console.log(contact);
        }
        // console.log('data',contacts_data);
        //Alert.alert('Hey! You have not enabled selected permissions.');
      }
    }
    async function callLogPermission() {
     
      try {
        // CallLogs.load(-1, false).then(c => console.log(c));
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          {
            title: 'Call Log Example',
            message:
              'Access your call logs',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const filter = {
            minTimestamp: 1571835032,    // (Number or String) timestamp in milliseconds since UNIX epoch
            // if this filter is set, load(limit, filter) will only return call logs with timestamp >= minTimestamp

            maxTimestamp: 1571835033,    // (Number or String) timestamp in milliseconds since UNIX epoch
            //
            // if this filter is set, load(limit, filter) will only return call logs with timestamp <= maxTimestamp

            //phoneNumbers: '+1234567890', // (String or an Array of String)
            // if this filter is set, load(limit, filter) will only return call logs for this/these phone numbers
          }
          // CallLogs.load(-1, false).then(c => console.log(c));
          // CallLogs.load(-1, filter).then(c => console.log(c));
        } else {
          console.log('Call Log permission denied');
        }
      }
      catch (e) {
        console.log(e);
      }
    }
    callLogPermission();
    //contactPermission();
  });


  const onPressChat = (event) => {
    let val = inputEl.current.value;
    if (val == '' || isNaN(val)) {
      Alert.alert('Only Number with country code.');
    } else {
      Linking.openURL("https://wa.me/" + inputEl.current.value);
    }

  }


  return (
    <View style={styles.container}>
      {
        (!permission || permission.status !== 'granted') ?
          <View style={styles.inCon}>
            <Text>Permission is not granted</Text>
            <Button title="Grant permission" onPress={askForPermission} />
          </View>
          : <Text></Text>
      }

      <Text>Enter Phone Number</Text>
      <TextInput
        ref={inputEl}
        style={{ height: 30, width: "50%", margin: 30, borderColor: '#eee', borderBottomWidth: 1 }}
        onChangeText={text => onChangeText(text)}
        value={valueinput}
        placeholder={'+91'}
        maxLength={20}
      />
      <Button
        onPress={onPressChat}
        title="Chat"
        color="#40d251"
        accessibilityLabel="Learn more about this purple button"
      />
      <ScrollView style={styles.listContact}>
        <Text>Phone list</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inCon: {
    marginBottom: 20,
    flex: 0, alignItems: 'center', justifyContent: 'flex-start'
  },
  listContact: {
    flex: 0
  }
});

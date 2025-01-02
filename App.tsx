import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { useFonts, Roboto_700Bold, Roboto_400Regular } from '@expo-google-fonts/roboto';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular });

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#202024'}}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor='transparent'
        translucent  
      />
      {fontsLoaded? <Text style={{color: '#FFF', fontSize: 44}} >Home</Text> : <View />}
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
});

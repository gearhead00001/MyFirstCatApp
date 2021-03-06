import  React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Addtaskhome from './Addtaskhome';
import { Pendingtask } from './Pendingtask';
import { Completedtask } from './Completedtask';
import {store} from "../store/store";
import  {Provider} from 'react-redux';

const Stack = createNativeStackNavigator();

export const App = () =>{
  return(
    <Provider store = {store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Addtaskhome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Addtaskhome" component = {Addtaskhome} />
          <Stack.Screen name="Pendingtask" component = {Pendingtask} />
          <Stack.Screen name="Completedtask" component = {Completedtask} />
        </Stack.Navigator>
    </NavigationContainer>
   </Provider>
  );
}


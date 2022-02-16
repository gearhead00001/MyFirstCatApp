import React from "react";
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {Image} from "react-native";
import {store} from "../store/store";

const {cat_black, cat_yellow} = store.getState();

const Layout = styled.View`
  background-color : #f5f5f5;
`
const Header = styled.View`
  background-color: ${cat_yellow};
  border: 2px solid #ffe135;
  color: ${cat_black};
  height : 80px;
  flex-direction : row;
  border-color : ${cat_black}
`
const CatImg = styled.Image`
    margin: 20px 0px 0px 110px;
    height:35px;
    width: 50px;
`
const Apptitle = styled.Text`
    margin: 22px 0px 0px 10px;
    color : ${cat_black};
    font-weight:700;
    font-size:20px;

`
const Navbar = styled.View`
    flex-direction : row;
    background-color : ${cat_black};
    height: 50px;
`
const NbHome = styled.TouchableOpacity`
    width:80px;
    margin :10px;
`
const NbHometxt = styled.Text`
    font-size : 15px; 
    color : white;
`
const NbPending = styled.TouchableOpacity`
    width:120px;
    margin :10px;
`
const NbPendingtxt = styled.Text`
    font-size : 15px; 
    color : white;
`
const NbCompleted = styled.TouchableOpacity`
    width:120px;
    margin :10px;
`
const NbCompletedtxt = styled.Text`
    font-size : 15px; 
    color : white;
`
export  const AppHeader =(props)=>{

    return(
        <Layout>
            <Header>
                <CatImg source = {require('../Images/cat_logo.png')}/>
                <Apptitle>KANBAN</Apptitle>
            </Header>
            <Navbar>
                <NbHome onPress={()=>{props.data.navigation.navigate("Addtaskhome")}}><NbHometxt>Home</NbHometxt></NbHome>
                <NbPending  onPress={()=>{props.data.navigation.navigate("Pendingtask")}}><NbPendingtxt>Pending Tasks</NbPendingtxt></NbPending>
                <NbCompleted onPress={()=>{props.data.navigation.navigate("Completedtask")}}><NbCompletedtxt>Completed Tasks</NbCompletedtxt></NbCompleted>
            </Navbar>
        </Layout>
    );
}
import React from "react";
import { Component } from 'react';
import { Alert, Button, ScrollView, ToastAndroid, View } from 'react-native';
import styled from 'styled-components/native';
import { Pendingtask } from './Pendingtask';
import { Completedtask } from "./Completedtask";
import {AppHeader} from "./AppHeader";
import {store} from "../store/store";
import { openDatabase } from "react-native-sqlite-storage";
import { Value } from "react-native-reanimated";

const {cat_black, cat_yellow} = store.getState();

const Layout = styled.View`
  background-color: #edd812;
  background-image: linear-gradient(315deg, #edd812 0%, #766a65 74%);
  height:100%;
`
const CardView = styled.View`
  margin : 20px 20px 20px 20px;
  background-color : ${cat_black};
  height: 70%;
  border-radius:10px;
  border : 2px solid black;
`
const Heading = styled.Text`
  margin:50px 0px 0px 10px;
  font-size:20px;
  font-weight:700;
  color:white;
`
const TaskTitle = styled.TextInput.attrs({
  placeholder: "Enter task title.",
  placeholderTextColor : cat_black
})`
  margin : 30px 0px 0px 30px;
  border-radius : 10px;
  padding: 0px 0px 0px 20px;
  border : 2px solid #ffe135;
  width : 250px;
  height : 40px;
  font-size: 15px;
  background-color : white;
  color : ${cat_black};
`
const TaskDescription = styled.TextInput.attrs({
  placeholder: "Enter task description.",
  placeholderTextColor : cat_black,
  multiline :true
})`
  margin : 30px 0px 0px 30px;
  padding: 0px 0px 0px 20px;
  border : 2px solid #ffe135;
  border-radius : 10px;
  width : 250px;
  height : 60px;
  font-size: 15px;
  background-color : white;
  color : ${cat_black};
`

const TaskDeadline = styled.TextInput.attrs({
  placeholder: "Enter deadline (DD/MM/YYYY).",
  placeholderTextColor : cat_black
})`
  margin : 30px 0px 0px 30px;
  padding: 0px 0px 0px 20px;
  border : 2px solid #ffe135;
  border-radius : 10px;
  width : 250px;
  height : 40px;
  font-size: 15px;
  background-color : white;
  color : ${cat_black};
`

const AddButton = styled.TouchableOpacity`
  margin : 30px 0px 0px 80px;
  border-radius : 10px;
  width : 100px;
  height : 50px;
  background-color: ${cat_black};
  border: 2px solid #ffe135;
`
const AddButtonText = styled.Text`
  margin : 10px 0px 0px 25px;
  font-size : 18px;
  font-weight : 500;
  color : white;
`

const Cname = "Addtaskhome"

const db = openDatabase({
  name: "rn_sqlite",
});

const createTables = () => {
  db.transaction(txn => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS Tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, TaskTitle VARCHAR(200),  TaskDescription VARCHAR(800), TaskDeadline DATE, TaskCreation DATE, TaskCompletion DATE, TaskStatus VARCHAR(9))`,
      [],
      (sqlTxn, res) => {
        // console.log("table created successfully");
      },
      error => {
        // console.log("error on creating table " + error.message);
      },
    );
  });
};
createTables()

const getTasks = () => {
  db.transaction(txn => {
    txn.executeSql(
      `SELECT * FROM Tasks ORDER BY id`,
      [],
      (sqlTxn, res) => {
        // console.log("Tasks retrieved successfully");
        let len = res.rows.length;
        if (len > 0) {
          let results = [];
          for (let i = 0; i < len; i++) {
            let item = res.rows.item(i);
            results.push({ id: item.id, name: item.TaskTitle,desc : item.TaskDescription, deadline:item.TaskDeadline,creation : item.TaskCreation,completion: item.TaskCompletion });
          }
          console.log(results)
        }
      },
      error => {
        // console.log("error on getting Tasks " + error.message);
      },
    );
  });
};



export default class Addtaskhome extends Component{
  constructor(props){
      super(props)
  }
  state = {
    title : '',
    desc : '',
    deadline : ''
  }

  checkValid = (date) =>{
    for(let i=0;i<2;i++){
      let c = date.charAt(i);
      if((c >= '0' && c <= '9')==false){
        return false;
      }
    }
    if(date.charAt(2) != '/'){
        return false;
    }
    for(let i=3;i<5;i++){
      let c = date.charAt(i);
      if((c >= '0' && c <= '9')==false){
        return false;
      }
    }
    if(date.charAt(5) != '/'){
      return false;
    }
    for(let i=6;i<10;i++){
      let c = date.charAt(i);
      if((c >= '0' && c <= '9')==false){
        return false;
      }
    }
    let Tempdate = parseInt(date.substring(0,2));
    let TempMonth = parseInt(date.substring(3,5));
    if(Tempdate > 31 || Tempdate < 1 ){
      return false;
    }
    if(TempMonth > 12 || TempMonth < 1){
      return false;
    }
    return true;
  }

  addTasks = () => {
    let currentDate = new Date;
    let month = ((currentDate.getMonth()+1)>9)?""+(currentDate.getMonth()+1):"0"+(currentDate.getMonth()+1);
    let creationVal = currentDate.getFullYear()+"-"+ month +"-"+currentDate.getDate();

    let taskStatus = "Pending";

    let inpDate = this.state.deadline;
    let deadlineVal = inpDate.substring(6,10) + "-"+inpDate.substring(3,5)+"-"+inpDate.substring(0,2);
    if(this.state.title!=''&&this.state.desc!=''&&this.state.deadline!=''&& this.checkValid(this.state.deadline)){
          db.transaction(txn => {
            txn.executeSql(
              `INSERT INTO Tasks (TaskTitle, TaskDescription, TaskDeadline, TaskCreation,TaskStatus) VALUES (?,?,?,?,?)`,
              [this.state.title,this.state.desc,deadlineVal,creationVal,taskStatus],
              (sqlTxn, res) => {
                //console.log(`Task added successfully`);
                //getTasks()
                Alert.alert(
                  "Task Created🎉",
                  "Yay!. Task created successfully.",
                  [
                    {
                      text: "OK",
                      onPress: () => {},
                      style: "cancel",
                    },
                  ]);
            
                this.setState({title:'',desc:'',deadline:''});
              },
              error => {
                // console.log("error on adding Task " + error.message);
              },
            );
          });
    }else{
      Alert.alert(
        "Invalid Input",
        "Please fill all input fields!",
        [
          {
            text: "OK",
            onPress: () => {},
            style: "cancel",
          },
        ],
        {
          cancelable: true,
          onDismiss: () =>{},
        }
      );
    }
  };
 
  render(){
    return(
      <Layout>
        <AppHeader data = {{navigation : this.props.navigation,Cname : Cname}}/>
        <CardView>
          <Heading>Add New Task!</Heading>
          <TaskTitle  onChangeText = {(text) => this.setState({title : text})} value={this.state.title} />
          <TaskDescription onChangeText = {(text) => this.setState({desc : text})} value={this.state.desc} />
          <TaskDeadline onChangeText = {(text) => this.setState({deadline : text})} value={this.state.deadline} />
          <AddButton onPress = {()=>{this.addTasks()}}>
            <AddButtonText>Add</AddButtonText>
          </AddButton>
        </CardView>
      </Layout>
    );
  }
};

import React, { Component } from "react";
import { Alert, ScrollView} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import {AppHeader} from "./AppHeader";
import { Dimensions } from 'react-native';
import {store} from "../store/store";
import { openDatabase } from "react-native-sqlite-storage";

const height = Dimensions.get('window').height;

const {cat_black, cat_yellow} = store.getState();

const Ptext = styled.Text`
    margin:10px 120px 0px 20px;
    font-size: 20px; 
    color:${cat_black};
    font-weight:700;
    text-shadow: 2px 2px 5px white;
`
const Pview = styled.View`
    background-color: ${cat_yellow};   
`
const TasksScroll = styled.View`
  margin : 15px 0px 15px 0px;
  width : 100%;
  height : ${height-200}px;
  border-radius : 10px; 
`
const CardView = styled.View`
  margin : 15px 15px 15px 15px;
  border : 2px solid white;
  border-radius : 10px;
  width : 90%;
  height : 220px;
  background-color: ${cat_black};

`
const TasksTitle = styled.Text`
  font-size: 18px;
  color : white;
  margin: 10px 0px 0px 10px; 
`
const TaskDesc = styled.Text`
    color : white;
    font-size : 14px;
`
const TaskDescAlert = styled.TouchableOpacity`
    margin: 10px 0px 0px 50px;
`
const TaskDeadline = styled.Text`
    margin: 10px 0px 0px 50px;
    color : white;
    font-size: 14px;
`
const TaskCreated = styled.Text`
    margin: 10px 0px 0px 50px;
    color : white;
    font-size: 14px;
`
const ButtonArea = styled.View`
    margin-top: 15px ;
    flex-direction:row;
    height : 30%;
    width : 100%;
`
const Complete = styled.TouchableOpacity`
    margin : 10px 0px 0px 50px;
    padding : 5px 0px 0px 10px;
    border-radius : 5px;
    height : 50%;
    width : 25%;
    background-color:${cat_yellow};
`
const CompleteText = styled.Text`
    font-size: 14px;
    color : ${cat_black};
    font-weight:700;
`
const Remove = styled.TouchableOpacity`
    margin : 10px 0px 0px 70px;
    padding : 5px 0px 0px 15px;
    border-radius : 5px;
    height : 50%;
    width : 25%;
    background-color:${cat_yellow};
`
const RemoveText = styled.Text`
    font-size: 14px;
    color : ${cat_black};
    font-weight:700;
`
const Footer = styled.View`
height:2px;
`
const Cname = "Pendingtask"

const db = openDatabase({
    name: "rn_sqlite",
});


export class Pendingtask extends Component{
    constructor(props){
        super(props);
    }
    state = {
        results : [],
    }
    componentDidMount(){
        this.getTasks();
        this.focusListener = this.props.navigation.addListener('focus',()=>{this.getTasks()});
    }
    getTasks = () => {
        db.transaction(txn => {
            txn.executeSql(
            `SELECT * FROM Tasks WHERE TaskStatus = "Pending" ORDER BY TaskDeadline ASC`,
            [],
            (sqlTxn, res) => {
                // console.log("Pending Tasks retrieved successfully");
                let len = res.rows.length;
                let results1 = [];
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        let item = res.rows.item(i);
                        results1.push({ id: item.id, title: item.TaskTitle,desc : item.TaskDescription, deadline:item.TaskDeadline,created : item.TaskCreation });
                    }
                }
                // console.log(results1)
                this.setState((results) =>({results : results1}));
            },
            error => {
                // console.log("Error on getting Pending Tasks " + error.message);
            },
            );
        });
    };
    outputDateFormatter=(date)=>{
        return date.substring(8,10)+"/"+date.substring(5,7)+"/"+date.substring(0,4)+".";
    }
    completeAction =(index)=>{
        let currentDate = new Date;
        let month = ((currentDate.getMonth()+1)>9)?""+(currentDate.getMonth()+1):"0"+(currentDate.getMonth()+1);
        let completionVal = currentDate.getFullYear()+"-"+month+"-"+currentDate.getDate();
        db.transaction(txn => {
            txn.executeSql(
            `UPDATE Tasks SET  TaskCompletion=?,TaskStatus= "Completed" WHERE id=?;`,
            [completionVal,index],
            (sqlTxn, res) => {
                // console.log("Tasks Completed (updated) successfully.");
                this.getTasks();
            },
            error => {
                // console.log("error on Completing Tasks " + error.message);
            },
            );
        });
        
    }

    removeAction=(index)=>{
        db.transaction(txn => {
            txn.executeSql(
            `DELETE FROM Tasks WHERE id= ?;`,
            [index],
            (sqlTxn, res) => {
                // console.log("Pending Tasks removed successfully.");
                this.getTasks();
            },
            error => {
                // console.log("Error on removing Pending Tasks " + error.message);
            },
            );
        });
    }
    render(){
        return(
            <Pview key ={this.state.keyI}>
                <AppHeader data = {{navigation : this.props.navigation,Cname : Cname}}/>
                <Ptext>Pending Tasks ({this.state.results.length} Tasks)</Ptext>
                <TasksScroll>
                    <ScrollView>
                    {
                        this.state.results.map((ele,index)=>(
                            <CardView key ={"Tasks" + index}>
                                <TasksTitle key = {"Taskstext" + index}>{ele.title}</TasksTitle>
                                <TaskDescAlert key = {"TasksDescAlert" + index} onPress={()=>{Alert.alert("Task : "+ele.title,ele.desc,[{text: "OK",onPress: () => {},style: "cancel",},])}}>
                                    <TaskDesc key = {"TasksDesc" + index}>{(ele.desc.length > 80)?ele.desc.substring(0,77) + "...":ele.desc}
                                    </TaskDesc>
                                </TaskDescAlert>
                                <TaskCreated key = {"TasksCreated" + index}>Task created at {this.outputDateFormatter(ele.created)}</TaskCreated>
                                <TaskDeadline key = {"TasksDeadline" + index}>Task deadline is {this.outputDateFormatter(ele.deadline)}</TaskDeadline>
                                <ButtonArea>
                                    <Complete key = {"C1"+index} onPress={()=> this.completeAction(ele.id)}><CompleteText>Complete</CompleteText></Complete>
                                    <Remove key = {"C2"+index} onPress={()=> this.removeAction(ele.id)}><RemoveText>Remove</RemoveText></Remove>
                                </ButtonArea>
                            </CardView>
                        ))
                    }
                    </ScrollView>
                </TasksScroll>
                <Footer />
            </Pview>
        );
    }
}

[{text: "OK",onPress: () => {},style: "cancel",},]
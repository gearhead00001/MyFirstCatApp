import React, { Component } from "react";
import styled from "styled-components/native";
import { Alert, ScrollView } from "react-native";
import {AppHeader} from "./AppHeader";
import { Dimensions } from 'react-native';
import { openDatabase } from "react-native-sqlite-storage";
import {store} from "../store/store";

const height = Dimensions.get('window').height;

const {cat_black, cat_yellow} = store.getState();

const Ctext = styled.Text`
    margin:10px 0px 0px 20px;
    font-size: 20px; 
    color:${cat_black};
    font-weight:700;
    text-shadow: 2px 2px 5px white;

`
const Cview = styled.View`
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
  height : 235px;
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
const TaskCompleted = styled.Text`
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
const Remove = styled.TouchableOpacity`
    margin : 0px 0px 0px 50px;
    padding : 5px 0px 0px 15px;
    border-radius:5px;
    height : 50%;
    width : 25%;
    background-color:${cat_yellow};
`
const RemoveText = styled.Text`
    font-size: 14px;
    color : ${cat_black};
    font-weight:700;
`
const Revert = styled.TouchableOpacity`
    margin : 0px 0px 0px 70px;
    padding : 5px 0px 0px 20px;
    border-radius:5px;
    height : 50%;
    width : 25%;
    background-color:${cat_yellow};
`
const RevertText = styled.Text`
    font-size: 14px;
    color : ${cat_black};
    font-weight:700;
`

const Footer = styled.View`
height:2px;
`

const Cname = "Completedtask";

const db = openDatabase({
    name: "rn_sqlite",
});

export class Completedtask extends Component{
    constructor(props){
        super(props);
    }
    state = {
       results : [],
    }
    componentDidMount(){
        this.getTasks();
    }
    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }
    outputDateFormatter=(date)=>{
        return date.substring(8,10)+"/"+date.substring(5,7)+"/"+date.substring(0,4)+".";
    }
    getTasks = () => {
        db.transaction(txn => {
            txn.executeSql(
            `SELECT * FROM Tasks WHERE TaskStatus = "Completed" ORDER BY TaskDeadline DESC`,
            [],
            (sqlTxn, res) => {
                // console.log("Completed Tasks retrieved successfully");
                let len = res.rows.length;
                let results1 = [];
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        let item = res.rows.item(i);
                        results1.push({ id: item.id, title: item.TaskTitle,desc : item.TaskDescription, deadline:item.TaskDeadline,created : item.TaskCreation,completed: item.TaskCompletion });
                    }
                }
                this.setState((results) =>({results : results1}));
            },
            error => {
                // console.log("error on getting Completed Tasks " + error.message);
            },
            );
        });
    };
    removeTask=(index)=>{
        db.transaction(txn => {
            txn.executeSql(
            `DELETE FROM Tasks WHERE id= ?;`,
            [index],
            (sqlTxn, res) => {
                // console.log("Completed Task removed successfully.");
                this.getTasks();
            },
            error => {
                // console.log("Error on removed Completed Task" + error.message);
            },
            );
        });
    }
    revertTask =(index)=>{
        db.transaction(txn => {
            txn.executeSql(
            `UPDATE Tasks SET TaskStatus= "Pending" WHERE id=?;`,
            [index],
            (sqlTxn, res) => {
                // console.log("Tasks Reverted (updated) successfully.");
                this.getTasks();
            },
            error => {
                // console.log("error on Reverting Tasks " + error.message);
            },
            );
        });
    }
    render(){
        return(
            <Cview>
                <AppHeader data = {{navigation : this.props.navigation,Cname : Cname}}/>
                <Ctext>Completed Tasks ({this.state.results.length} tasks)</Ctext>
                <TasksScroll>
                    <ScrollView>
                    {
                        this.state.results.map((ele,index)=>(
                            <CardView key ={"Tasks" + index}>
                                <TasksTitle key = {"Taskstext" + index}>{ele.title}</TasksTitle>
                                <TaskDescAlert key = {"TasksDesc" + index} onPress={()=>{Alert.alert("Task : "+ele.title,ele.desc,[{text: "OK",onPress: () => {},style: "cancel",},])}}>
                                    <TaskDesc key = {"TasksDesc" + index}>{(ele.desc.length >80)?ele.desc.substring(0,77) + "...":ele.desc}
                                    </TaskDesc>
                                </TaskDescAlert>
                                <TaskCreated key = {"TasksCreat" + index}>Task created at {this.outputDateFormatter(ele.created)}</TaskCreated>
                                <TaskDeadline key = {"TasksDeadline" + index}>Task deadline is {this.outputDateFormatter(ele.deadline)}</TaskDeadline>
                                <TaskCompleted key = {"TasksComp" + index}>Task completed at {this.outputDateFormatter(ele.completed)}</TaskCompleted>
                                <ButtonArea>
                                    <Remove onPress={()=>this.removeTask(ele.id)}><RemoveText>Remove</RemoveText></Remove>
                                    <Revert onPress={()=>this.revertTask(ele.id)}><RevertText>Revert</RevertText></Revert>
                                </ButtonArea>
                            </CardView>
                        ))
                    }
                    </ScrollView>
                </TasksScroll>
                <Footer />
            </Cview>
        );
    }
}
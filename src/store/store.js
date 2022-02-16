import { createStore } from 'redux'
import {Reducer} from "./reducer"

export const store = createStore(Reducer)

store.dispatch({type:"UIColors",payload:{cat_black: "#000000",cat_yellow :"#ffe135"}})

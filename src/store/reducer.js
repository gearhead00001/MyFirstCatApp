export const Reducer = (state,action)=>{
    switch(action.type){
        case "UIColors" : {
                            return action.payload;
                          }
                          break;
    }
    return state;
}
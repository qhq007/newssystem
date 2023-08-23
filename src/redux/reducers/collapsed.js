export default function collapsed(preState=false,action){
    const {type,data} = action;
    switch(type){
        case "changeCollapsed":
            return data;
        default:
            return preState;
    }
}
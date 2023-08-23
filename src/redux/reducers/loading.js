export default function loading(preState=false,action){
    const {type,data} = action;
    switch(type){
        case "changeLoding":
            return data;
        default:
            return preState;
    }
}
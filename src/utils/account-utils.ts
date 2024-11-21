export function getUserName(){
    const name = localStorage.getItem("ms_username");
    return name
}    

export function getUserId(){
    const userId = localStorage.getItem("id");
}
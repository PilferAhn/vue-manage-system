export function getUserName(){
    const name = localStorage.getItem("ms_username");
    return name
}    

export function getRole(){
    const role = localStorage.getItem("role");    
    return role
}

export function getUserId(){
    const userId = localStorage.getItem("id");
}
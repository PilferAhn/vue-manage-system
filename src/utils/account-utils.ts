export function getUserName() : string{
    const name = localStorage.getItem("ms_username");
    return name
}    

export function getRole(){
    const role = localStorage.getItem("role");    
    return role
}

export function getUserId() : string{
    const userId = localStorage.getItem("id");
    return userId
}

export function getDepartment(): string{
    const department = localStorage.getItem("department");
    return department
}
export function checkPassword(password : string, passwordConfirmation : string){

    if (password === passwordConfirmation){
        return true
    }
    
    return false

}

// 부서 목록은 서버(users_rev2_department)에서 조회: GET /user_rev2/get_department_list
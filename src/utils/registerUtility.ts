export function checkPassword(password : string, passwordConfirmation : string){

    if (password === passwordConfirmation){
        return true
    }
    
    return false

}

export const departmentList = [
    "차세대공법개발그룹",
    "SAW요소기술그룹",
    "차세대SAW개발그룹",
    "상품개발1그룹",
    "상품개발2그룹",
    "모듈개발1그룹",
    "모듈개발2그룹",
    "MRD그룹",
    "개발기획팀",
    "기타"
]
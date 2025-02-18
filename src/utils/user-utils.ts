import { sendPostRequest, sendGetRequest } from "./httpProtocol";
import { convertKeysToCamelCase } from "./key-converter";
import type { User } from "../interface/user";
import { ref } from "vue";

export async function getUserListByDepartment(department: string) {
  const users = ref<User[]>([]);
  const formData = new FormData();
  formData.append("department", department);
  const userList = await sendPostRequest(
    "/user/get_users_by_department",
    formData
  );

  userList.forEach((user) => {
    users.value.push(convertKeysToCamelCase(user) as User);
  });

  return users.value;
}

export async function getUserList() {

  const url = "/user"
  const users = ref<User[]>([]);
  const response = await sendGetRequest(url , "get_user_list")
  response.forEach((user) => {
    users.value.push(convertKeysToCamelCase(user) as User);
  });
  
  return users.value
}
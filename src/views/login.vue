<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">요소기술그룹 측정 시스템</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="ID">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">Login</el-button>
        </div>
        <div class="register-link">
          <a href="#" @click.prevent="navigateToRegister">계정 생성</a>

          <!-- <a href="#" type="info" @click="submitForm(login)">아이디 / 비밀번호 찾기</a> -->
          <!-- <a href="#" @click="navigateToRegister">계정생성</a> -->
        </div>
        <!-- <el-checkbox class="login-tips" v-model="checked" label="Remember me" size="large" />
                <p class="login-tips">Tips: You can fill in the username and password randomly.</p> -->
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useTagsStore } from "../store/tags";
import { usePermissStore } from "../store/permiss";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Lock, User } from "@element-plus/icons-vue";
import { userLogin } from "../utils/login";


interface LoginInfo {
  username: string;
  password: string;
}

const lgStr = localStorage.getItem("login-param");
const defParam = lgStr ? JSON.parse(lgStr) : null;
const checked = ref(lgStr ? true : false);

const router = useRouter();
const param = reactive<LoginInfo>({
  username: defParam ? defParam.username : "",
  password: defParam ? defParam.password : "",
});

// 회원가입 페이지로 네비게이션하는 함수

const navigateToRegister = () => {
  
  router.push('/create-account'); // 회원가입 페이지 경로 설정 필요
  
};

const rules: FormRules = {
  username: [
    {
      required: true,
      message: "Please enter username",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "Please enter password", trigger: "blur" },
  ],
};
// w2110904

const permiss = usePermissStore();
const login = ref<FormInstance>();

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  // validate 메서드를 프로미스로 감싼다
  new Promise((resolve, reject) => {
    formEl.validate((valid: boolean) => {
      if (valid) {
        resolve(valid);
      } else {
        reject(new Error("Validation failed"));
      }
    });
  })
    .then(async () => {
      // 폼 검증 성공
      try {
        const response = await userLogin(param.username, param.password);
        
        if (response.status) {
          // 로그인 성공 로직
          ElMessage.success("Login successful");
          localStorage.setItem("ms_username", response.user_name);
          
     

          // 기타 사용자 정의 로직
          // 예: 권한 설정, 로컬 스토리지 업데이트 등
          const keys = JSON.parse(response.ms_keys);          
          permiss.defaultList[response.user_name == "admin" ? "admin" : "user"];
          permiss.handleSet(keys);

          localStorage.setItem("ms_keys", JSON.stringify(keys));
          

          router.push("/");
        }
        else{
            ElMessage.error(response.message)
        }

        if (checked.value) {
          localStorage.setItem("login-param", JSON.stringify(param));
        } else {
          localStorage.removeItem("login-param");
        }
      } catch (error) {
        console.error("Login error:", error);
        ElMessage.error("Login failed");
      }
    })
    .catch((error) => {
      // 폼 검증 실패 또는 로그인 실패
      ElMessage.error(error.message);
    });
};



// const submitForm = (formEl: FormInstance | undefined) => {
//   if (!formEl) return;
//   formEl.validate((valid: boolean) => {
//     if (valid) {

//     //   const response = await userLogin(param.username, param.password);

//       ElMessage.success("Login successful");

//       localStorage.setItem("ms_username", param.username);

//       const keys =
//         permiss.defaultList[param.username == "admin" ? "admin" : "user"];
//       permiss.handleSet(keys);

//       localStorage.setItem("ms_keys", JSON.stringify(keys));

//       console.log(localStorage);

//       router.push("/");
//       if (checked.value) {
//         localStorage.setItem("login-param", JSON.stringify(param));
//       } else {
//         localStorage.removeItem("login-param");
//       }
//     } else {
//       ElMessage.error("Login failed");
//       return false;
//     }
//   });
// };

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #333;
  font-weight: bold;
  padding-top: 10px;
}
.ms-login {
  width: 350px;
  border-radius: 5px;
  background: #fff;
}
.ms-content {
  padding: 10px 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #333;
}
.register-link {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.register-link button {
  flex-grow: 1;
  
}
</style>

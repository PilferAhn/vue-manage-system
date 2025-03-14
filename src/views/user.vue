<template>
  <div class="container">
    <el-form :model="user" label-position="top">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <el-divider content-position="center">기본 정보</el-divider>
            <el-row :gutter="20">
              <el-col :span="12">
                <inputText
                  v-model="user.userName"
                  label="Name"
                  prop="userName"
                  placeholder=""
                />
              </el-col>
              <el-col :span="12">
                <el-form-item label="Department" prop="department">
                  <el-select v-model="user.department">
                    <el-option
                      v-for="department in departmentOptions"
                      :key="department.key"
                      :value="department.value"
                      :label="department.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="Requester" prop="requester">
                  <el-input
                    v-model="props.application.user.userName"
                  ></el-input>
                </el-form-item>
                <inputText
                  label="Requester Name"
                  prop="requester"
                  placeholder="ex) XMN5CTV@1A"
                />
              </el-col>
              <el-col :span="6">
                <inputText
                  label="Requester ID"
                  prop="requesterId"
                  placeholder="ex) XMN5CTV@1A"
                />
              </el-col>
              <el-col :span="12">
                <el-form-item label="측정 SPL">
                  <el-input placeholder="협의필요"></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="user">
import { reactive, ref } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import avatar from "../assets/img/img.jpg";
import InputText from "./Common/InputText.vue";
import type { User } from "../interface/user";
import {
  getUserId,
  getUserName,
  getDepartment,
  getRole,
} from "../utils/account-utils";
import { OptionInterface } from "../interface/option";

const user = ref<User>({
  userName: getUserName(),
  id: getUserId(),
  department: getDepartment(),
  role: getRole(),
});

const departmentOptions = ref<OptionInterface[]>([
  { key: 1, value: "차세대공법개발그룹", label: "차세대공법개발그룹" },
  { key: 2, value: "SAW요소기술그룹", label: "SAW요소기술그룹" },
  { key: 3, value: "선행개발그룹", label: "선행개발그룹" },
  { key: 4, value: "상품개발그룹(A)", label: "상품개발그룹(A)" },
  { key: 5, value: "상품개발그룹(B)", label: "상품개발그룹(B)" },
  { key: 6, value: "모듈개발1그룹", label: "모듈개발1그룹" },
  { key: 7, value: "모듈개발2그룹", label: "모듈개발2그룹" },
  { key: 8, value: "WJC ", label: "WJC " },
  { key: 9, value: "PI그룹", label: "PI그룹" },
]);

const name = localStorage.getItem("ms_username");
const form = reactive({
  old: "",
  new: "",
  desc: "Impossible! How could my code have a bug?!",
});
const onSubmit = () => {};

const avatarImg = ref(avatar);
const imgSrc = ref("");
const cropImg = ref("");
const dialogVisible = ref(false);
const cropper: any = ref();

const showDialog = () => {
  dialogVisible.value = true;
  imgSrc.value = avatarImg.value;
};

const setImage = (e: any) => {
  const file = e.target.files[0];
  if (!file.type.includes("image/")) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (event: any) => {
    dialogVisible.value = true;
    imgSrc.value = event.target.result;
    cropper.value && cropper.value.replace(event.target.result);
  };
  reader.readAsDataURL(file);
};

const cropImage = () => {
  cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
};

const saveAvatar = () => {
  avatarImg.value = cropImg.value;
  dialogVisible.value = false;
};
</script>

<style scoped>
.info {
  text-align: center;
  padding: 35px 0;
}
.info-image {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 50px;
  overflow: hidden;
}

.info-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.info-edit i {
  color: #eee;
  font-size: 25px;
}
.info-image:hover .info-edit {
  opacity: 1;
}
.info-name {
  margin: 15px 0 10px;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}
.crop-demo-btn {
  position: relative;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>

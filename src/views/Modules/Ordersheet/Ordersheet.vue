<script lang="ts">
export default {};
</script>
<template>
    <el-form label-position="top" label-width="100px" ref="applicationForm">
        <div class="container" v-if="!loading">

            <el-row :gutter="20">
                <el-col :span="24">
                    <el-card>
                        <div style="text-align: center; font-size: 26px; font-weight: bold;">
                            개발품 Ass'y Order Sheet
                            <!-- 아쎄이 오다 씻 -->
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div style="
      background-color: black;
      color: #00FF00;
      font-family: 'Courier New', monospace;
      border: 4px solid white;
      border-radius: 65px;
      padding: 6px 10px;
      font-size: 14px;
      line-height: 1.4;
      white-space: pre-wrap;
    ">
                        message:
                        <span v-if="message">
                            {{ message }}
                        </span>
                    </div>
                </el-col>
            </el-row>


            <el-row :gutter="20">
                <el-col :span="24">
                    <el-card>
                        <div style="display: flex; width: 100%; ">
                            <div style="min-width:400px; ">
                                <el-card style="height: 523px;">
                                    <!-- left -->
                                    <div class="wrapper">
                                        <div style="    display: block; justify-content: center; align-items: center;">
                                            <div class="code-input">
                                                <span style="font-size: 32px;  font-weight: bold; ">
                                                    P/N:
                                                </span>
                                                <input v-for="(val, idx) in 4" :key="idx" type="text" maxlength="1"
                                                    class="digit" v-model="code[idx]" @input="onInput(idx, $event)"
                                                    style="width: calc(100% / 5); min-width: 20px; max-width: 50px;"
                                                    @keydown="onKeydown(idx, $event)" @keyup.enter="onEnter"
                                                    ref="inputs" />

                                            </div>

                                        </div>
                                    </div>

                                </el-card>
                            </div>
                            <div style="min-width: 60%; display: flex; margin-left: 15px; height: 523px;">
                                <!-- right side -->
                                <transition name="fade">
                                    <div style="margin-left: 15px; width: 300px;" v-if="fCode !== ''">
                                        <!--="fCode !== ''" -->
                                        <el-card>
                                            <div
                                                style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                                                <div>
                                                    <span style="font-size: 30px; font-weight: 700;">
                                                        차수
                                                    </span>
                                                    <span style="font-size: 30px;color: #ff0134; font-weight: 700;"
                                                        v-if="copyMode">
                                                        :COPY
                                                    </span>
                                                </div>
                                                <div style="cursor: pointer;" @click="handleCopyMode">
                                                    <el-icon>
                                                        <DocumentCopy />
                                                    </el-icon>
                                                </div>
                                            </div>
                                        </el-card>

                                        <div
                                            style="max-height: 419px; overflow-y: auto; overflow-x: hidden;  scrollbar-width: none;-ms-overflow-style: none;  ">
                                            <div v-for="(item, index) in levelsList" :key="index">
                                                <el-card class="hover-card" :class="{ selected: item === curLevel }"
                                                    @click="onClickLevel(item)">
                                                    <div style="display: flex;justify-content: space-between;">
                                                        <div>
                                                            {{ item }}
                                                        </div>
                                                        <div class="sheet-action-do"
                                                            @click.stop="excelDownloadFile(item)">
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 100 100" width="50" height="50">
                                                                <title>Modern Excel Icon</title>
                                                                <defs>
                                                                    <linearGradient id="excelGreenGradient" x1="0%"
                                                                        y1="0%" x2="100%" y2="100%">
                                                                        <stop offset="0%" style="stop-color:#207245;" />
                                                                        <stop offset="100%"
                                                                            style="stop-color:#35ac69;" />
                                                                    </linearGradient>

                                                                    <filter id="shadow" x="-20%" y="-20%" width="140%"
                                                                        height="140%">
                                                                        <feDropShadow dx="2" dy="4" stdDeviation="4"
                                                                            flood-color="#000000" flood-opacity="0.3" />
                                                                    </filter>
                                                                </defs>

                                                                <rect x="25" y="25" width="70" height="70" rx="10"
                                                                    ry="10" fill="url(#excelGreenGradient)"
                                                                    filter="url(#shadow)" />

                                                                <rect x="5" y="5" width="50" height="50" rx="8" ry="8"
                                                                    fill="url(#excelGreenGradient)"
                                                                    filter="url(#shadow)" />

                                                                <text x="17" y="44" font-family="Arial, sans-serif"
                                                                    font-size="36" font-weight="bold"
                                                                    fill="white">X</text>
                                                            </svg>
                                                        </div>
                                                    </div>

                                                </el-card>
                                            </div>
                                        </div>
                                    </div>
                                </transition>

                                <transition name="fade">
                                    <div style="display: flex">
                                        <div style="
                                                      width: 160px;
                                                      height: 523px;
                                                      display: flex;
                                                      justify-content: center;
                                                      align-items: center;
                                                      /* border: 1px solid #ccc; */
                                                    " v-if="copyMode">
                                            <div style="" v-if="visibleArrow">
                                                <div>
                                                    <el-button type="defalt" style="height: 50px;"
                                                        @click="HandlePasteButton">
                                                        <span style="color: black;font-size: 25px; ">
                                                            붙여넣기
                                                        </span>
                                                    </el-button>
                                                </div>


                                            </div>
                                        </div>

                                        <div style="margin-left: 15px; width: 300px;"
                                            v-if="copyMode && curLevel !== ''">
                                            <!--="fCode !== ''" -->
                                            <el-card>
                                                <div
                                                    style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                                                    <div>
                                                        <span style="font-size: 30px; font-weight: 700;">
                                                            덮어쓰기
                                                        </span>
                                                    </div>
                                                </div>
                                            </el-card>

                                            <div
                                                style="max-height: 419px; overflow-y: auto; overflow-x: hidden;  scrollbar-width: none;-ms-overflow-style: none;  ">
                                                <div v-for="(item, index) in levelsList" :key="index">


                                                    <el-card class="hover-card_copy"
                                                        :class="{ selected_copy: item === pasteLevel }"
                                                        @click="onClickLevelPaste(item)">
                                                        {{ item }}
                                                    </el-card>
                                                </div>
                                            </div>
                                        </div>

                                    </div>



                                </transition>



                                <transition name="fade">
                                    <div style="margin-left: 15px; height: 523px; width: 600px;"
                                        v-if="curLevel !== '' && !copyMode">
                                        <!-- <el-card style="height: 100%; width: 600px;"> -->

                                        <el-card>
                                            <div
                                                style="display: flex; justify-content: space-around; align-items: center; padding: 10px 0; height: 23px;">
                                                <div class="sheet-action" @click="create">
                                                    📄 Order sheet
                                                </div>
                                                <div class="sheet-action" @click="handleCreatePcb">
                                                    🧩 PCB Capture
                                                </div>
                                                <div class="sheet-action" @click="bomClick">
                                                    📋 Bom List
                                                </div>

                                            </div>
                                        </el-card>

                                        <div style="overflow-y:auto; height: 400px;">
                                            <div v-for="(item, index) in sheetsList" :key="index">
                                                <el-card>
                                                    <div
                                                        style="display: flex ; justify-content: space-between; align-items: center;">
                                                        <div style="cursor: pointer;"
                                                            @click="handleSheetClick(item.sheet_id, item.stype)">
                                                            {{ item.sheet_name }}
                                                        </div>
                                                        <div style="display: flex; gap: 10px;">
                                                            <div @click="handleChangeSheetName(item.sheet_id)"
                                                                style="cursor: pointer;">
                                                                이름변경
                                                            </div>
                                                            <div @click="copysheet(item.sheet_id)"
                                                                style="cursor: pointer;" v-if="item.stype === 'sheet'">
                                                                / 복사
                                                            </div>
                                                            <div @click="deleted(item.sheet_id)"
                                                                style="cursor: pointer;" v-if="item.stype === 'sheet'">
                                                                / 삭제
                                                            </div>
                                                        </div>
                                                    </div>
                                                </el-card>
                                            </div>
                                        </div>

                                        <!-- </el-card> -->
                                    </div>
                                </transition>

                            </div>

                        </div>

                    </el-card>
                </el-col>
            </el-row>

        </div>
    </el-form>

</template>


<script lang="ts" setup>
import { ref, onMounted, watch, computed, nextTick, reactive, Ref } from "vue";
import { getCodeWpms, getLevels, getSheetsByLevel, createSheet, deleteSheet, copySheet, copyLevel, changeSheetName, createPcb, createBom, excelDownload } from '../../../utils/orderShiitUtils';
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
const loading = ref(true);

const code = reactive(["", "", "", ""])
const fCode = ref("")
const inputs = ref([])
const message = ref("")
const copyMode = ref(false)

const modules = ref([])
const levelsList = ref([])

const router = useRouter();
const curLevel = ref("");
const pasteLevel = ref("");
const sheetsList = ref([]);


const optionsCopy = ref([])
const optionsPaste = ref([])
const visibleArrow = ref(false)

const STATE_KEY = "ordersheet:list:state";
function saveState() {
  const payload = {
    code: [...code],
    fCode: fCode.value,
    message: message.value,
    copyMode: copyMode.value,
    levelsList: levelsList.value,
    curLevel: curLevel.value,
    pasteLevel: pasteLevel.value,
    sheetsList: sheetsList.value,
    visibleArrow: visibleArrow.value,
  };
  sessionStorage.setItem(STATE_KEY, JSON.stringify(payload));
}
function restoreState() {
  const raw = sessionStorage.getItem(STATE_KEY);
  if (!raw) return;
  try {
    const s = JSON.parse(raw);
    if (Array.isArray(s.code)) s.code.forEach((v: string, i: number) => (code[i] = v ?? ""));
    fCode.value = s.fCode ?? "";
    message.value = s.message ?? "";
    copyMode.value = !!s.copyMode;
    levelsList.value = s.levelsList ?? [];
    curLevel.value = s.curLevel ?? "";
    pasteLevel.value = s.pasteLevel ?? "";
    sheetsList.value = s.sheetsList ?? [];
    visibleArrow.value = !!s.visibleArrow;
  } catch (e) {
    // 깨진 값이면 무시
    sessionStorage.removeItem(STATE_KEY);
  }
}
watch(
  () => [
    code.join(""),
    fCode.value,
    curLevel.value,
    pasteLevel.value,
    copyMode.value,
    JSON.stringify(levelsList.value),
    JSON.stringify(sheetsList.value),
  ],
  () => saveState(),
  { deep: false }
);
onMounted(() => {
  restoreState();
  loading.value = false;
  if (!message.value) message.value = "P/N 입력 후 ENTER";
});


async function onClickLevel(lev: string) {

    curLevel.value = lev
    sheetsList.value = await getSheetsByLevel(fCode.value, lev);
    if (copyMode.value) {
        message.value = "붙여넣을 차수를 선택해주세요"
    }

}
function onClickLevelPaste(lev: string) {
    pasteLevel.value = lev
    visibleArrow.value = true
    const names = sheetsList.value
        .filter(sheet => sheet && sheet.sheet_name)
        .map(sheet => sheet.sheet_name)
        .join(', ');
    message.value = `${lev}에 ${curLevel.value}[${names}]을  추가합니다. `
}

function onInput(idx, event) {
    const input = event.target
    console.log(input.value);
    let value = input.value.toUpperCase()

    // 영문+숫자만 허용: 정규식 필터
    if (!/^[A-Z0-9]$/.test(value)) {
        value = ''
        message.value = "영문 또는 숫자만 입력할 수 있습니다."
    } else {
        message.value = ""  // 정상 입력 시 메시지 제거
    }

    code[idx] = value
    input.value = value

    // 다음 칸 포커스 이동
    if (value && idx < 3) {
        nextTick(() => inputs.value[idx + 1]?.focus())
    }
}


function onKeydown(idx, event) {
    if (event.key === "Backspace" && !code[idx] && idx > 0) {
        // 현재 칸이 비어있고 백스페이스 누르면
        nextTick(() => {
            inputs.value[idx - 1]?.focus()
            code[idx - 1] = "" // 이전 칸도 지워주기
        })
    }
    if (event.key === 'ArrowLeft' && idx > 0) {
        nextTick(() => {
            inputs.value[idx - 1]?.focus()
        })
    }
    if (event.key === 'ArrowRight' && idx < 3) {
        nextTick(() => {
            inputs.value[idx + 1]?.focus()
        })
    }
}
async function onEnter() {
    const cleanedCode = code.map(c => c.trim()) // 공백 제거
    const fullCode = cleanedCode.join("")

    console.log("실제 입력 상태:", cleanedCode)
    if (fullCode.length === 4 && !cleanedCode.includes("")) {
        console.log("⏎ Enter로 입력 완료:", fullCode)
        message.value = "Enter로 제출됨: " + fullCode
        // const result = await getCodeWpms(fullCode)
        const result = await getLevels(fullCode)
        console.log(result)

        if (result.length === 0) {
            message.value = "해당 모델에 대한 차수 정보가 없습니다."
            levelsList.value = []  // 혹은 null 할당도 가능
            curLevel.value = ""
            fCode.value = ""
        } else {
            console.log(result)
            levelsList.value = result
            optionsCopy.value = result.map((item) => ({
                label: item,
                value: item
            }))
            optionsPaste.value = result.map((item) => ({
                label: item,
                value: item
            }))
            fCode.value = fullCode
        }
        // modules.value = result;

    } else {
        message.value = "아직 4자리가 모두 입력되지 않았어요."
    }
}

function handleSheetClick(sheet_id: string, stype: string) {
    console.log(stype, sheet_id);
    if (stype === 'sheet') {
        router.push({
            name: "OrderSheetCreate",
            params: { sheetId: sheet_id },
        });
        // const url = router.resolve({
        //     name: "OrderSheetCreate",
        //     params: { sheetId: sheet_id }
        // }).href;
        // window.open(url, "_blank"); // 새 탭에서 열기
    }
    else if (stype === 'pcb') {
        // router.push({
        //     name: "OrderSheetPcbCreate",
        //     params: { sheetId: sheet_id },
        // });
        const url = router.resolve({
            name: "OrderSheetPcbCreate",
            params: { sheetId: sheet_id }
        }).href;
        window.open(url, "_blank");
    }
    else if (stype === 'bom') {
        // router.push({
        //     name: "OrderSheetBomCreate",
        //     params: { sheetId: sheet_id },
        // })
        const url = router.resolve({
            name: "OrderSheetBomCreate",
            params: { sheetId: sheet_id }
        }).href;
        window.open(url, "_blank"); // 새 탭에서 열기
    }
}

async function HandlePasteButton() {
    console.log(curLevel, "을 복사중 .. ", pasteLevel);
    message.value = "복사중....."
    const result = await copyLevel(fCode.value, curLevel.value, pasteLevel.value)
    console.log(result.success);
    if (result.success) {
        message.value = "복사 완료."
    } else {
        message.value = "복사 실패"
    }

}

function handleCopyMode() {
    if (!copyMode.value) {
        pasteLevel.value = ""
        curLevel.value = ""
        copyMode.value = false
        message.value = "복사할 차수를 선택해주세요."
    }
    else {
        curLevel.value = ""
        visibleArrow.value = false
    }
    copyMode.value = !copyMode.value
}



async function create() {
    const list = await createSheet(fCode.value, curLevel.value)
    sheetsList.value = list
}
async function handleCreatePcb() {
    const list = await createPcb(fCode.value, curLevel.value)
    sheetsList.value = list
}

async function bomClick() {
    message.value = 'BOM 생성중 ...'
    const list = await createBom(fCode.value, curLevel.value)
    sheetsList.value = list
    message.value = 'BOM 업데이트 완료'
}
async function excelDownloadFile(level: string) {
    excelDownload(fCode.value, level)
}


async function copysheet(sheetId: string) {
    message.value = 'Sheet 복사중'
    const result = await copySheet(sheetId)
    if (result === 'true') {
        message.value = '복사 완료'
    } else {
        message.value = ' 복사 실패:' + result
    }
    sheetsList.value = await getSheetsByLevel(fCode.value, curLevel.value);
}

async function deleted(sheetId: string) {
    await deleteSheet(sheetId)
    sheetsList.value = await getSheetsByLevel(fCode.value, curLevel.value);
}
async function handleChangeSheetName(sheetId: string) {
    try {
        const { value } = await ElMessageBox.prompt('Please input sheet name', '이름변경', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            inputErrorMessage: 'Invalid Email',
        });

        const result = await changeSheetName(sheetId, value);
        if (result !== 'true') {
            throw new Error('서버에서 실패 응답을 받았습니다.');
        }
        message.value = `시트 이름이 변경되었습니다: ${sheetId} → ${value}`
        sheetsList.value = await getSheetsByLevel(fCode.value, curLevel.value);
    } catch (err) {
        ElMessage({
            type: 'error',
            message: err instanceof Error ? err.message : '입력이 취소되었거나 오류가 발생했습니다.',
        });
    }
}


onMounted(async () => {
    loading.value = false
    message.value = "P/N 입력 후 ENTER"
})

watch(() => code.join(""), (newVal) => {
    if (newVal.length === 4 && !newVal.includes("")) {
        console.log("입력 완료:", code)
        message.value = "모델코드 입력 완료: " + newVal
        // 여기에 searchModelCode(newVal) 같은 호출 넣어도 됨
    }
})



</script>

<style scoped>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 45vh;
}

.code-input {
    display: flex;
    gap: 10px;
}

.digit {
    /* width: 50px; */
    height: 60px;
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    border: none;
    border-bottom: 3px solid #000;
    outline: none;
    background: none;
}

.error-message {
    color: red;
    margin-top: 8px;
    text-align: center;
    font-size: 14px;
}

.hover-card {
    transition: 0.3s ease;
}

.hover-card:hover {
    background-color: #f0f9ff;
    transform: scale(1.02);
    border: 1px solid #409eff;
}

.selected {
    background-color: #a0d8ff !important;
    /* 선택된 항목 */
    border: 1px solid #409eff;
}

.hover-card_copy {
    transition: 0.3s ease;
}

.hover-card_copy:hover {
    background-color: #f0f9ff;
    transform: scale(1.02);
    border: 1px solid #409eff;
}

.selected_copy {
    background-color: #a0d8ff !important;
    /* 선택된 항목 */
    border: 1px solid #409eff;
}


.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.sheet-action {
    font-size: 18px;
    font-weight: 700;
    height: 100%;
    /* padding: 10px 20px; */
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 6px;
}

.sheet-action:hover {
    background-color: #f0f9ff;
    color: #409EFF;
    transform: scale(1.05);
}

.sheet-action-do {
    font-size: 18px;
    font-weight: 700;
    height: 100%;
    /* padding: 10px 20px; */
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 6px;
}

.sheet-action-do:hover {
    background-color: #f0f9ff;
    color: #409EFF;
    transform: scale(1.3);
}

::-webkit-scrollbar {
    display: none;
}
</style>

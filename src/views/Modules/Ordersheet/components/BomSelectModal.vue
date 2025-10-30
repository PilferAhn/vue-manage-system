<template>
    <div class="modal-overlay" @keyup.esc="$emit('close')" tabindex="0" ref="modalContainer">
        <div>
            <div class="mhead ">
                <div class="">
                    <h3>원자재 선택</h3>
                </div>
                <div style="background-color: red; padding: 0 20px; cursor: pointer;" @click="$emit('close')">
                    <span style="font-size: 25px;">
                        x
                    </span>
                </div>
            </div>
            <!-- <div class="mhead">
                <div>
                    <div>
                        count: {{ fullcount }}
                    </div>
                    필터
                </div>
            </div> -->
            <div class="modal">
                <table class="custom-top-table">
                    <tr class="flickering-banner">
                        <th>
                            BOM CODE
                        </th>
                        <th class="ccell">
                            DESC
                        </th>
                    </tr>
                    <tr>
                        <td class="ccell">
                            <input class="ccell" style="width: 99%;" v-model="bomCodeFilter"
                                placeholder="BOM CODE 검색" />
                        </td>
                        <td class="ccell">
                            <input class="ccell" style="width: 99%;" v-model="descFilter" placeholder="DESC 검색" />
                        </td>
                    </tr>
                    <tr v-for="(item, i) in filteredItems" :key="i" @click="selectItem(item)" class="modal-item ">
                        <td class="ccell">
                            {{ item.MATNR }}
                        </td>
                        <td class="ccell" style="text-align: left;">
                            {{ item.MAKTX }}
                        </td>
                    </tr>
                </table>


                <button @click="$emit('close')">닫기</button>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
const props = defineProps<{
    items: any[];
}>();
const emit = defineEmits(['select', 'close']);

const fullcount = ref(0)
function selectItem(item: any) {
    emit('select', item);
    emit('close');
}
const bomCodeFilter = ref('');
const descFilter = ref('');

const modalContainer = ref(null);

onMounted(() => {
    // 모달이 화면에 나타난 후 포커스를 줍니다.
    modalContainer.value.focus();
    fullcount.value = props.items.length
    console.log(props.items)
    const lastCharacters = props.items.map((item) => {
        // null이나 undefined 체크 및 문자열인지 확인합니다.
        if (item.MATNR && typeof item.MATNR === 'string' && item.MATNR.length > 0) {
            // slice(-1)을 사용하여 문자열의 가장 마지막 문자 1개를 가져옵니다.
            return item.MATNR.slice(-1);
        }
        return null; // 값이 없거나 유효하지 않은 경우 null 반환
    }).filter(char => char !== null); // null 값은 제거합니다.

    // 2. Set을 사용하여 중복을 제거합니다.
    const uniqueLastCharacters = new Set(lastCharacters);

    // 3. Set을 배열로 변환하여 사용합니다.
    const uniqueLastCharactersArray = Array.from(uniqueLastCharacters);

    // 결과를 콘솔에 출력합니다.
    console.log("중복 없는 MATNR의 마지막 문자:", uniqueLastCharactersArray);
});

const filteredItems = computed(() => {
    // 필터링할 원본 리스트를 가져옵니다.
    return props.items.filter(item => {
        const bomCode = item.MATNR ? item.MATNR.toLowerCase() : '';
        const desc = item.MAKTX ? item.MAKTX.toLowerCase() : '';

        const codeMatch = bomCode.includes(bomCodeFilter.value.toLowerCase());
        const descMatch = desc.includes(descFilter.value.toLowerCase());

        // 두 필터 조건 모두 만족하는 항목만 반환합니다.
        return codeMatch && descMatch;
    });
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.diagonal-rainbow-header {
    background: linear-gradient(to top right,
            /* 왼쪽 아래에서 시작해 오른쪽 위로 가는 대각선 방향 */
            red,
            /* 시작 색상 */
            orange,
            yellow,
            green,
            blue,
            indigo,
            violet
            /* 끝 색상 */
        );

    /* 텍스트가 잘 보이도록 대비되는 색상 및 그림자 추가 (선택 사항) */
    color: white;
    text-shadow: 1px 1px 2px black;
}

@keyframes flicker-animation {
    0% {
        background-color: #ff4d4d;
        /* 시작 색상 (밝은 빨간색) */
    }

    50% {
        background-color: white;
        background: linear-gradient(to top right,
                /* 왼쪽 아래에서 시작해 오른쪽 위로 가는 대각선 방향 */

                blue,
                indigo,
                violet,
                red,
                /* 시작 색상 */
                orange,
                yellow,
                green
                /* 끝 색상 */
            );

        /* 텍스트가 잘 보이도록 대비되는 색상 및 그림자 추가 (선택 사항) */
        color: white;
        text-shadow: 1px 1px 2px black;
        /* 중간 색상 (어두운 빨간색) */
    }

    100% {
        background: linear-gradient(to top right,
                /* 왼쪽 아래에서 시작해 오른쪽 위로 가는 대각선 방향 */
                red,
                /* 시작 색상 */
                orange,
                yellow,
                green,
                blue,
                indigo,
                violet
                /* 끝 색상 */
            );

        /* 텍스트가 잘 보이도록 대비되는 색상 및 그림자 추가 (선택 사항) */
        color: white;
        text-shadow: 1px 1px 2px black;
        /* 끝 색상 (시작 색상으로 돌아옴) */
    }
}

/* 2. 테이블 셀에 애니메이션 적용 */
.flickering-banner {
    /* 애니메이션 이름 | 지속 시간 | 반복 횟수(무한) | 타이밍 함수 */
    /* animation: flicker-animation 10.2s infinite linear; */

    /* 텍스트가 잘 보이도록 설정 (선택 사항) */
    color: white;
    background-color: black;
    font-weight: bold;
    /* text-shadow: 0 0 5px black; */
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 1000px;
    max-height: 500px;
    overflow-y: auto;
}

.mhead {
    background: white;
    padding: 20px;
    margin-bottom: 5px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    width: 1000px;
    max-height: 500px;
}

.modal-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
}

.modal-item:hover {
    background-color: #f0f0f0;
}

.ccell {
    line-height: 36px;
    /* background-color: #ffff99; */
    word-break: break-word;
    white-space: normal;
    text-align: center !important;
}

.custom-top-table {
    width: 100%;
    border: 1px solid black;
    border-collapse: collapse;
    font-family: Arial, 'Malgun Gothic', sans-serif;

    font-size: 13px;
    /* font-weight: bold; */
    table-layout: fixed;
}
</style>

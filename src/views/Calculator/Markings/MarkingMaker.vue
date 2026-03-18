<template>
    <el-form label-position="top" label-width="100px" ref="applicationForm">
        <div class="container" v-if="!loading" style="height:80vh;">

            <div class="container" style="padding: 15px; margin-bottom: 100px">
                <span style="font-weight: bold; text-align: center;font-size: 45px;">
                    마킹 설정 다운로드
                </span>
            </div>

            <div>

                <div style="position: relative; width: 240px;">
                    <div>기종명</div>
                    <input v-model="modelName" @input="filterModels" @focus="showModelSuggestions = true"
                        @blur="hideSuggestions" @keydown="handleKeydown" placeholder="기종명 검색" class="toss-select" />

                    <ul v-if="showModelSuggestions && filteredModels.length" style="position: absolute;
                            top: 70px;
                            left: 0;
                            right: 0;
                            background: white;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            max-height: 200px;
                            overflow-y: auto;
                            z-index: 1000;
                            padding: 0;
                            margin: 0;
                            list-style: none;
                        ">
                        <li v-for="(m, idx) in filteredModels" :key="m" @mousedown="selectModel(m)"
                            @mouseenter="highlightedIndex = idx" :style="{
                                padding: '10px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f1f1f1',
                                background: highlightedIndex === idx ? '#e6f0ff' : 'white'
                            }">
                            {{ m }}
                        </li>
                    </ul>
                </div>

                <div>
                    사이즈
                    <select v-model="size">
                        <option v-for="s in sizeList" :key="s" :value="s">
                            {{ s }}
                        </option>
                    </select>
                </div>

                <div>
                    타입
                    <select v-model="type">
                        <option v-for="t in typeList" :key="t" :value="t">
                            {{ t }}
                        </option>
                    </select>
                </div>
                <div>
                    pkgName
                    <select v-model="pkgName">
                        <option v-for="t in pkgNameList" :key="t" :value="t">
                            {{ t }}
                        </option>
                    </select>
                </div>


            </div>

            <div>
                <button @click.prevent="downloadFile">다운로드</button>
            </div>
            <div style="border: 1px solid black;">

                BOTTOM 이미지 추가
                <div>
                    <!-- 조건 담당자만/ 하드코딩 할꺼임 -->
                    <div>
                        <input type="file" accept=".zip" @change="handleZipUpload" />
                    </div>
                    <div>
                        <button @click.prevent="handleButtonUpload">업로드</button>
                    </div>
                </div>

            </div>
            <div style="border: 1px solid black;">
                마킹 체번 추가
                <!-- 조건 담당자만/ 하드코딩 할꺼임 -->
                <div>
                    <input type="file"
                        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        @change="handleExcel" />
                </div>
                <div>
                    <button @click.prevent="handleButtonExcelUpload">엑셀업로드</button>
                </div>
            </div>
            <div style="border: 1px solid black;">

                <div>타입 추가</div>

                <div style="display: flex; gap: 10px;">
                    <!-- 타입 선택 -->
                    <div>
                        종류

                        <select v-model="ftype">
                            <option value="">종류 선택</option>
                            <option value="size">사이즈</option>
                            <option value="type">타입</option>
                            <option value="pkgName">pkgName</option>
                        </select>

                    </div>

                    <!-- 값 입력 -->
                    <div>
                        <input v-model="inputValue" />
                    </div>

                    <!-- 추가 버튼 -->
                    <div>
                        <button @click="addType">추가</button>
                    </div>
                </div>


            </div>
            <div class="page">
                <div class="toss-card">
                    <div class="title">Grid 생성(담당자 전용)</div>

                    <div class="legend-wrap">
                        <div class="legend-item"><b>A</b> 고정문자(앞)</div>
                        <div class="legend-item"><b>U</b> 고정문자(뒤)</div>
                        <div class="legend-item"><b>X</b> DATA</div>
                        <div class="legend-item"><b style="font-size: 20px;">○</b> 인덱스</div>
                        <div class="legend-item"><b style="font-size: 20px;">●</b> 인덱스</div>
                        <div class="legend-item"><b>[]</b> 공란</div>
                    </div>
                    <div class="row-card" style="background-color: white;">
                        <div class="cell-row">

                            <select v-model="selectedSize" class="toss-select">
                                <option value="">사이즈 선택</option>

                                <option v-for="size in MsizeList" :key="size" :value="size">
                                    {{ size }}
                                </option>
                            </select>


                            <select v-model="selectedType" class="toss-select">
                                <option value="">타입 선택</option>
                                <option v-for="t in typeList" :key="t" :value="t">
                                    {{ t }}
                                </option>
                                <!-- <option value="">TYPE 선택</option>
                                <option value="SAW">SAW</option>
                                <option value="FBAR">FBAR</option>
                                <option value="QPX">QPX</option> -->
                            </select>
                        </div>
                    </div>
                    <div v-for="(row, rowIndex) in gridData" :key="rowIndex" class="row-card">
                        <div class="row-title">
                            {{ rowIndex + 1 }}번째 줄
                        </div>

                        <div class="cell-row">
                            <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell-card">
                                <div class="cell-label">칸 {{ colIndex + 1 }}</div>

                                <select v-model="cell.fval" class="toss-select">
                                    <option value="">선택</option>
                                    <option value="A">A</option>
                                    <option value="U">U</option>
                                    <option value="X">X</option>
                                    <option value="O" style="font-size: 20px;">○</option>
                                    <option value="Q" style="font-size: 20px;">●</option>
                                    <option value="S" style="font-size: 20px;">[]</option>
                                </select>

                                <!-- <select v-model="cell.ftype" class="toss-select">
                                    <option value="">유형 선택</option>
                                    <option value="TEXT">TEXT</option>
                                    <option value="DATE">DATE</option>
                                    <option value="LOT">LOT</option>
                                    <option value="INDEX">INDEX</option>
                                </select> -->
                            </div>
                        </div>
                    </div>

                    <div class="button-wrap">
                        <button type="button" class="toss-btn secondary" @click="resetGrid">
                            초기화
                        </button>
                        <button type="button" class="toss-btn primary" @click="saveGrid">
                            Grid 저장
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </el-form>
</template>

<script>
import axios from 'axios';
import Form from '../../form.vue';
export default {
    data() {
        return {
            loading: false,

            modelName: "",
            modelList: [],
            filteredModels: [],
            showModelSuggestions: false,
            highlightedIndex: -1,
            size: "",
            type: "",
            usage: "",


            // sizeList: ["0907", "20", "30"],
            // typeList: ["Mobile", "Mobile QPX", "TYPE3"],
            // pkgNameList: ["단일", "A0"],
            sizeList: [],
            typeList: [],
            pkgNameList: [],
            fileCodeList: [],
            ftype: "",
            fTypeList: ["기종명", "사이즈", "타입", "pkgName"],
            inputValue: "",
            zipfile: null,
            exfile: null,
            typeId: "0907",
            gridData: [
                [
                    { fval: "" },
                    { fval: "" },
                    { fval: "" }
                ],
                [
                    { fval: "" },
                    { fval: "" },
                    { fval: "" }
                ]
            ],
            MsizeList: [
                "0907", "1109", "1411", "1511",
                "1612", "1713", "1814", "2016", "2520"
            ],
            selectedSize: "",
            selectedType: "",
            selectedUsage: "",
        }
    },
    async mounted() {
        const res = await axios.get("/csp/getMkFilters");
        const mnres = await axios.get("/csp/getMkModels");
        const fileCode = await axios.get("/csp/getMkFileCode");
        this.fileCodeList = fileCode.data;
        const grouped = res.data.reduce((acc, cur) => {
            if (!acc[cur.ftype]) acc[cur.ftype] = [];
            acc[cur.ftype].push(cur.fvalue);
            return acc;
        }, {});

        console.log(mnres.data)

        this.sizeList = grouped.size || [];
        this.typeList = grouped.type || [];
        this.pkgNameList = grouped.pkgName || [];
        this.modelList = mnres.data.map(v => v.model_code);
        this.filteredModels = this.modelList;
    },
    watch: {
        size(newSize) {
            if (!newSize) {
                this.pkgNameList = [];
                return;
            }

            const filtered = this.fileCodeList
                .filter(v => v.fsize === newSize)
                .map(v => v.fpkg);

            // 중복 제거
            this.pkgNameList = [...new Set(filtered)];

            // 기존 선택값 초기화 (중요)
            this.pkgName = "";
        }
    },
    methods: {
        async downloadFile() {
            const params = {
                modelName: this.modelName,
                size: this.size,
                type: this.type,
                pkgName: this.pkgName
            }

            try {
                const response = await axios.post(
                    "/csp/createMarking",
                    params,
                    {
                        responseType: "blob"
                    }
                )
                console.log("sddsd", response.data)

                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement("a")

                link.href = url
                link.download = "marking.jpg"
                link.click()
                window.URL.revokeObjectURL(url)
            } catch (err) {
                console.error("There was an error with the submission", err);
                throw err;
            }
            console.log(params)
        },
        handleZipUpload(event) {

            const file = event.target.files[0]

            if (!file) return

            if (!file.name.endsWith(".zip")) {
                alert("ZIP 파일만 업로드 가능합니다.")
                event.target.value = ""
                return
            }
            this.zipfile = file
            console.log("선택된 ZIP:", file)
        },
        async handleButtonUpload() {
            console.log("업로드 버튼 클릭", this.zipfile)
            const formData = new FormData()
            formData.append('zipFiles', this.zipfile)

            const res = await axios.post('/csp/uploadTopThru', formData)
            console.log(res.data)
        },
        handleExcel(event) {
            const file = event.target.files[0]

            if (!file) return

            if (
                !file.name.toLowerCase().endsWith(".xlsx") &&
                !file.name.toLowerCase().endsWith(".xls")
            ) {
                alert("ZIP 파일만 업로드 가능합니다.")
                event.target.value = ""
                return
            }
            this.exfile = file
            console.log("선택된 ZIP:", file)
        },
        async handleButtonExcelUpload() {
            console.log("업로드 버튼 클릭", this.exfile)
            const formData = new FormData()
            formData.append('exfile', this.exfile)

            const res = await axios.post('/csp/uploadMarkerCode', formData)
        },
        resetGrid() {
            this.gridData = this.gridData.map(row =>
                row.map(() => ({
                    fval: ""
                }))
            )
        },
        async saveGrid() {
            const rows = []

            this.gridData.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    rows.push({
                        type: this.selectedType,
                        size: this.selectedSize,
                        row_idx: rowIndex,
                        col_idx: colIndex,
                        fval: cell.fval,
                    })
                })
            })

            console.log("저장 데이터:", rows)

            response = await axios.post("/csp/saveMarkingGrid", rows)
            console.log(response.data)
        },
        async addType() {
            if (!this.inputValue) return;
            const req = {
                ftype: this.ftype,
                fvalue: this.inputValue
            };
            console.log("se x", req)
            response = await axios.post('/csp/addMkOptions', req)
            console.log(response.data)

            // this.inputValue = ""; // 초기화
        },
        handleKeydown(e) {
            if (!this.showModelSuggestions) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                this.highlightedIndex++;
                if (this.highlightedIndex >= this.filteredModels.length) {
                    this.highlightedIndex = 0;
                }
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                this.highlightedIndex--;
                if (this.highlightedIndex < 0) {
                    this.highlightedIndex = this.filteredModels.length - 1;
                }
            }

            if (e.key === "Enter") {
                e.preventDefault();
                if (this.highlightedIndex >= 0) {
                    this.selectModel(this.filteredModels[this.highlightedIndex]);
                }
            }
        },

        filterModels() {
            const keyword = this.modelName.toLowerCase();

            this.filteredModels = this.modelList.filter(v =>
                v.toLowerCase().includes(keyword)
            );

            this.showModelSuggestions = true;
            this.highlightedIndex = -1; // 초기화
        },

        selectModel(model) {
            this.modelName = model;
            this.showModelSuggestions = false;
            this.highlightedIndex = -1;
        },

        hideSuggestions() {
            setTimeout(() => {
                this.showModelSuggestions = false;
            }, 150);
        }

    }
}
</script>

<style scoped>
.page {
    background: #f9fafb;
    min-height: 100vh;
    padding: 40px 20px;
}

.toss-card {
    max-width: 980px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.title {
    font-size: 28px;
    font-weight: 700;
    color: #191f28;
    margin-bottom: 8px;
}

.desc {
    font-size: 15px;
    color: #8b95a1;
    margin-bottom: 24px;
}

.legend-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 24px;
}

.legend-item {
    background: #f2f4f6;
    color: #4e5968;
    border-radius: 14px;
    padding: 10px 14px;
    font-size: 14px;
}

.row-card {
    background: #f9fafb;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 20px;
}

.row-title {
    font-size: 18px;
    font-weight: 700;
    color: #191f28;
    margin-bottom: 16px;
}

.cell-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.cell-card {
    flex: 1;
    min-width: 180px;
    background: #ffffff;
    border: 1px solid #eef1f4;
    border-radius: 18px;
    padding: 16px;
}

.cell-label {
    font-size: 14px;
    font-weight: 600;
    color: #4e5968;
    margin-bottom: 12px;
}

.toss-select {
    width: 100%;
    height: 44px;
    border: 1px solid #e5e8eb;
    border-radius: 12px;
    padding: 0 12px;
    font-size: 15px;
    color: #191f28;
    background: #fff;
    margin-bottom: 10px;
    outline: none;
}

.toss-select:focus {
    border-color: #3182f6;
    box-shadow: 0 0 0 3px rgba(49, 130, 246, 0.12);
}

.button-wrap {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 28px;
}

.toss-btn {
    height: 48px;
    padding: 0 20px;
    border: none;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
}

.toss-btn.primary {
    background: #3182f6;
    color: #ffffff;
}

.toss-btn.secondary {
    background: #f2f4f6;
    color: #4e5968;
}
</style>
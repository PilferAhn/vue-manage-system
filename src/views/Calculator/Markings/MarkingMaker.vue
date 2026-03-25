<template>
    <el-form label-position="top" label-width="100px" ref="applicationForm">
        <div class="page" v-if="!loading">
            <div class="page-header">
                <div class="page-title">마킹 설정 다운로드</div>
                <div class="page-desc">마킹 설정 파일을 다운로드하거나 업로드하세요.</div>
            </div>

            <!-- 다운로드 섹션 -->
            <div class="toss-card">
                <div class="title">파일 다운로드</div>
                <div class="form-grid">
                    <div class="form-field" style="position: relative;">
                        <div class="field-label">기종명</div>
                        <input
                            v-model="modelName"
                            @input="filterModels"
                            @focus="showModelSuggestions = true"
                            @blur="hideSuggestions"
                            @keydown="handleKeydown"
                            placeholder="기종명 검색"
                            class="toss-input"
                        />
                        <ul v-if="showModelSuggestions && filteredModels.length" class="suggestion-list">
                            <li
                                v-for="(m, idx) in filteredModels"
                                :key="m"
                                @mousedown="selectModel(m)"
                                @mouseenter="highlightedIndex = idx"
                                :class="['suggestion-item', { active: highlightedIndex === idx }]"
                            >
                                {{ m }}
                            </li>
                        </ul>
                    </div>

                    <div class="form-field">
                        <div class="field-label">사이즈</div>
                        <select v-model="size" class="toss-select">
                            <option value="">사이즈 선택</option>
                            <option v-for="s in sizeList" :key="s" :value="s">{{ s }}</option>
                        </select>
                    </div>

                    <div class="form-field">
                        <div class="field-label">타입</div>
                        <select v-model="type" class="toss-select">
                            <option value="">타입 선택</option>
                            <option v-for="t in typeList" :key="t" :value="t">{{ t }}</option>
                        </select>
                    </div>

                    <div class="form-field">
                        <div class="field-label">pkgName</div>
                        <select v-model="pkgName" class="toss-select">
                            <option value="">pkgName 선택</option>
                            <option v-for="t in pkgNameList" :key="t" :value="t">{{ t }}</option>
                        </select>
                    </div>
                </div>
                <div class="button-wrap">
                    <button type="button" class="toss-btn primary" @click.prevent="downloadFile">
                        다운로드
                    </button>
                </div>
            </div>
            <div v-if="ismanager">
            <!-- BOTTOM 이미지 업로드 섹션 -->
            <div class="toss-card">
                <div class="title">BOTTOM 이미지 추가</div>
                <div class="desc">담당자 전용 기능입니다.</div>
                <div class="upload-row">
                    <div class="form-field" style="flex:1;">
                        <div class="field-label">ZIP 파일 선택</div>
                        <input type="file" accept=".zip" @change="handleZipUpload" class="toss-file-input" />
                    </div>
                    <div class="button-wrap" style="margin-top: 0; align-self: flex-end;">
                        <button type="button" class="toss-btn primary" @click.prevent="handleButtonUpload">
                            업로드
                        </button>
                    </div>
                </div>
            </div>

            <!-- 마킹 체번 추가 섹션 -->
            <div class="toss-card">
                <div class="title">마킹 체번 추가</div>
                <div class="desc">담당자 전용 기능입니다.</div>
                <div class="upload-row">
                    <div class="form-field" style="flex:1;">
                        <div class="field-label">엑셀 파일 선택</div>
                        <input
                            type="file"
                            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            @change="handleExcel"
                            class="toss-file-input"
                        />
                    </div>
                    <div class="button-wrap" style="margin-top: 0; align-self: flex-end;">
                        <button type="button" class="toss-btn primary" @click.prevent="handleButtonExcelUpload">
                            엑셀 업로드
                        </button>
                    </div>
                </div>
            </div>

            <!-- 타입 추가 섹션 -->
            <div class="toss-card">
                <div class="title">타입 추가</div>
                <div class="form-grid">
                    <div class="form-field">
                        <div class="field-label">종류</div>
                        <select v-model="ftype" class="toss-select">
                            <option value="">종류 선택</option>
                            <option value="size">사이즈</option>
                            <option value="type">타입</option>
                            <option value="pkgName">pkgName</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <div class="field-label">값 입력</div>
                        <input v-model="inputValue" class="toss-input" placeholder="추가할 값을 입력하세요" />
                    </div>
                </div>
                <div class="button-wrap">
                    <button type="button" class="toss-btn primary" @click="addType">추가</button>
                </div>
            </div>

            <!-- Grid 생성 섹션 -->
            <div class="toss-card">
                <div class="title">Grid 생성 <span class="badge">담당자 전용</span></div>

                <div class="legend-wrap">
                    <div class="legend-item"><b>A</b> 고정문자(앞)</div>
                    <div class="legend-item"><b>U</b> 고정문자(뒤)</div>
                    <div class="legend-item"><b>X</b> DATA</div>
                    <div class="legend-item"><b style="font-size: 18px;">○</b> 인덱스</div>
                    <div class="legend-item"><b style="font-size: 18px;">●</b> 인덱스</div>
                    <div class="legend-item"><b>[]</b> 공란</div>
                </div>

                <div class="row-card" style="background-color: white;">
                    <div class="cell-row">
                        <div class="form-field" style="flex:1;">
                            <div class="field-label">사이즈</div>
                            <select v-model="selectedSize" class="toss-select">
                                <option value="">사이즈 선택</option>
                                <option v-for="size in MsizeList" :key="size" :value="size">{{ size }}</option>
                            </select>
                        </div>
                        <div class="form-field" style="flex:1;">
                            <div class="field-label">타입</div>
                            <select v-model="selectedType" class="toss-select">
                                <option value="">타입 선택</option>
                                <option v-for="t in typeList" :key="t" :value="t">{{ t }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div v-for="(row, rowIndex) in gridData" :key="rowIndex" class="row-card">
                    <div class="row-title">{{ rowIndex + 1 }}번째 줄</div>
                    <div class="cell-row">
                        <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell-card">
                            <div class="cell-label">칸 {{ colIndex + 1 }}</div>
                            <select v-model="cell.fval" class="toss-select">
                                <option value="">선택</option>
                                <option value="A">A</option>
                                <option value="U">U</option>
                                <option value="X">X</option>
                                <option value="O">○</option>
                                <option value="Q">●</option>
                                <option value="S">[]</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="button-wrap">
                    <button type="button" class="toss-btn secondary" @click="resetGrid">초기화</button>
                    <button type="button" class="toss-btn primary" @click="saveGrid">Grid 저장</button>
                </div>
            </div>
</div>
        </div>
    </el-form>
</template>

<script>
import axios from 'axios';
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
            pkgName: "",
            usage: "",
            sizeList: [],
            typeList: [],
            pkgNameList: [],
            fileCodeList: [],
            ftype: "",
            inputValue: "",
            zipfile: null,
            exfile: null,
            ismanager: false,
            gridData: [
                [{ fval: "" }, { fval: "" }, { fval: "" }],
                [{ fval: "" }, { fval: "" }, { fval: "" }]
            ],
            MsizeList: ["0907", "1109", "1411", "1511", "1612", "1713", "1814", "2016", "2520"],
            selectedSize: "",
            selectedType: "",
        }
    },
    async mounted() {
        const res = await axios.get("/csp/getMkFilters");
        const mnres = await axios.get("/csp/getMkModels");
        const fileCode = await axios.get("/csp/getMkFileCode");
        const empId = localStorage.getItem("id");
        if(empId == 'admin'){
            this.ismanager = true;
        }
        this.fileCodeList = fileCode.data;
        const grouped = res.data.reduce((acc, cur) => {
            if (!acc[cur.ftype]) acc[cur.ftype] = [];
            acc[cur.ftype].push(cur.fvalue);
            return acc;
        }, {});
        this.sizeList = grouped.size || [];
        this.typeList = grouped.type || [];
        this.pkgNameList = grouped.pkgName || [];
        this.modelList = mnres.data.map(v => v.model_code);
        this.filteredModels = this.modelList;
    },
    watch: {
        size(newSize) {
            if (!newSize) { this.pkgNameList = []; return; }
            const filtered = this.fileCodeList.filter(v => v.fsize === newSize).map(v => v.fpkg);
            this.pkgNameList = [...new Set(filtered)];
            this.pkgName = "";
        }
    },
    methods: {
        async downloadFile() {
            const params = { modelName: this.modelName, size: this.size, type: this.type, pkgName: this.pkgName };
            try {
                const response = await axios.post("/csp/createMarking", params, { responseType: "blob" });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.download = "marking.jpg";
                link.click();
                window.URL.revokeObjectURL(url);
            } catch (err) { console.error(err); throw err; }
        },
        handleZipUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            if (!file.name.endsWith(".zip")) { alert("ZIP 파일만 업로드 가능합니다."); event.target.value = ""; return; }
            this.zipfile = file;
        },
        async handleButtonUpload() {
            const formData = new FormData();
            formData.append('zipFiles', this.zipfile);
            const res = await axios.post('/csp/uploadTopThru', formData);
            console.log(res.data);
        },
        handleExcel(event) {
            const file = event.target.files[0];
            if (!file) return;
            if (!file.name.toLowerCase().endsWith(".xlsx") && !file.name.toLowerCase().endsWith(".xls")) {
                alert("엑셀 파일만 업로드 가능합니다."); event.target.value = ""; return;
            }
            this.exfile = file;
        },
        async handleButtonExcelUpload() {
            const formData = new FormData();
            formData.append('exfile', this.exfile);
            await axios.post('/csp/uploadMarkerCode', formData);
        },
        resetGrid() {
            this.gridData = this.gridData.map(row => row.map(() => ({ fval: "" })));
        },
        async saveGrid() {
            const rows = [];
            this.gridData.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    rows.push({ type: this.selectedType, size: this.selectedSize, row_idx: rowIndex, col_idx: colIndex, fval: cell.fval });
                });
            });
            const response = await axios.post("/csp/saveMarkingGrid", rows);
            console.log(response.data);
        },
        async addType() {
            if (!this.inputValue) return;
            const req = { ftype: this.ftype, fvalue: this.inputValue };
            const response = await axios.post('/csp/addMkOptions', req);
            console.log(response.data);
        },
        handleKeydown(e) {
            if (!this.showModelSuggestions) return;
            if (e.key === "ArrowDown") { e.preventDefault(); this.highlightedIndex = (this.highlightedIndex + 1) % this.filteredModels.length; }
            if (e.key === "ArrowUp") { e.preventDefault(); this.highlightedIndex = (this.highlightedIndex - 1 + this.filteredModels.length) % this.filteredModels.length; }
            if (e.key === "Enter") { e.preventDefault(); if (this.highlightedIndex >= 0) this.selectModel(this.filteredModels[this.highlightedIndex]); }
        },
        filterModels() {
            const keyword = this.modelName.toLowerCase();
            this.filteredModels = this.modelList.filter(v => v.toLowerCase().includes(keyword));
            this.showModelSuggestions = true;
            this.highlightedIndex = -1;
        },
        selectModel(model) {
            this.modelName = model;
            this.showModelSuggestions = false;
            this.highlightedIndex = -1;
        },
        hideSuggestions() {
            setTimeout(() => { this.showModelSuggestions = false; }, 150);
        }
    }
}
</script>

<style scoped>
.page {
    background: #f9fafb;
    min-height: 100vh;
    padding: 40px 20px;
    max-width: 1000px;
    margin: 0 auto;
}

.page-header {
    margin-bottom: 32px;
}

.page-title {
    font-size: 32px;
    font-weight: 800;
    color: #191f28;
    margin-bottom: 6px;
}

.page-desc {
    font-size: 15px;
    color: #8b95a1;
}

/* 카드 */
.toss-card {
    background: #ffffff;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
    margin-bottom: 20px;
}

.title {
    font-size: 20px;
    font-weight: 700;
    color: #191f28;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.badge {
    font-size: 12px;
    font-weight: 600;
    background: #fff0f0;
    color: #f04452;
    border-radius: 8px;
    padding: 3px 10px;
}

.desc {
    font-size: 14px;
    color: #8b95a1;
    margin-bottom: 20px;
}

/* 폼 그리드 */
.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.field-label {
    font-size: 14px;
    font-weight: 600;
    color: #4e5968;
}

/* 인풋/셀렉트 공통 */
.toss-input,
.toss-select {
    width: 100%;
    height: 44px;
    border: 1px solid #e5e8eb;
    border-radius: 12px;
    padding: 0 14px;
    font-size: 15px;
    color: #191f28;
    background: #fff;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.toss-input:focus,
.toss-select:focus {
    border-color: #3182f6;
    box-shadow: 0 0 0 3px rgba(49, 130, 246, 0.12);
}

/* 파일 인풋 */
.toss-file-input {
    width: 100%;
    height: 44px;
    border: 1.5px dashed #d1d6db;
    border-radius: 12px;
    padding: 0 14px;
    font-size: 14px;
    color: #4e5968;
    background: #f9fafb;
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.toss-file-input:hover {
    border-color: #3182f6;
    background: #f0f6ff;
}

/* 업로드 행 */
.upload-row {
    display: flex;
    gap: 16px;
    align-items: flex-end;
}

/* 자동완성 */
.suggestion-list {
    position: absolute;
    top: 76px;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e5e8eb;
    border-radius: 12px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    padding: 6px;
    margin: 0;
    list-style: none;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.10);
}

.suggestion-item {
    padding: 10px 12px;
    cursor: pointer;
    border-radius: 8px;
    font-size: 14px;
    color: #191f28;
    transition: background 0.1s;
}

.suggestion-item:hover,
.suggestion-item.active {
    background: #e8f1ff;
    color: #3182f6;
}

/* 버튼 */
.button-wrap {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.toss-btn {
    height: 44px;
    padding: 0 22px;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
}

.toss-btn:active {
    transform: scale(0.97);
}

.toss-btn.primary {
    background: #3182f6;
    color: #ffffff;
}

.toss-btn.primary:hover {
    opacity: 0.88;
}

.toss-btn.secondary {
    background: #f2f4f6;
    color: #4e5968;
}

.toss-btn.secondary:hover {
    background: #e5e8eb;
}

/* Legend */
.legend-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
}

.legend-item {
    background: #f2f4f6;
    color: #4e5968;
    border-radius: 12px;
    padding: 8px 14px;
    font-size: 13px;
}

/* Row 카드 */
.row-card {
    background: #f9fafb;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
}

.row-title {
    font-size: 16px;
    font-weight: 700;
    color: #191f28;
    margin-bottom: 14px;
}

.cell-row {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
}

.cell-card {
    flex: 1;
    min-width: 160px;
    background: #ffffff;
    border: 1px solid #eef1f4;
    border-radius: 14px;
    padding: 14px;
}

.cell-label {
    font-size: 13px;
    font-weight: 600;
    color: #8b95a1;
    margin-bottom: 10px;
}
</style>
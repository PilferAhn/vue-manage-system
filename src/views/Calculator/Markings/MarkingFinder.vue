<template>
    <el-form label-position="top" label-width="100px" ref="applicationForm">
        <div class="page" v-if="!loading">
            <div class="page-header">
                <div class="page-title">POD(PKG of Dimension)</div>
                <!-- <div class="page-desc">마킹 설정 파일을 다운로드하거나 업로드하세요.</div> -->
            </div>

            <!-- 다운로드 섹션 -->
            <div class="toss-card">
                <div class="title">파일 다운로드</div>
                <div class="form-grid">
                    <div class="form-field">
                        <div class="field-label">고객구분</div>
                        <select v-model="customer" class="toss-select">
                            <option value="">고객구분 선택</option>
                            <option v-for="c in customerList" :key="c" :value="c">{{ c }}</option>
                        </select>
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
                        <div class="field-label">두께</div>
                        <select v-model="pkgName" class="toss-select">
                            <option value="">두께 선택</option>
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
            <!-- 디렉터리 구조 -->
            <div class="toss-card">
                <div class="title">
                    디렉터리 구조
                    <span class="badge" v-if="treeTotal">{{ treeTotal }}개 파일</span>
                </div>
                <div class="desc">고객구분 &gt; 사이즈 &gt; 패키지 순으로 등록된 POD 파일을 확인하고 내려받을 수 있습니다.</div>

                <div class="tree-toolbar">
                    <input v-model="treeKeyword" type="text" class="toss-input tree-search"
                        placeholder="고객구분 / 사이즈 / 패키지 / 파일명 검색" />
                    <button type="button" class="toss-btn secondary" @click.prevent="expandAll">모두 펼치기</button>
                    <button type="button" class="toss-btn secondary" @click.prevent="collapseAll">모두 접기</button>
                    <button type="button" class="toss-btn secondary" @click.prevent="fetchTree">새로고침</button>
                </div>

                <div v-if="treeLoading" class="tree-empty">불러오는 중...</div>
                <div v-else-if="!filteredCustomers.length" class="tree-empty">표시할 파일이 없습니다.</div>
                <div v-else class="tree">
                    <div v-for="c in filteredCustomers" :key="c.name" class="tree-node">
                        <div class="tree-row level-1" @click="toggle(customerKey(c))">
                            <span class="arrow" :class="{ open: isOpen(customerKey(c)) }">▶</span>
                            <span class="node-name">{{ c.name }}</span>
                            <span class="node-count">{{ countFiles(c) }}</span>
                        </div>

                        <div v-show="isOpen(customerKey(c))" class="tree-children">
                            <div v-for="s in c.sizes" :key="s.name" class="tree-node">
                                <div class="tree-row level-2" @click="toggle(sizeKey(c, s))">
                                    <span class="arrow" :class="{ open: isOpen(sizeKey(c, s)) }">▶</span>
                                    <span class="node-name">{{ s.name }}</span>
                                    <span class="node-count">{{ countFiles(s) }}</span>
                                </div>

                                <div v-show="isOpen(sizeKey(c, s))" class="tree-children">
                                    <div v-for="p in s.packages" :key="p.name" class="tree-node">
                                        <div class="tree-row level-3" @click="toggle(packageKey(c, s, p))">
                                            <span class="arrow" :class="{ open: isOpen(packageKey(c, s, p)) }">▶</span>
                                            <span class="node-name">{{ p.name }}</span>
                                            <span class="node-count">{{ countFiles(p) }}</span>
                                        </div>

                                        <div v-show="isOpen(packageKey(c, s, p))" class="tree-children">
                                            <div v-for="f in p.files" :key="f.fid" class="file-row">
                                                <div class="file-info">
                                                    <div class="file-name">{{ f.fileName }}</div>
                                                    <div class="file-meta">
                                                        <span v-if="f.thickness">두께 {{ f.thickness }}</span>
                                                        <span v-if="f.createdAt">{{ formatDate(f.createdAt) }}</span>
                                                    </div>
                                                </div>
                                                <button type="button" class="toss-btn primary small"
                                                    :disabled="downloadingFid === f.fid"
                                                    @click.prevent="downloadTreeFile(f)">
                                                    {{ downloadingFid === f.fid ? '받는 중' : '다운로드' }}
                                                </button>
                                            </div>
                                            <div v-if="!p.files || !p.files.length" class="tree-empty small">파일 없음</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="ismanager">
                <!-- BOTTOM 이미지 업로드 섹션 -->
                <div class="toss-card">
                    <div class="title">POD 추가</div>
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
            customer: "",
            size: "",
            type: "",
            pkgName: "",
            usage: "",
            customerList: [],
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
            treeData: [],
            treeTotal: 0,
            treeLoading: false,
            treeKeyword: "",
            expandedKeys: {},
            downloadingFid: null,
        }
    },
    async mounted() {
        const res = await axios.get("/csp/getMkFilters");
        const mnres = await axios.get("/csp/getMkModels");
        const fileCode = await axios.get("/csp/getMkFileCode");
        const empId = localStorage.getItem("id");
        if (empId == 'admin') {
            this.ismanager = true;
        }
        this.fileCodeList = fileCode.data;
        const grouped = res.data.reduce((acc, cur) => {
            if (!acc[cur.ftype]) acc[cur.ftype] = [];
            acc[cur.ftype].push(cur.fvalue);
            return acc;
        }, {});
        this.customerList = grouped.customer || [];
        this.sizeList = grouped.size || [];
        this.typeList = grouped.type || [];
        this.pkgNameList = grouped.pkgName || [];
        this.modelList = mnres.data.map(v => v.model_code);
        this.filteredModels = this.modelList;
        this.fetchTree();
    },
    computed: {
        filteredCustomers() {
            const kw = this.treeKeyword.trim().toLowerCase();
            if (!kw) return this.treeData;
            const hit = (v) => String(v ?? "").toLowerCase().includes(kw);

            return this.treeData
                .map(c => {
                    const cHit = hit(c.name);
                    const sizes = (c.sizes || [])
                        .map(s => {
                            const sHit = cHit || hit(s.name);
                            const packages = (s.packages || [])
                                .map(p => {
                                    const pHit = sHit || hit(p.name);
                                    const files = (p.files || [])
                                        .filter(f => pHit || hit(f.fileName) || hit(f.thickness));
                                    return files.length ? { ...p, files } : null;
                                })
                                .filter(Boolean);
                            return packages.length ? { ...s, packages } : null;
                        })
                        .filter(Boolean);
                    return sizes.length ? { ...c, sizes } : null;
                })
                .filter(Boolean);
        }
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
        async fetchTree() {
            this.treeLoading = true;
            try {
                const res = await axios.get("/csp/getDomianTree");
                this.treeData = res.data?.customers || [];
                this.treeTotal = res.data?.total || 0;
                if (!this.customerList.length) {
                    this.customerList = this.treeData.map(c => c.name);
                }
            } catch (err) {
                console.error(err);
                this.treeData = [];
                this.treeTotal = 0;
            } finally {
                this.treeLoading = false;
            }
        },
        customerKey(c) { return `c:${c.name}`; },
        sizeKey(c, s) { return `s:${c.name}/${s.name}`; },
        packageKey(c, s, p) { return `p:${c.name}/${s.name}/${p.name}`; },
        isOpen(key) { return !!this.expandedKeys[key]; },
        toggle(key) {
            this.expandedKeys = { ...this.expandedKeys, [key]: !this.expandedKeys[key] };
        },
        allKeys() {
            const keys = [];
            this.filteredCustomers.forEach(c => {
                keys.push(this.customerKey(c));
                (c.sizes || []).forEach(s => {
                    keys.push(this.sizeKey(c, s));
                    (s.packages || []).forEach(p => keys.push(this.packageKey(c, s, p)));
                });
            });
            return keys;
        },
        expandAll() {
            const next = {};
            this.allKeys().forEach(k => { next[k] = true; });
            this.expandedKeys = next;
        },
        collapseAll() { this.expandedKeys = {}; },
        countFiles(node) {
            if (node.files) return node.files.length;
            if (node.packages) return node.packages.reduce((n, p) => n + this.countFiles(p), 0);
            if (node.sizes) return node.sizes.reduce((n, s) => n + this.countFiles(s), 0);
            return 0;
        },
        formatDate(v) {
            if (!v) return "";
            return String(v).replace("T", " ").slice(0, 16);
        },
        async downloadTreeFile(file) {
            this.downloadingFid = file.fid;
            try {
                const response = await axios.get(`/csp/downloadDomian/${file.fid}`, { responseType: "blob" });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.download = file.fileName || `pod_${file.fid}`;
                link.click();
                window.URL.revokeObjectURL(url);
            } catch (err) {
                console.error(err);
                alert("파일 다운로드에 실패했습니다.");
            } finally {
                this.downloadingFid = null;
            }
        },
        async downloadFile() {
            const params = { modelName: this.modelName, customer: this.customer, size: this.size, type: this.type, pkgName: this.pkgName };
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
            const res = await axios.post('/csp/uploadDomian', formData);
            console.log(res.data);
            this.fetchTree();
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

/* 디렉터리 트리 */
.tree-toolbar {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.tree-search {
    flex: 1;
    min-width: 220px;
}

.tree {
    border: 1px solid #eef1f4;
    border-radius: 16px;
    padding: 8px;
    max-height: 480px;
    overflow-y: auto;
}

.tree-children {
    padding-left: 18px;
    border-left: 1px solid #eef1f4;
    margin-left: 12px;
}

.tree-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
    transition: background 0.1s;
}

.tree-row:hover {
    background: #f2f4f6;
}

.tree-row .arrow {
    font-size: 10px;
    color: #8b95a1;
    transition: transform 0.15s;
}

.tree-row .arrow.open {
    transform: rotate(90deg);
}

.tree-row .node-name {
    font-size: 15px;
    font-weight: 700;
    color: #191f28;
}

.tree-row.level-2 .node-name {
    font-size: 14px;
    font-weight: 600;
    color: #333d4b;
}

.tree-row.level-3 .node-name {
    font-size: 14px;
    font-weight: 500;
    color: #4e5968;
}

.node-count {
    font-size: 12px;
    color: #8b95a1;
    background: #f2f4f6;
    border-radius: 8px;
    padding: 2px 8px;
}

.file-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
}

.file-row:hover {
    background: #f9fafb;
}

.file-info {
    flex: 1;
    min-width: 0;
}

.file-name {
    font-size: 14px;
    color: #191f28;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file-meta {
    display: flex;
    gap: 10px;
    font-size: 12px;
    color: #8b95a1;
    margin-top: 2px;
}

.toss-btn.small {
    height: 32px;
    padding: 0 14px;
    font-size: 13px;
    border-radius: 10px;
}

.toss-btn:disabled {
    opacity: 0.5;
    cursor: default;
}

.tree-empty {
    text-align: center;
    color: #8b95a1;
    font-size: 14px;
    padding: 28px 0;
}

.tree-empty.small {
    padding: 10px 0;
    font-size: 13px;
    text-align: left;
    padding-left: 12px;
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
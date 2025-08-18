<template>

</template>
<script lang="ts" setup>

const { createApp } = Vue;
//const BASE_URL = 'http://10.20.10.128/api';
const BASE_URL = 'http://10.60.41.75/api';
createApp({
    data() {
        return {
            activeTab: 'tab1',
            activeInnerTab: 'inner0',
            categories: [
                { group: 'saw', id: 'pkg', label: 'PKG' },
                { group: 'pcb_saw', id: 'pcb_saw', label: 'PCB' },
                { group: 'pcb_module', id: 'pcb_module', label: 'PCB' },
                { group: 'ic', id: 'switch', label: 'SWITCH' },
                { group: 'ic', id: 'lna', label: 'LNA' },
                { group: 'ic', id: 'combo', label: 'COMBO' },
                { group: 'smd', id: 'capaciter', label: 'CAPACITER' },
                { group: 'smd', id: 'inductor', label: 'INDUCTOR' },
                { group: 'smd', id: 'resister', label: 'RESISTER' },
                { group: 'carrier', id: 'carrier', label: 'CARRIER TAPE' },
                { group: 'molding', id: 'epoxy', label: '액상' },
                { group: 'molding', id: 'polyfilm', label: '필름' },
                { group: 'cover', id: 'cover', label: 'COVER TAPE' },
            ],
            sizeOptions: {
                pkg: ['0 (1411)', '1 (1511)', '2 (2016)', '3 (-)', '4 (1814)', '5 (1410)', '6 (2520)', '7 (1713)', '8 (1816)', '9 (1109)', 'A (1914)', 'B (907)', 'C (SCSP)', 'D (1608)', 'D (2012)', 'E (1612)', 'F (6050)', 'G (3025)', 'H (1711)'],
                pcb_saw: ['0 (1411)', '1 (1511)', '2 (2016)', '3 (-)', '4 (1814)', '5 (1410)', '6 (2520)', '7 (1713)', '8 (1816)', '9 (1109)', 'A (1914)', 'B (907)', 'C (SCSP)', 'D (1608)', 'D (2012)', 'E (1612)', 'F (6050)', 'G (3025)', 'H (1711)'],
                pcb_module: ['1511', '1814', '2016', '3536', '3931', '4027', '4840', '5040', '6045', '6242', '6941', '6962', '7462'],
                carrier: ['1109', '1511', '1814', '2016', '2020', '2218', '2422', '2520', '2726', '2925', '2929', '3026', '3030', '3230', '3426', '3530', '3532', '3635', '3732', '3931', '3939', '4030', '4330', '4342', '4840', '5030', '5040', '6050'],
                cover: ['-'],
                lna: ['LNA', 'COMBO'],
                capaciter: ['0 (0603)', '1 (1005)', '2 (1608)', '3 (0402)'],
                inductor: ['0 (0603)', '1 (1005)', '2 (0402)'],
                resister: ['0 (0603)', '1 (1005)', '2 (1608)', '3 (0402)', '4 (1915)'],
                epoxy: ['10 (100T)', '23 (230T)', '24 (240T)', '26 (260T)'],
                polyfilm: ['10 (100T)', '23 (230T)', '24 (240T)', '26 (260T)'],
            },
            hoveredRow: null,
            selectedRow: null,
            makers: [],
            selectedCategory1: '',
            selectedCategory2: '',
            selectedType: '',
            selectedSize: '',
            selectedSize1: '',
            selectedSize2: '',
            partNumber: '',
            selectedMaker: '',
            resultdescription: '',
            description: '',
            result: '',
            results: [],
            generated: false,
            PlannedPrice: '',
            RoudingValue: '',
            resultcode: '',
            index1: '',
            index2: '',
            seq1: '',
            version1: '1',
            lastverstring: '',
            description1: '',
            description2: '',
            description3: '',
            lastcode: '',
            materials: [],
            currentPage: 1,
            itemsPerPage: 20,
            originalMatnr: '',
            editModalVisible: false,
            editForm: {
                matnr: '',
                maktx: '',
                maker: '',
                // 나머지 필드도 필요에 따라 추가
            },
            editIndex: null,
            managerflag: '',
            loginflag: '',
            loginid: '',
            loginpw: '',
            accstring: '',
        };
    },
    mounted() {
        this.loadNewMaterials(); // 페이지 로드시 실행

        setInterval(() => {
            this.loadNewMaterials();
            console.log('mounted 10 sec Interval 1');
        }, 60000);

        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            this.loginflag = true;
            if ([3, 2].includes(parsedUser.ulev)) {
                this.managerflag = true;
            }
            this.loginid = parsedUser.ulid;
            console.log('자동 로그인됨:', parsedUser);
        }
    },
    computed: {
        level2Options() {
            return this.sizeOptions[this.selectedCategory2] || [];
        },
        totalPages() {
            return Math.ceil(this.materials.length / this.itemsPerPage);
        },
        pagedMaterials() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.materials.slice(start, start + this.itemsPerPage);
        },
    },
    methods: {
        async generateResult(recalc = true) {
            this.checkFormat();

            const { selectedCategory1: category, selectedSize1, selectedSize2, selectedSize, selectedMaker, partNumber, selectedType, description: baseDescription } = this;

            const makerFirst = selectedMaker.trim().charAt(0);
            const partFirst = String(partNumber).trim().charAt(0);
            const paddedPart = String(partNumber).replace(/[_-]/g, '0').padStart(4, '0').slice(0, 4);
            const paddedVersion2 = String(partNumber).trim().padStart(2, '0');
            const paddedVersion4 = String(partNumber).trim().padStart(4, '0');
            const paddedVersion5 = String(partNumber).trim().padStart(5, '0');
            const pcb_module_pn = String(partNumber).trim().slice(3, 6);

            const partUpper = String(partNumber).toUpperCase();
            const typeUpper = selectedType.toUpperCase();

            const finalSize = selectedSize;
            const cleanedSize = finalSize.replace(/\(.*?\)/g, '').toUpperCase();
            const sizeNumeric = finalSize.replace(/[^0-9]/g, '');
            const sizeFirst = finalSize.trim().charAt(0);
            const descCommon = `${typeUpper}; ${cleanedSize}, ${partUpper}, ${baseDescription}`;
            const sizeMatch = finalSize.match(/\(([^)]+)\)/);
            const sizedesc = sizeMatch ? sizeMatch[1] : '';

            let code = '';
            let description = descCommon;

            switch (this.selectedCategory2) {
                case 'pkg':
                case 'pcb_saw':
                    this.resultdescription = `${typeUpper}; ${sizedesc}, ${partUpper}, ${this.RoudingValue}${baseDescription}`;
                    code = `MG41W${sizeFirst}${paddedPart}${makerFirst}`;
                    break;
                case 'pcb_module':
                    if (selectedSize !== '') {
                        description = `${typeUpper}; ${sizeNumeric}, ${String(partNumber).trim()}_Rev${this.description1.trim()}`;

                        this.resultdescription = description;

                        code = `MG41W${pcb_module_pn}${this.index1}${this.index2}${makerFirst}`;
                    }
                    break;

                case 'carrier':
                    this.resultdescription = `${typeUpper} TAPE; ${cleanedSize}, ${baseDescription.trim()}`;
                    code = `MG69W${sizeNumeric}${partFirst}${makerFirst}`;
                    if (selectedSize !== '') {
                        // this.lastversionstring(`MG69W${sizeNumeric}`);
                    }
                    break;
                case 'cover':
                    this.resultdescription = `${typeUpper} TAPE; ${baseDescription.trim()}`;
                    code = `MD69-${sizeNumeric}${paddedVersion5}${makerFirst}`;

                    break;
                case 'switch':
                    description = `${typeUpper}; ${baseDescription.trim()}`;
                    this.resultdescription = `${description.trim()}_Ver${this.version1}, ${this.description1.trim()}*${this.description2.trim()}*${this.description3.trim()}`;
                    code = `MG65W${this.index1}${this.index2}P${this.seq1}${this.version1}${makerFirst}`;
                    break;
                case 'lna':
                    description = `${typeUpper}; ${baseDescription.trim()}`;
                    this.resultdescription = `${description.trim()}, ${this.description1.trim()}*${this.description2.trim()}*${this.description3.trim()}`;
                    code = `MG84W${this.index1}${this.index2}P${this.seq1}${this.version1}${makerFirst}`;
                    break;
                case 'combo':
                    description = `${typeUpper}; ${baseDescription.trim()}, COMBO`;
                    this.resultdescription = `${description.trim()}, ${this.description1.trim()}*${this.description2.trim()}*${this.description3.trim()}`;
                    code = `MG84W${this.index1}${this.index2}P${this.seq1}${this.version1}${makerFirst}`;
                    break;
                case 'resister':
                    description = `Resister; ${sizedesc}, ${baseDescription.trim()}`;
                    this.resultdescription = `${description.trim()}, ${this.description1.trim()}`;
                    code = `2702W${sizeFirst}${paddedVersion4}${makerFirst}`;
                    break;

                case 'capaciter':
                    description = `CAP; ${sizedesc}, ${baseDescription.trim()}`;
                    this.resultdescription = `${description.trim()}, ${this.description1.trim()}`;
                    code = `2203W${sizeFirst}${paddedVersion4}${makerFirst}`;
                    break;

                case 'inductor':
                    description = `IND; ${sizedesc}, ${baseDescription.trim()}`;
                    this.resultdescription = `${description.trim()}, ${this.description1.trim()}`;
                    code = `2703W${sizeFirst}${paddedVersion4}${makerFirst}`;
                    break;

                case 'epoxy':
                    this.resultdescription = `${typeUpper}; ${finalSize.slice(0, 2)}, ${baseDescription.trim()}`;
                    code = `0103W0${paddedVersion2}${finalSize.slice(0, 2)}${makerFirst}`;
                    break;

                case 'polyfilm':
                    this.resultdescription = `${typeUpper}; ${finalSize.slice(0, 2)}, ${baseDescription.trim()}`;
                    code = `0204W${paddedVersion2}${finalSize.slice(0, 2)}${makerFirst}`;
                    break;
            }

            this.resultcode = code.toUpperCase();

            this.results = [
                {
                    id: Date.now(),
                    RawType: category,
                    SizeValue: finalSize.toUpperCase(),
                    Maker: selectedMaker.toUpperCase(),
                    PartNumber: partUpper,
                    description: this.resultdescription.trim(),
                    PlannedPrice: this.PlannedPrice,
                    RoudingValue: this.RoudingValue,
                    code: code.toUpperCase(),
                },
            ];
        },
        fnloginrelease() {
            localStorage.removeItem('user'); // 로그인 정보 삭제
            this.managerflag = false;
            this.loginflag = false;
            this.loginid = '';
            this.loginpw = '';
            this.accstring = '';
        },
        onNumericInput(field, event) {
            let value = event.target.value;
            // 숫자와 소수점만 허용
            value = value.replace(/[^0-9.]/g, '');
            // 소수점 하나만 허용
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts[1];
            }
            // 반영
            this[field] = value;

            if (field === 'PlannedPrice') {
                this.checkFormat();
            }
            this.generateResult();
        },
        addValue(field, num) {
            const newValue = (this[field] || '') + String(num);

            if (field === 'PlannedPrice') {
                this.PlannedPrice = newValue;

                // 입력 후 포맷 체크 (자동 자르기/반영)
                if (!this.checkFormat()) {
                    // 잘못된 값이면 원복
                    this.PlannedPrice = this.PlannedPrice.slice(0, -1);
                    return;
                }
            } else {
                this[field] = newValue;
            }

            this.generateResult();
        },
        async changeValue(field, num) {
            this[field] = String(num);
            if (['switch'].includes(selectedCategory2)) {
                if (field === 'index1') {
                    this.index2 = 0;
                    this.Seq = 0;
                    this.version1 = 1;
                    await this.getLastVersionCode(this.index1, this.index2, '');
                } else if (field === 'index2') {
                    this.Seq = 0;
                    this.version1 = 1;
                    await this.getLastVersionCode(this.index1, this.index2, '');
                } else if (field === 'seq1') {
                    this.version1 = 1;
                    await this.getLastVersionCode(this.index1, this.index2, 'P' + this.seq1);
                }
                this.generateResult();
            }
        },
        delValue(field) {
            this[field] = '';
        },
        onVerSionInput(field, event) {
            if (this.selectedCategory1 === 'pcb') {
                let value = event.target.value;
                // 숫자와 소수점만 허용
                value = value.replace(/[^0-9.]/g, '');
                // 소수점 하나만 허용
                const parts = value.split('.');
                if (parts.length > 2) {
                    value = parts[0] + '.' + parts[1];
                }
                // 반영
                this[field] = value;
            }
        },
        fnselectinner(InnerTab) {
            this.activeInnerTab = InnerTab;
            if (InnerTab === 'inner0') {
                this.loadNewMaterials();
            }
        },
        fnselectCategory1(cat) {
            this.selectedCategory1 = cat;

            if (cat === 'ic') {
                this.selectedCategory2 = 'switch';
            } else if (cat === 'smd') {
                this.selectedCategory2 = 'capaciter';
            } else {
                this.selectedCategory2 = cat;
            }
            this.fnselectCategory2(this.selectedCategory2);
        },
        async fnselectCategory2(cat) {
            this.selectedCategory2 = cat;
            this.selectedType = cat.replace('_saw', '').replace('_module', '');
            this.selectedSize = '';
            this.partNumber = '';
            this.selectedMaker = '';
            this.RoudingValue = '';
            this.PlannedPrice = '';
            this.resultdescription = '';
            this.description = '';
            this.description1 = '';
            this.description2 = '';
            this.description3 = '';
            this.resultcode = '';
            this.index1 = '';
            this.index2 = '';
            this.seq1 = '';
            this.version1 = '';
            this.lastcode = '';

            this.results = [];
            if (['pkg'].includes(this.selectedCategory2)) {
                this.makers = ['K (KYOCERA)'];
                this.description = 'pcs/Sheet';
            } else if (this.selectedCategory2 === 'pcb_saw') {
                this.makers = ['D (Daisho Denshi)'];
                this.description = 'pcs/Sheet';
            } else if (this.selectedCategory2 === 'pcb_module') {
                this.makers = ['S (SMST AKM)', 'N (NJRC)', 'D (Daisho Denshi)', 'H (대덕전자)'];
            } else if (['carrier', 'cover'].includes(this.selectedCategory2)) {
                this.makers = ['R (RODING)', 'C (C-PAK)', 'H (RongCheng)', 'E (E&R)'];
            } else if (['switch', 'lna', 'combo'].includes(this.selectedCategory2)) {
                this.makers = ['N (NR Rab)', 'C (CanaanTek)', 'W (WISOL)', 'T (Thoshiba)', 'F (FERFICS)', 'I (Infineon)', 'P (Peregrine)', 'S (Silanna)', 'R (Tower Semi)', 'D (Radrock)'];
            } else if (['resister'].includes(this.selectedCategory2)) {
                this.makers = ['U (Uniohm)'];
            } else if (['capaciter'].includes(this.selectedCategory2)) {
                this.makers = ['M (MURATA)'];
            } else if (['inductor'].includes(this.selectedCategory2)) {
                this.makers = ['M (MURATA)', 'S (SUNLOARD)', 'T (TDK)'];
            } else if (['epoxy', 'polyfilm'].includes(this.selectedCategory2)) {
                this.makers = ['S (SANYUREC)', 'N (NAGASE)', 'T (NITTO)', 'B (NITTO_BDMP)', 'C (조광페인트)'];
            }
            console.log('fnselectCategory2 ' + this.partNumber);
        },
        async getLastVersionCode(pindex1, pindex2, pseq) {
            const key = this.selectedCategory2;
            if (!key) return;

            const size = this.selectedSize?.trim();
            const sizeFirst = size?.charAt(0);
            let lastnum = '';
            let result;

            const prefixByCategory = {
                pcb_module: `MG41W${this.partNumber.slice(3, 6)}`,
                carrier: `MG69W${size}`,
                cover: `MD69-${size}`,
                switch: `MG65W${pindex1}${pindex2}${pseq}`,
                lna: `MG84W${pindex1}${pindex2}${pseq}`,
                combo: `MG84W${pindex1}${pindex2}${pseq}`,
                capaciter: sizeFirst,
                inductor: sizeFirst,
                resister: sizeFirst,
            };

            // 제외할 카테고리
            const skipCategories = ['pkg', 'pcb_saw', 'epoxy', 'polyfilm'];

            if (skipCategories.includes(key)) return;

            const prefix = prefixByCategory[key];
            if (!prefix) return;

            result = await this.lastversionstring(prefix);

            console.log('getLastVersionCode ===== ' + result);

            if (key === 'pcb_module') {
                this.index1 = result.Index1;
                this.index2 = result.Index2;
            } else if (['switch', 'lna', 'combo'].includes(key)) {
                // const padded = result.NextVersion.padStart(5, '0');
                // this.index1 = padded.charAt(0);
                // this.index2 = padded.charAt(1);
                // this.seq1 = padded.charAt(3);
                // this.version1 = padded.charAt(4);
                this.index1 = result.Index1;
                this.index2 = result.Index2;
                this.seq1 = result.Seq;
                this.version1 = result.NextVersion;
            } else if (['capaciter', 'inductor', 'resister'].includes(key)) {
                // this.partNumber = result.NextVersion;
                // this.version1 = result.NextVersion;
            } else if (['cover'].includes(key)) {
                // this.partNumber = result.NextVersion;
                // this.version1 = result.NextVersion;
            } else {
                // this.partNumber = result.NextVersion;
            }

            if (result.LastCode === '') {
                this.lastcode = '신규버전';
            } else {
                this.lastcode = result.LastCode;
            }
        },
        checkFormat() {
            let value = this.PlannedPrice;

            // 숫자와 소수점만 허용
            if (!/^\d*\.?\d*$/.test(value)) {
                alert('숫자만 입력 가능합니다.');
                return false;
            }

            // 소수점만 입력한 중간 상태는 허용
            if (value.endsWith('.')) return true;

            // 정수부와 소수부 분리
            const [intPart, decPart = ''] = value.split('.');

            // 정수부 4자리 초과 방지
            if (intPart.length > 4) {
                alert('정수부는 최대 4자리까지 입력 가능합니다.');
                return false;
            }

            // 소수부 2자리 초과 시 자동 자르기
            if (decPart.length > 2) {
                value = `${intPart}.${decPart.slice(0, 2)}`;
                alert('소수점 이하 최대 2자리까지 입력 가능합니다. 자동으로 잘립니다.');
            }

            // 숫자로 변환 후 범위 확인
            const num = parseFloat(value);
            if (!isNaN(num) && num > 9999.99) {
                alert('9999.99 이하의 숫자만 입력 가능합니다.');
                return false;
            }

            // 최종 반영
            this.PlannedPrice = value;
            return true;
        },
        fnselectSize(size) {
            this.selectedSize = size;

            this.selectedMaker = '';
            this.partNumber = '';
            this.version1 = '';
            this.resultcode = '';
        },
        fnselectSize1(size) {
            this.selectedSize1 = size;
            this.generateResult();
        },
        fnselectSize2(size) {
            this.selectedSize2 = size;
            this.generateResult();
        },
        fnswsize1input() {
            if (this.description1.trim() !== '') {
                // * 기준으로 분할
                const parts = this.description1.split('*');

                if (parts.length === 3) {
                    this.description1 = parts[0].trim();
                    this.description2 = parts[1].trim();
                    this.description3 = parts[2].trim();
                }
            }
            // 결과 생성 함수 호출
            this.generateResult();
        },
        fnselectVersion(Version) {
            // this.partNumber = Version;
            this.generateResult();
        },
        async fnselectMaker(maker) {
            this.selectedMaker = maker;
            this.index1 = '';
            this.index2 = '';
            this.seq1 = '';

            await this.getLastVersionCode('', '', '');

            this.generateResult();
        },
        // groupedFilteredCategories(innerTab) {
        //   let filtered;
        //   if (innerTab === 'inner1') {
        //     filtered = this.categories.filter((c) => c.group === 'SAW');
        //   } else if (innerTab === 'inner2') {
        //     filtered = this.categories.filter((c) => c.group !== 'SAW');
        //   } else {
        //     filtered = [];
        //   }

        //   const grouped = {};
        //   filtered.forEach((cat) => {
        //     if (!grouped[cat.group]) grouped[cat.group] = [];
        //     grouped[cat.group].push(cat);
        //   });

        //   return Object.keys(grouped).map((groupName) => ({
        //     name: groupName,
        //     items: grouped[groupName],
        //   }));
        // },
        groupedFiltered(group) {
            let filtered;

            filtered = this.categories.filter((c) => c.group === group);

            const grouped = {};
            filtered.forEach((cat) => {
                if (!grouped[cat.group]) grouped[cat.group] = [];
                grouped[cat.group].push(cat);
            });

            return Object.keys(grouped).map((groupName) => ({
                name: groupName,
                items: grouped[groupName],
            }));
        },
        getGroupClass(group) {
            switch (group.name) {
                case 'MODULE':
                    return 'bg-module';
                case 'IC':
                    return 'bg-ic';
                case 'SMD(R/L/C)':
                    return 'bg-smd';
                case 'Molding':
                    return 'bg-molding';
                case 'CARRIER TYPE':
                    return 'bg-carrier';
                case 'COVER TYPE':
                    return 'bg-cover';
                default:
                    return 'bg-default';
            }
        },
        submitDataEX() {
            const confirmResult = confirm('등록하시겠습니까?'); // Yes/No 창
            if (!confirmResult) {
                alert('등록이 취소되었습니다.');
                return;
            }

            alert('테스트 중으로 등록이 더 이상 진행되지 않습니다. ');
        },
        async lastversionstring(ReqData) {
            const payload = {
                id: this.selectedCategory2,
                maker: this.selectedMaker,
                value: ReqData,
            };

            try {
                const response = await axios.post(`${BASE_URL}/typelastversion`, payload, {
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = response.data;
                console.log('lastversionstring = ' + String(result.LastCode));
                return result;
            } catch (error) {
                console.error('Error in lastversionstring:', error);
                return 'A'; // fallback
            }
        },
        async loadNewMaterials() {
            const payload = {
                id: this.selectedCategory2,
            };

            try {
                const response = await axios.get(`${BASE_URL}/newmaterials`, null, {
                    headers: { 'Content-Type': 'application/json' },
                });
                // console.log(response.data);
                this.materials = response.data;
            } catch (error) {
                console.error('Error in lastversionstring:', error);
                return 'A'; // fallback
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        openEditModal(row) {
            this.editForm = { ...row };
            this.originalMatnr = row.matnr;
            this.editIndex = this.pagedMaterials.findIndex((item) => item.matnr === row.matnr);
            this.editModalVisible = true;
        },
        submitEdit() {
            const edited = { ...this.editForm };
            if (this.editIndex !== null) {
                // this.$set(this.pagedMaterials, this.editIndex, { ...this.editForm });
                // 백엔드에 저장 필요시 API 호출도 이곳에서
                const indexInMaterials = this.materials.findIndex((item) => item.matnr === this.originalMatnr);

                if (indexInMaterials !== -1) {
                    this.materials[indexInMaterials] = edited;
                }

                const item = this.materials[indexInMaterials];

                console.log(item);

                const confirmed = confirm(`원자재 ${item.matnr}를 수정하시겠습니까?`);

                if (confirmed) {
                    const payload = {
                        code: this.originalMatnr,
                        matnr: item.matnr,
                        maktx: item.maktx,
                        maker: item.maker,
                        bstrf: item.bstrf,
                        zplp1: item.zplp1,
                    };

                    axios
                        .post(`${BASE_URL}/RawUpdate`, payload, {
                            headers: { 'Content-Type': 'application/json' },
                        })
                        .then((response) => {
                            const result = response.data;
                            if (result === 'EXIST CODE') {
                                alert('중복된 코드입니다. 다시 확인 후 작업해주세요!');
                            } else {
                                alert('수정 완료!');
                            }
                        })
                        .catch((error) => {
                            console.error('삭제 실패:', error);
                            alert('수정 중 오류가 발생했습니다.');
                        });
                } else {
                    console.log(`❌ 수정 취소: ${item.matnr}`);
                }

                this.editModalVisible = false;
            }
        },
        handleApproveClick(indexInPage) {
            const index = (this.currentPage - 1) * this.itemsPerPage + indexInPage;

            const item = this.materials[index];

            const confirmed = confirm(`원자재 ${item.matnr}를 등록하시겠습니까?`);

            if (confirmed) {
                const payload = {
                    code: item.matnr,
                };

                axios
                    .post(`${BASE_URL}/RawConfirm`, payload, {
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then((response) => {
                        alert('등록 완료!');
                    })
                    .catch((error) => {
                        console.error('등록 실패:', error);
                        alert('등록 중 오류가 발생했습니다.');
                    });
            } else {
                console.log(`❌ 등록 취소: ${item.matnr}`);
            }
        },
        handleDelClick(indexInPage) {
            const index = (this.currentPage - 1) * this.itemsPerPage + indexInPage;

            const item = this.materials[index];

            const confirmed = confirm(`원자재 ${item.matnr}를 삭제하시겠습니까?`);

            if (confirmed) {
                const payload = {
                    code: item.matnr,
                };

                axios
                    .post(`${BASE_URL}/RawDel`, payload, {
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then((response) => {
                        alert('삭제 완료!');
                        this.loadNewMaterials();
                    })
                    .catch((error) => {
                        console.error('삭제 실패:', error);
                        alert('삭제 중 오류가 발생했습니다.');
                    });
            } else {
                console.log(`❌ 삭제 취소: ${item.matnr}`);
            }
        },
        submitData() {
            if (!this.results.length) {
                alert('등록할 데이터가 없습니다.');
                return;
            }

            const confirmResult = confirm('등록하시겠습니까?'); // Yes/No 창
            if (!confirmResult) {
                alert('등록이 취소되었습니다.');
                return;
            }

            const payload = this.results[0]; // 현재 한 건만 전송 중

            //alert(JSON.stringify(payload, null, 2));

            axios
                .post(`${BASE_URL}/NewMaterials`, payload, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then((response) => {
                    const result = response.data;
                    if (result.result !== 'fail') {
                        alert('등록 완료!');
                        Object.assign(this, {
                            makers: [],
                            selectedCategory1: '',
                            selectedCategory2: '',
                            selectedType: '',
                            selectedSize: '',
                            selectedSize1: '',
                            selectedSize2: '',
                            partNumber: '',
                            selectedMaker: '',
                            resultdescription: '',
                            description1: '',
                            description2: '',
                            description3: '',
                            result: '',
                            results: [],
                            generated: false,
                            PlannedPrice: '',
                            RoudingValue: '',
                            resultcode: '',
                        });
                    } else {
                        alert('등록 실패!' + result.resultmsg);
                    }
                    console.log('서버 응답:', response.data);
                })
                .catch((error) => {
                    console.error('등록 실패:', error);
                    alert('등록 중 오류가 발생했습니다.');
                });
        },
        handleLoginClick() {
            const payload = {
                ulid: this.loginid,
                ulpw: this.loginpw,
            };

            axios
                .post(`${BASE_URL}/users`, payload, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then((response) => {
                    this.accstring = response.data;
                    this.loginflag = true;
                    const userInfo = {
                        ...response.data[0],
                        loginTime: new Date().getTime(), // 현재 시각 (ms 단위)
                    };

                    localStorage.setItem('user', JSON.stringify(userInfo));

                    if ([3, 2].includes(response.data[0].ulev)) {
                        this.managerflag = true;
                    }
                })
                .catch((error) => {
                    console.error('등록 실패:', error);
                    alert('로그인 중 오류가 발생했습니다.' + error);
                    this.loginflag = false;
                });
        },
    },
}).mount('#app');
</script>
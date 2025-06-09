<script lang="ts">
export default {};
</script>
<template>
  <div class="button-group">
    <button
      v-if="!['load'].includes(props.applicationType)"
      class="btn create"
      type="button"
      @click="handleButtons('create')"
    >
      생성
    </button>
    <button class="btn update" type="button" @click="handleButtons('update')">
      업데이트
    </button>
    <button

      v-if="props.application.id"
      class="btn excel"
      type="button"
      @click="handleExcelDownload"
     >
       Excel 다운로드
     </button>
    <button class="btn delete" type="button" @click="handleButtons('delete')">
      삭제
    </button>
     
    <!-- <button class="btn clone">복제</button> -->
  </div>
</template>

<script lang="ts" setup>
import type {
  ModuleMeasurementApp,
  ModuleFiles,
} from "../../../interface/module_group/application/application";
import {
  checkFiles,
  submitApplication,
} from "../../../utils/module_group/application-utils";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";
import ExcelJS from "exceljs";
import {saveAs} from "file-saver";

const router = useRouter();
const props = defineProps<{
  application: ModuleMeasurementApp;
  applicationType: string;
  fileObjList: ModuleFiles;
}>();

const handleButtons = async (buttonType: string) => {
  if (buttonType === "create" && props.application.id === null) {
    if (checkFiles(props.application, props.fileObjList)) {
      
      const respose = await submitApplication(
        props.application,
        props.fileObjList,
        buttonType
      );
      if (respose) {
        ElNotification({
          title: "성공",
          message: "✅ 의뢰서가 정상적으로 생성되었습니다.",
          type: "success",
          duration: 3000, // 3초 후 자동 닫힘
          position: "top-right",
        });

        // 1초 후 페이지 이동 (예: 리스트 페이지로)
        setTimeout(() => {
          router.push({ name: "ModuleApplicationList" }); // 라우트 이름에 맞게 수정
        }, 1000);
      }
    }
  } else if (buttonType === "create" && props.application.id !== null) {
    // do somethings for update
  } else if (buttonType === "update") {
    const respose = await submitApplication(
      props.application,
      props.fileObjList,
      buttonType
    );
    if (respose) {
      ElNotification({
        title: "성공",
        message: "✅ 의뢰서가 정상적으로 업데이트되었습니다.",
        type: "success",
        duration: 3000, // 3초 후 자동 닫힘
        position: "top-right",
      });
    }
  } else if (buttonType === "delete") {
    const respose = await submitApplication(
      props.application,
      props.fileObjList,
      buttonType
    );
    if (respose) {
      ElNotification({
        title: "성공",
        message: "✅ 의뢰서가 정상적으로 삭제되었습니다..",
        type: "success",
        duration: 3000, // 3초 후 자동 닫힘
        position: "top-right",
      });

      // 1초 후 페이지 이동 (예: 리스트 페이지로)
      setTimeout(() => {
        router.push({ name: "ModuleApplicationList" }); // 라우트 이름에 맞게 수정
      }, 1000);
    }
  }
};


const handleExcelDownload = async () => {
  const app = props.application;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("의뢰서");

  sheet.columns = Array.from({ length: 10 }, (_, i) => ({ width: i < 6 ? 20 : 2 }));

  const applyBorder = (cell) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  };

  const writeSectionHeader = (row, text, color = 'FFFFFF00') => {
    sheet.mergeCells(`B${row}:E${row}`);
    const cell = sheet.getCell(`B${row}`);
    cell.value = text;
    cell.font = { name: '맑은 고딕', size: 14, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    sheet.getRow(row).height = 40;
    applyBorder(cell);
  };

  const writeFieldRow = (row, leftLabel, leftValue, rightLabel, rightValue) => {
    const cells = [
      ['B', leftLabel], ['C', leftValue],
      ['D', rightLabel], ['E', rightValue]
    ];
    cells.forEach(([col, val]) => {
      const cell = sheet.getCell(`${col}${row}`);
      cell.value = val;
      cell.font = { name: '맑은 고딕', size: 10, bold: col === 'B' || col === 'D' };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      if (col === 'B' || col === 'D') {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4C4' } };
      }
      applyBorder(cell);
    });
  };

  const writeMergedRow = (row, label, value) => {
    sheet.mergeCells(`C${row}:E${row}`);
    const cellL = sheet.getCell(`B${row}`);
    const cellV = sheet.getCell(`C${row}`);
    cellL.value = label;
    cellV.value = value;

    cellL.font = { name: '맑은 고딕', size: 10, bold: true };
    cellL.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cellL.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4C4' } };
    applyBorder(cellL);

    cellV.font = { name: '맑은 고딕', size: 10 };
    cellV.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    applyBorder(cellV);
  };

  const insertImageBelow = async (file, row, folder) => {
    if (!file) return row;
    try {
      const response = await fetch(`http://10.29.9.48:40000/static/${folder}/${file.uId}.${file.ext}`);
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      const imageId = workbook.addImage({ buffer, extension: file.ext });

      const imageHeight = 240, imageWidth = 640;
      const pxPerRow = 20;
      const rowHeight = Math.ceil(imageHeight / pxPerRow);

      sheet.spliceRows(row + 1, 0, ...Array(rowHeight).fill([]));
      sheet.mergeCells(`B${row + 1}:E${row + rowHeight}`);
      sheet.addImage(imageId, {
        tl: { col: 1, row: row },
        ext: { width: imageWidth, height: imageHeight }
      });

      return row + rowHeight + 1;
    } catch (e) {
      console.error("이미지 삽입 실패", e);
      return row;
    }
  };

  const fields = [
    ['Model Name\nTên model', app.productName, 'Quantity\nSố lượng', app.quantity],
    ['의뢰 목적\nMục đích yêu cầu', app.purpose, '조립차수\nLần lắp ráp', app.smtHistory || ''],
    ['자재 전달 일자\nNgày gửi NVL', app.dateOfDeliveryDate?.substring(0, 10) || '', '완료 요청 일자\nNgày yêu cầu hoàn thành', app.dateOfExpectedFinished?.substring(0, 10) || ''],
    ['LOT ID', app.lotId || '', 'Mold', app.mold],
    ['샘플 전달방법\nCách giao mẫu', app.deliveryMethod, '작성자\nNgười viết', app.user?.userName || ''],
    ['생성일\nNgày tạo', app.dateOfCreated?.substring(0, 10) || '', '', ''],
    ['TCF 측정 유무\nCó đo TCF không', app.needTcf ? 'O' : 'X', 'TCF 측정 온도\nNhiệt độ đo TCF', app.tcfTemperature || '']
  ];

  let row = 2;
  writeSectionHeader(row++, '기본 정보\nTHÔNG TIN CƠ BẢN');
  for (let i = 0; i < fields.length; i++) {
    const [l1 = '', v1 = '', l2 = '', v2 = ''] = fields[i] || [];
    writeFieldRow(row++, l1, v1, l2, v2);
  }

  if (app.isNa && app.naApp?.na) {
  writeSectionHeader(row++, 'NA 정보\nTHÔNG TIN NA', 'FFD9EAD3');
    writeMergedRow(row++, 'NA 종류\nLoại NA', app.naApp?.na || '');
    writeFieldRow(row++, '측정 방식\nPhương pháp đo', app.naApp?.measMethod || '', 'De-Embedding 방식\nPhương pháp de-embedding', app.naApp?.deMethod || '');
    writeFieldRow(row++, 'Port Extension Loss', app.naApp?.portExtensionLoss ? 'ON' : 'OFF', 'S-Parameter Type', app.naApp?.sParaType || '');
    writeMergedRow(row++, 'NA 특이사항\nLưu ý về NA', app.naApp?.note || '');
    // if (app.naApp?.naSpecialFile?.length > 0) {
    //   row = await insertImageBelow(app.naApp.naSpecialFile[0], row, 'na_special');
    // }
    if (app.naApp?.naSpecialFile?.length > 0) {
      for (const file of app.naApp.naSpecialFile) {
        row = await insertImageBelow(file, row, 'na_special');
        }
      }
  }

  if (app.isNf) {
  writeSectionHeader(row++, 'NF 정보\nTHÔNG TIN NF', 'FFD9EAD3');
    writeFieldRow(row++, 'NF De-embedding 방식', app.nfApp?.deMethod || '', 'NF Real Matching 여부', app.nfApp?.isRealMatching ? 'O' : 'X');
    writeMergedRow(row++, 'NF 특이사항\nLưu ý về NF', app.nfApp?.note || '');
    // if (app.nfApp?.nfSpecialFile?.length > 0) {
    //   row = await insertImageBelow(app.nfApp.nfSpecialFile[0], row, 'nf_special');
    // }
    if (app.nfApp?.nfSpecialFile?.length > 0) {
      for (const file of app.nfApp.nfSpecialFile) {
        row = await insertImageBelow(file, row, 'nf_special');
          }
      }
  }

  for (let i = 6; i <= 50; i++) sheet.getColumn(i).hidden = true;
  for (let i = row + 1; i <= 100; i++) sheet.getRow(i).hidden = true;

  sheet.pageSetup = {
    margins: { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.1, footer: 0.1 },
    orientation: 'portrait',
    paperSize: 9
  };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `의뢰서_${app.productName || '무기종명'}.xlsx`);
};

// const handleExcelDownload = async () => {
//   const app = props.application;
//   const workbook = new ExcelJS.Workbook();
//   const sheet = workbook.addWorksheet("의뢰서");

//   sheet.columns = Array.from({ length: 10 }, (_, i) => ({ width: i < 6 ? 20 : 2 }));

//   const applyBorder = (cell) => {
//     cell.border = {
//       top: { style: 'thin' },
//       left: { style: 'thin' },
//       bottom: { style: 'thin' },
//       right: { style: 'thin' },
//     };
//   };

//   const writeSectionHeader = (row, text, color = 'FFFFFF00') => {
//     sheet.mergeCells(`B${row}:G${row}`);
//     const cell = sheet.getCell(`B${row}`);
//     cell.value = text;
//     cell.font = { name: '맑은 고딕', size: 14, bold: true };
//     cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
//     sheet.getRow(row).height = 40;
//     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
//     applyBorder(cell);
//   };

//   const writeFieldRow = (row, leftLabel, leftValue, rightLabel, rightValue) => {
//     const cells = [
//       ['B', leftLabel], ['C', leftValue],
//       ['D', rightLabel], ['E', rightValue]
//     ];

//     cells.forEach(([col, val]) => {
//       const cell = sheet.getCell(`${col}${row}`);
//       cell.value = val;
//       cell.font = { name: '맑은 고딕', size: 10, bold: col === 'B' || col === 'D' };
//       cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
//       if (col === 'B' || col === 'D') {
//         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4C4' } };
//       }
//       applyBorder(cell);
//     });
//   };

//   const insertMultipleImagesBelow = async (fileList, row, folder) => {
//     if (!Array.isArray(fileList) || fileList.length === 0) return row;

//     const imageHeight = 240, imageWidth = 320;
//     const pxPerRow = 20;
//     const rowHeight = Math.ceil(imageHeight / pxPerRow);

//     const buffers = await Promise.all(
//       fileList.map(async (file) => {
//         try {
//           const response = await fetch(`http://10.29.9.48:40000/static/${folder}/${file.uId}.${file.ext}`);
//           const blob = await response.blob();
//           const buffer = await blob.arrayBuffer();
//           return { buffer, ext: file.ext };
//         } catch (e) {
//           console.error(`이미지 다운로드 실패 (${file.uId})`, e);
//           return null;
//         }
//       })
//     );

//     const validBuffers = buffers.filter(Boolean);
//     const count = validBuffers.length;
//     if (count === 0) return row;

//     sheet.spliceRows(row + 1, 0, ...Array(rowHeight).fill([]));

//     validBuffers.forEach((img, i) => {
//       const imageId = workbook.addImage({ buffer: img.buffer, extension: img.ext });
//       const offsetCol = 1 + i * 2;
//       sheet.addImage(imageId, {
//         tl: { col: offsetCol, row: row },
//         ext: { width: imageWidth, height: imageHeight }
//       });
//     });

//     return row + rowHeight + 1;
//   };

//   const fields = [
//     ['Model Name\nTên model', app.productName, 'Quantity\nSố lượng', app.quantity],
//     ['의뢰 목적\nMục đích yêu cầu', app.purpose, '조립차수\nLần lắp ráp', app.smtHistory || ''],
//     ['자재 전달 일자\nNgày gửi NVL', app.dateOfDeliveryDate?.substring(0, 10) || '', '완료 요청 일자\nNgày yêu cầu hoàn thành', app.dateOfExpectedFinished?.substring(0, 10) || ''],
//     ['LOT ID', app.lotId || '', 'Mold', app.mold],
//     ['샘플 전달방법\nCách giao mẫu', app.deliveryMethod, '작성자\nNgười viết', app.user?.userName || ''],
//     ['생성일\nNgày tạo', app.dateOfCreated?.substring(0, 10) || '', '', ''],

//     ['TCF 측정 유무\nCó đo TCF không', app.needTcf ? 'O' : 'X', 'TCF 측정 온도\nNhiệt độ đo TCF', app.tcfTemperature || ''],

//     ['NA 사용 여부\nSử dụng NA', app.isNa ? 'O' : 'X', 'NA 종류\nLoại NA', app.naApp?.na || ''],
//     ['측정 방식\nPhương pháp đo', app.naApp?.measMethod || '', 'De-Embedding 방식\nPhương pháp de-embedding', app.naApp?.deMethod || ''],
//     ['Port Extension Loss', app.naApp?.portExtensionLoss ? 'ON' : 'OFF', 'S-Parameter Type', app.naApp?.sParaType || ''],
//     ['NA 특이사항\nLưu ý về NA', app.naApp?.note || '', '', ''],

//     ['NF 사용 여부\nSử dụng NF', app.isNf ? 'O' : 'X', 'NF De-embedding 방식', app.nfApp?.deMethod || ''],
//     ['NF Real Matching 여부', app.nfApp?.isRealMatching ? 'O' : 'X', 'NF 특이사항\nLưu ý về NF', app.nfApp?.note || '']
//   ];

//   let row = 2;
//   writeSectionHeader(row++, '기본 정보\nTHÔNG TIN CƠ BẢN');
//   for (let i = 0; i < 6; i++) {
//     const [l1 = '', v1 = '', l2 = '', v2 = ''] = fields[i] || [];
//     writeFieldRow(row++, l1, v1, l2, v2);
//   }

//   writeSectionHeader(row++, 'TCF 정보\nTHÔNG TIN TCF', 'FFD9EAD3');
//   {
//     const [l1 = '', v1 = '', l2 = '', v2 = ''] = fields[6] || [];
//     writeFieldRow(row++, l1, v1, l2, v2);
//   }

//   writeSectionHeader(row++, 'NA 정보\nTHÔNG TIN NA', 'FFD9EAD3');
//   for (let i = 7; i <= 10; i++) {
//     const [l1 = '', v1 = '', l2 = '', v2 = ''] = fields[i] || [];
//     writeFieldRow(row++, l1, v1, l2, v2);
//   }
//   if (app.naApp?.naSpecialFile?.length > 0) {
//     row = await insertMultipleImagesBelow(app.naApp.naSpecialFile, row, "na_special");
//   }

//   writeSectionHeader(row++, 'NF 정보\nTHÔNG TIN NF', 'FFD9EAD3');
//   for (let i = 11; i < fields.length; i++) {
//     const [l1 = '', v1 = '', l2 = '', v2 = ''] = fields[i] || [];
//     writeFieldRow(row++, l1, v1, l2, v2);
//   }
//   if (app.nfApp?.nfSpecialFile?.length > 0) {
//     row = await insertMultipleImagesBelow(app.nfApp.nfSpecialFile, row, "nf_special");
//   }

//   for (let i = 6; i <= 50; i++) sheet.getColumn(i).hidden = true;
//   for (let i = row + 1; i <= 100; i++) sheet.getRow(i).hidden = true;

//   sheet.pageSetup = {
//     margins: { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.1, footer: 0.1 },
//     orientation: 'portrait',
//     paperSize: 9
//   };

//   const buffer = await workbook.xlsx.writeBuffer();
//   saveAs(new Blob([buffer]), `의뢰서_${app.productName || "무기종명"}.xlsx`);
// };

</script>

<style scoped>
.button-group {
  display: flex;
  gap: 0.5rem;
}

/* 공통 버튼 스타일 */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

/* 버튼 별 색상 */
.create {
  background-color: #4caf50; /* 초록 */
}

.update {
  background-color: #2196f3; /* 파랑 */
}

.delete {
  background-color: #f44336; /* 빨강 */
}

.excel {
  background-color: #ff9800; /* 주황색 */
}

.clone {
  background-color: #9e9e9e; /* 회색 */
}
</style>

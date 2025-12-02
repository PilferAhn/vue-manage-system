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
import type { FormInstance } from "element-plus";

const router = useRouter();
const props = defineProps<{
  application: ModuleMeasurementApp;
  applicationType: string;
  fileObjList: ModuleFiles;
  formRef?: FormInstance | null;
}>();

const handleButtons = async (buttonType: string) => {
  if (buttonType === "create" || buttonType === "update") {
    if (!props.formRef) {
      console.warn("formRef가 없습니다. 폼 검증을 건너뜁니다.");
    } else {
      const valid = await props.formRef
        .validate()
        .then(() => true)
        .catch(() => false);

      if (!valid) {
        ElNotification({
          title: "검증 실패",
          message: "필수 입력값을 확인해주세요.",
          type: "error",
          duration: 3000,
          position: "top-right",
        });
        return; // ❌ 여기서 바로 종료 → submit / 파일체크 X
      }
    }
  }

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
  try {
    const app = props.application;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("NA, NF 측정 의뢰서");

    // 공통 테두리 스타일
    const border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    const headerFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFF00" }, // 연한 노랑 계열
    };
    const naHeaderFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9EAD3" }, // 연한 녹색 계열
    };
    const labelFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE4C4" }, // 살구색
    };

    const center = { vertical: "middle", horizontal: "center" } as const;
    const left = { vertical: "middle", horizontal: "left" } as const;

    // 헬퍼: 셀 값+스타일 세팅
    const setCell = (
      addr: string,
      value: any,
      opts: {
        bold?: boolean;
        align?: typeof center | typeof left;
        fill?: any;
        borderAll?: boolean;
        fontSize?: number;
        wrap?: boolean;
      } = {}
    ) => {
      const cell = sheet.getCell(addr);
      cell.value = value ?? "";
      if (opts.bold) {
        cell.font = { ...(cell.font || {}), bold: true, size: opts.fontSize || 11 };
      } else if (opts.fontSize) {
        cell.font = { ...(cell.font || {}), size: opts.fontSize };
      }
      if (opts.align) cell.alignment = { ...(cell.alignment || {}), ...opts.align };
      if (opts.fill) cell.fill = opts.fill;
      if (opts.borderAll) cell.border = border;
      if (opts.wrap) {
        cell.alignment = {
          ...(cell.alignment || {}),
          wrapText: true,
        };
      }
      return cell;
    };

    const insertImageBelow = async (
      file: { uId: string; ext: string },
      row: number,
      folder: string
    ) => {
      if (!file) return row;

      try {
        // 백엔드/정적 경로 구조에 맞게 수정 필요
        const response = await fetch(`/static/${folder}/${file.uId}.${file.ext}`);
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();

        const imageId = workbook.addImage({
          buffer,
          extension: file.ext,
        });

        const imageHeight = 240;
        const imageWidth = 560;
        const pxPerRow = 20;
        const rowHeight = Math.ceil(imageHeight / pxPerRow);

        // 이미지 들어갈 공간만큼 행 삽입
        sheet.spliceRows(row + 1, 0, ...Array(rowHeight).fill([]));
       
        if (app.isNa) {
          // NA 이미지 (B ~ C 영역)
          sheet.mergeCells(`B${row + 1}:C${row + rowHeight}`);
          sheet.addImage(imageId, {
            tl: { col: 1, row: row }, // B열(=index 1)
            ext: { width: imageWidth, height: imageHeight },
          });
        } else if(app.isNf) {
          // NF 이미지 (D ~ G 영역)
          sheet.mergeCells(`D${row + 1}:G${row + rowHeight}`);
          sheet.addImage(imageId, {
            tl: { col: 3, row: row }, // D열(=index 3)
            ext: { width: imageWidth, height: imageHeight },
          });
        }
        return row + rowHeight + 1;
      } catch (e) {
        console.error("이미지 삽입 실패", e);
        return row;
      }
    };

    // 열 너비 (대략 의뢰서 느낌으로)
    sheet.getColumn("B").width = 25;
    sheet.getColumn("C").width = 45;
    sheet.getColumn("D").width = 25;
    sheet.getColumn("E").width = 15;
    sheet.getColumn("F").width = 20;
    sheet.getColumn("G").width = 20;

    // -----------------------
    // Row 2: 상단 타이틀
    // -----------------------
    sheet.mergeCells("B2:G2");
    setCell("B2", "측정 정보\nTHÔNG TIN ĐO", {
      bold: true,
      align: center,
      borderAll: true,
      fill: headerFill,
      fontSize: 20,
      wrap: true,
    });
    sheet.getRow(2).height = 24;

    // -----------------------
    // Row 3: 의뢰인 / 개발자
    // -----------------------
    setCell("B3", "의뢰인\nNgười yêu cầu", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    setCell("C3", app.requester, {
      align: left,
      borderAll: true,
    });

    setCell("D3", "개발자\nNhà phát triển", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    sheet.mergeCells("E3:G3");
    setCell("E3", app.designer, {
      align: left,
      borderAll: true,
    });

    // -----------------------
    // Row 4: 기종명 / 수량
    // -----------------------
    setCell("B4", "기종명\nTên model", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    setCell("C4", app.productName, {
      align: left,
      borderAll: true,
    });

    setCell("D4", "수량 (Total)\nSố lượng", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    sheet.mergeCells("E4:G4");
    setCell("E4", app.quantity, {
      align: left,
      borderAll: true,
    });

    // -----------------------
    // Row 5: 의뢰 목적 / 세부 수량
    // -----------------------
    setCell("B5", "의뢰 목적\nMục đích yêu cầu", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    setCell("C5", app.purpose, {
      align: left,
      borderAll: true,
      wrap: true,
    });

    setCell("D5", "세부 수량\nSố lượng chi tiết", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    sheet.mergeCells("E5:G5");
    setCell("E5", app.quantityDetail, {
      align: left,
      borderAll: true,
      wrap: true,
    });

    // -----------------------
    // Row 6: 조립 차수 / 자재 전달 일자 / 전달자
    // -----------------------
    setCell("B6", "조립 차수(Ordersheet)", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    setCell("C6", app.smtHistory, {
      align: left,
      borderAll: true,
      wrap: true,
    });

    setCell("D6", "자재 전달 일자\nNgày gửi NVL", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    setCell("E6", new Date(app.dateOfDeliveryDate).toISOString().split('T')[0], {
      align: center,
      borderAll: true,
    });

    setCell("F6", "전달자\nNgười gửi", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    setCell("G6", app.deliveryPerson, {
      align: center,
      borderAll: true,
    });

    // -----------------------
    // Row 7: Mold 여부 / 완료 요청 일자
    // -----------------------
    setCell("B7", "Mold 여부\nCó Mold", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
    });
    setCell("C7", app.mold, {
      align: left,
      borderAll: true,
    });

    setCell(
      "D7",
      "완료 요청 일자\nNgày yêu cầu hoàn thành",
      {
        bold: true,
        align: center,
        borderAll: true,
        fill: labelFill,
        wrap: true,
      }
    );
    sheet.mergeCells("E7:G7");
    setCell("E7", new Date(app.dateOfExpectedFinished).toISOString().split('T')[0], {
      align: center,
      borderAll: true,
    });

    // -----------------------
    // Row 8: TCF 측정 / 샘플 전달 방법
    // -----------------------
    setCell("B8", "TCF 측정\nĐo TCF", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    setCell("C8", app.tcfTemperature, {
      align: left,
      borderAll: true,
      wrap: true,
    });

    setCell("D8", "샘플 전달 방법\nPhương pháp gửi mẫu", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    sheet.mergeCells("E8:G8");
    setCell("E8", app.deliveryMethod, {
      align: left,
      borderAll: true,
      wrap: true,
    });

    // -----------------------
    // Row 9: 측정 담당자 / 완료 예정일
    // -----------------------
    setCell("B9", "측정 담당자\nNgười phụ trách đo", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    setCell("C9", app.measurementManager, {
      align: left,
      borderAll: true,
    });

    setCell("D9", "완료 예정일\nNgày dự kiến hoàn thành", {
      bold: true,
      align: center,
      borderAll: true,
      fill: labelFill,
      wrap: true,
    });
    sheet.mergeCells("E9:G9");
    setCell("E9", new Date(app.completionDueDate).toISOString().split('T')[0], {
      align: center,
      borderAll: true,
    });

    // -----------------------
    // Row 10: NA, NF 헤더 추가
    // -----------------------
    sheet.mergeCells("B10:C10");
    setCell("B10", "측정 정보 (NA)\nTHÔNG TIN NA", {
      bold: true,
      align: center,
      borderAll: true,
      fill: naHeaderFill,
      fontSize: 16,
      wrap: true,
    });
    sheet.mergeCells("D10:G10");
    setCell("D10", "측정 정보 (NF)\nTHÔNG TIN NF", {
      bold: true,
      align: center,
      borderAll: true,
      fill: naHeaderFill,
      fontSize: 16,
      wrap: true,
    });

    // -----------------------
    // Row 11부터 NA, NF 항목 추가
    // -----------------------
    // NA 항목
    let imageRow = 18;
    if (app.isNa) {
      setCell("B11", "NA 선택\nLựa chọn NA", { bold: true, align: center, borderAll: true, fill: labelFill, wrap: true });
      setCell("C11", app.naApp?.na ?? "", { align: left, borderAll: true });
      setCell("B12", "De-embedding 방식\nPhương thức De-embedding", { bold: true, align: center, borderAll: true, fill: labelFill, wrap: true });
      setCell("C12", app.naApp?.deMethod ?? "", { align: left, borderAll: true });
      setCell("B13", "Port Extension Loss\nMất Port Extension", { bold: true, align: center, borderAll: true, fill: labelFill, wrap: true });
      setCell("C13", app.naApp?.portExtensionLoss ? "ON" : "OFF", { align: left, borderAll: true });
      setCell("B14", "측정 방식\nPhương thức đo", { bold: true, align: center, borderAll: true, fill: labelFill, wrap: true });
      setCell("C14", app.naApp?.measMethod ?? "", { align: left, borderAll: true });
      setCell("B15", "S-Parameter 형식\nHình thức SPARA", { bold: true, align: center, borderAll: true, fill: labelFill, wrap: true });
      setCell("C15", app.naApp?.sParaType === "true" ? "Ideal Matching 포함" : "Ideal Matching 미포함", { align: left, borderAll: true });
      setCell("B16", "특이사항\nLưu ý", { bold: true, align: center, borderAll: true, fill: labelFill, wrap: true });
      setCell("C16", app.naApp?.note ?? "", { align: left, borderAll: true, wrap: true });
      // -----------------------
      // Row 17: NA 이미지 헤더 추가
      // -----------------------
      sheet.mergeCells("B17:C17");
      setCell("B17", "이미지 FILE", {
        bold: true,
        align: center,
        borderAll: true,
        fill: naHeaderFill,
        fontSize: 16,
        wrap: true,
      });
      if (app.isNa && app.naApp?.naSpecialFile?.length) {
      for (const file of app.naApp.naSpecialFile) {
        imageRow = await insertImageBelow(file, imageRow, "na_special");
      }
    }
    }

    if (app.isNf) {
      // -----------------------
      // NF 관련 항목
      // -----------------------
      setCell("D11", "Capture", { bold: true, align: center, borderAll: true, fill: labelFill, wrap: true });
      sheet.mergeCells("E11:G11");
      setCell("E11", app.nfApp?.capture ? "O" : "X", { align: left, borderAll: true });
      setCell("D12", "NF-Parameter (MDF) 전달\nTruyền NF-Parameter (MDF)", { bold: true, align: center, borderAll: true, fill: labelFill, wrap: true });
      sheet.mergeCells("E12:G12");
      setCell("E12", app.nfApp?.nfParameterMdf ? "O" : "X", { align: left, borderAll: true });
      setCell("D13", "Matching(Real)\nSự khớp (Thực tế)", { bold: true, align: center, borderAll: true, fill: labelFill, wrap: true });
      sheet.mergeCells("E13:G13");
      setCell("E13", app.nfApp?.isRealMatching ? "O" : "X", { align: left, borderAll: true });
      setCell("D14", "특이사항\nLưu ý", { bold: true, align: center, borderAll: true, fill: labelFill, wrap: true });
      sheet.mergeCells("E14:G14");
      setCell("E14", app.nfApp?.note ?? "", { align: left, borderAll: true, wrap: true });
      // -----------------------
      // Row 17: NF 이미지 헤더 추가
      // -----------------------
      sheet.mergeCells("D17:G17");
      setCell("B17", "이미지 FILE", {
        bold: true,
        align: center,
        borderAll: true,
        fill: naHeaderFill,
        fontSize: 16,
        wrap: true,
      });
      if (app.isNf && app.nfApp?.nfSpecialFile?.length) {
      for (const file of app.nfApp.nfSpecialFile) {
        imageRow = await insertImageBelow(file, imageRow, "nf_special");
      }
    }
    }



    // -----------------------
    // 파일로 내보내기
    // -----------------------
    const fileNameBase = app.productName || "NA_NF_측정의뢰서";
    const buffer = await workbook.xlsx.writeBuffer();
    const today = new Date();
    const date = today.toISOString().split('T')[0].replace(/-/g, '');
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileNameBase}_의뢰서_${date}.xlsx`);
  } catch (err) {
    console.error(err);
    ElNotification({
      title: "오류",
      message: "엑셀 다운로드 중 오류가 발생했습니다.",
      type: "error",
      duration: 3000,
      position: "top-right",
    });
  }
};


// 기존
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
//     sheet.mergeCells(`B${row}:E${row}`);
//     const cell = sheet.getCell(`B${row}`);
//     cell.value = text;
//     cell.font = { name: '맑은 고딕', size: 14, bold: true };
//     cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
//     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
//     sheet.getRow(row).height = 40;
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

//   const writeMergedRow = (row, label, value) => {
//     sheet.mergeCells(`C${row}:E${row}`);
//     const cellL = sheet.getCell(`B${row}`);
//     const cellV = sheet.getCell(`C${row}`);
//     cellL.value = label;
//     cellV.value = value;

//     cellL.font = { name: '맑은 고딕', size: 10, bold: true };
//     cellL.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
//     cellL.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4C4' } };
//     applyBorder(cellL);

//     cellV.font = { name: '맑은 고딕', size: 10 };
//     cellV.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
//     applyBorder(cellV);
//   };

//   const insertImageBelow = async (file, row, folder) => {
//     if (!file) return row;
//     try {
//       const response = await fetch(`/static/${folder}/${file.uId}.${file.ext}`);
//       const blob = await response.blob();
//       const buffer = await blob.arrayBuffer();
//       const imageId = workbook.addImage({ buffer, extension: file.ext });

//       const imageHeight = 240, imageWidth = 640;
//       const pxPerRow = 20;
//       const rowHeight = Math.ceil(imageHeight / pxPerRow);

//       sheet.spliceRows(row + 1, 0, ...Array(rowHeight).fill([]));
//       sheet.mergeCells(`B${row + 1}:E${row + rowHeight}`);
//       sheet.addImage(imageId, {
//         tl: { col: 1, row: row },
//         ext: { width: imageWidth, height: imageHeight }
//       });

//       return row + rowHeight + 1;
//     } catch (e) {
//       console.error("이미지 삽입 실패", e);
//       return row;
//     }
//   };

//   const fields = [
//     ['Model Name\nTên model', app.productName, 'Quantity\nSố lượng', app.quantity],
//     ['의뢰 목적\nMục đích yêu cầu', app.purpose, '조립차수\nLần lắp ráp', app.smtHistory || ''],
//     ['자재 전달 일자\nNgày gửi NVL', app.dateOfDeliveryDate?.substring(0, 10) || '', '완료 요청 일자\nNgày yêu cầu hoàn thành', app.dateOfExpectedFinished?.substring(0, 10) || ''],
//     ['LOT ID', app.lotId || '', 'Mold', app.mold],
//     ['샘플 전달방법\nCách giao mẫu', app.deliveryMethod, '작성자\nNgười viết', app.user?.userName || ''],
//     ['생성일\nNgày tạo', app.dateOfCreated?.substring(0, 10) || '', '', ''],
//     ['TCF 측정 유무\nCó đo TCF không', app.needTcf ? 'O' : 'X', 'TCF 측정 온도\nNhiệt độ đo TCF', app.tcfTemperature || '']
//   ];

//   let row = 2;
//   writeSectionHeader(row++, '기본 정보\nTHÔNG TIN CƠ BẢN');
//   for (let i = 0; i < fields.length; i++) {
//     const [l1 = '', v1 = '', l2 = '', v2 = ''] = fields[i] || [];
//     writeFieldRow(row++, l1, v1, l2, v2);
//   }

//   if (app.isNa && app.naApp?.na) {
//   writeSectionHeader(row++, 'NA 정보\nTHÔNG TIN NA', 'FFD9EAD3');
//     writeMergedRow(row++, 'NA 종류\nLoại NA', app.naApp?.na || '');
//     writeFieldRow(row++, '측정 방식\nPhương pháp đo', app.naApp?.measMethod || '', 'De-Embedding 방식\nPhương pháp de-embedding', app.naApp?.deMethod || '');
//     writeFieldRow(row++, 'Port Extension Loss', app.naApp?.portExtensionLoss ? 'ON' : 'OFF', 'S-Parameter Type', app.naApp?.sParaType == 'true' ? 'Ideal Matching 포함' : 'Ideal Matching 미포함');
//     writeMergedRow(row++, 'NA 특이사항\nLưu ý về NA', app.naApp?.note || '');
//     // if (app.naApp?.naSpecialFile?.length > 0) {
//     //   row = await insertImageBelow(app.naApp.naSpecialFile[0], row, 'na_special');
//     // }
//     if (app.naApp?.naSpecialFile?.length > 0) {
//       for (const file of app.naApp.naSpecialFile) {
//         row = await insertImageBelow(file, row, 'na_special');
//         }
//       }
//   }

//   if (app.isNf) {
//   writeSectionHeader(row++, 'NF 정보\nTHÔNG TIN NF', 'FFD9EAD3');
//     writeFieldRow(row++, 'NF De-embedding 방식', app.nfApp?.deMethod || '', 'NF Real Matching 여부', app.nfApp?.isRealMatching ? 'O' : 'X');
//     writeMergedRow(row++, 'NF 특이사항\nLưu ý về NF', app.nfApp?.note || '');
//     // if (app.nfApp?.nfSpecialFile?.length > 0) {
//     //   row = await insertImageBelow(app.nfApp.nfSpecialFile[0], row, 'nf_special');
//     // }
//     if (app.nfApp?.nfSpecialFile?.length > 0) {
//       for (const file of app.nfApp.nfSpecialFile) {
//         row = await insertImageBelow(file, row, 'nf_special');
//           }
//       }
//   }

//   for (let i = 6; i <= 50; i++) sheet.getColumn(i).hidden = true;
//   for (let i = row + 1; i <= 100; i++) sheet.getRow(i).hidden = true;

//   sheet.pageSetup = {
//     margins: { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.1, footer: 0.1 },
//     orientation: 'portrait',
//     paperSize: 9
//   };

//   const buffer = await workbook.xlsx.writeBuffer();
//   saveAs(new Blob([buffer]), `의뢰서_${app.productName || '무기종명'}.xlsx`);
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

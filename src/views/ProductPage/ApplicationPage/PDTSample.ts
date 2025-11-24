import axios from "axios";

import { ElMessageBox, ElMessage, genFileId } from "element-plus";

import type { SampleInformation } from "./Application";

export function calculateOffset(sample : SampleInformation, position : string, link : string){

  if(position === "" || position === "ETC"){
    return "0"
  }

  if(link === "" || link === "ETC"){
    return "0"
  }

  if(sample.ilLevel === ""){
    return "0"
  }

  if(sample.sInput === ""){
    return "0"
  }

  if(sample.sOutput === ""){
    return "0"
  }


}

export const checkFileExtension = (fileName) => {
  // 파일 확장자 가져오기
  const extension = fileName.split(".").pop().toLowerCase();
  // 확장자가 's'로 시작하고 'p'로 끝나는지 확인
  return extension.startsWith("s") && extension.endsWith("p");
};

export const isPortReady = (row: SampleInformation) =>{
  const sIn = (row.sInput ?? "").toString().trim();
  const sOut = (row.sOutput ?? "").toString().trim();
  return sIn.length > 0 && sOut.length > 0;
}

// export const handleFileSelect = (sample: SampleInformation) => {
//   if (!isPortReady(sample)) {
//     ElMessage.warning("파일 선택 전, Port(Input/Output)을 입력해주세요.");
//     return;
//   }

//   // File selection logic
//   const fileInput = document.createElement("input");
//   fileInput.type = "file";
//   // fileInput.accept = '.txt'; // Example: Allow only .txt extension
//   fileInput.addEventListener("change", (event) => {
//     const input = event.target as HTMLInputElement;
//     const selectedFile = input.files[0];

//     // 확장자 체크
//     if (!checkFileExtension(selectedFile.name)) {
//       ElMessage.error("S parameter 파일만 선택할 수 있습니다.");
//       return;
//     }

//     if (selectedFile) {
//       // Use FileReader to read the file content
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const fileContent = event.target.result as string; // 결과를 문자열로 캐스팅

//         sample.sParaFileName = selectedFile.name;
//         sample.fileContent = fileContent;

//         // 여기서 Logic 하나를 더 추가. 
//         // 만약 필요한 값들이 다 입력되어 있다면 OFFSET 값 자동으로 계산되도록. 


//       };
//       reader.readAsText(selectedFile);
//     }
//   });
//   fileInput.click();
// };

export async function handleFileSelect(row: SampleInformation) {
  // Port 검증
  const outPort = Number((row.sOutput ?? "").toString().trim());
  const inPort  = Number((row.sInput  ?? "").toString().trim());
  if (!Number.isInteger(outPort) || !Number.isInteger(inPort)) {
    ElMessage.warning("Port를 정수로 입력해주세요.");
    return;
  } 

  const ports = Math.max(outPort, inPort);
  if (ports < 1 || ports > 10) {
    ElMessage.warning("현재는 1~10 Port S-Parameter 파일만 지원합니다.");
    return;
  }

  // 파일 선택
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".S1P,.S2P,.S3P,.S4P,.S5P,.S6P,.S7P,.S8P,.S9P,.S10P,.txt";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    
    try {
      const name = file.name;
      const text = await file.text();
      
      // 🔹 Port 슬라이스
      const res = sliceSparamByPort(text, outPort, inPort, { ports });
      const reduced = serializeSliced(res, outPort, inPort);

      // 🔹 용량 로그 출력
      const originalBytes = new TextEncoder().encode(text).length;
      const reducedBytes = new TextEncoder().encode(reduced).length;
      console.log(
        `[S${outPort}${inPort}] 파일 압축 결과`,
        `원본: ${(originalBytes / 1024).toFixed(2)} KB`,
        `→ 축소 후: ${(reducedBytes / 1024).toFixed(2)} KB`
      );

      // 🔹 sample 내부 필드에 직접 저장
      row.sParaFileName = name;
      row.fileContent = text; // 기존 구조 그대로 덮어쓰기

      // 🔹 localStorage에 전체 applicationForm 저장 (용량 줄어든 상태)
      //   form 전체를 저장하는 로직이 이미 onMounted/watch로 있으면 그대로 작동함
      if (reducedBytes < 4.5 * 1024 * 1024) {
        console.log(`✅ ${name} 가공 후 샘플에 저장 완료 (${(reducedBytes / 1024).toFixed(2)} KB)`);
      } else {
        ElMessage.warning("⚠️ 파일이 커서 localStorage 한도를 초과할 수 있습니다.");
      }

    } catch (e) {
      console.error(e);
      ElMessage.error("파일 처리 중 오류가 발생했습니다.");
    } finally {
      input.value = "";
    }
  };

  input.click();
}

export async function updateSampleStatus(sampleNumber : string , sampleUuid: string, status: string) {
  try {

    const formData = new FormData();
    formData.append("pdt_application_sample_uuid", sampleUuid)
    formData.append("status", status)
    formData.append("sample_number", sampleNumber)

    const response = await axios.post(
      "/pdt_application/update_pdt_appliction_sample_status",
      formData
    );

    if (response.status === 200) {
      if (response.data.status) {
        ElMessage.success(`${sampleNumber}가 정상적으로 업데이트 되었습니다.`);
      } else {
        ElMessage.error("의뢰서 작성에 실패했습니다. 잠시 후에 시도하세요");
      }
    }
  } catch (error) {
    ElMessage.error("알수없는 오류가 발생했습니다. 잠시 후에 시도하세요");
  }
}

export type SliceOptions = {
  // 몇 포트 파일인지 (지금은 3이 기본이지만 일반화 가능)
  ports?: number;          // default 3
  unitFallback?: "HZ" | "KHZ" | "MHZ" | "GHZ";
};

export type SliceResult = {
  header: string[];
  rows: Array<{ freq: number; v1: number; v2: number }>;
  unit?: "HZ" | "KHZ" | "MHZ" | "GHZ";
  format?: "RI" | "MA" | "DB";
};

function parseHeaderTokens(line: string) {
  // 예: "# MHz S dB R 50"
  const t = line.trim().replace(/^#\s*/,"").split(/\s+/);
  let unit: SliceResult["unit"];
  let format: SliceResult["format"];
  for (const x of t) {
    const u = x.toUpperCase();
    if (["HZ","KHZ","MHZ","GHZ"].includes(u)) unit = u as any;
    if (["RI","MA","DB"].includes(u)) format = u as any;
  }
  return { unit, format };
}

function isComment(line: string) {
  const s = line.trim();
  return s.startsWith("!") || s.startsWith("#") || s === "";
}

function numTokens(line: string): number[] {
  return line.trim().split(/\s+/).map(Number).filter(v => !Number.isNaN(v));
}

function startsWithNumber(line: string) {
  return /^\s*[+-]?\d+(\.\d+)?([eE][+-]?\d+)?/.test(line);
}

export function sliceSparamByPort(
  text: string,
  outPort: number,
  inPort: number,
  opts: SliceOptions = {}
): SliceResult {
  const MAX_PORTS = 10;
  const portsRaw = opts.ports ?? 3;
  const ports = Math.min(Math.max(1, portsRaw), MAX_PORTS);

  // 포트 범위 검증
  if (outPort < 1 || outPort > ports || inPort < 1 || inPort > ports) {
    throw new Error(
      `지원하지 않는 포트 조합입니다. (outPort=${outPort}, inPort=${inPort}, ports=${ports})`
    );
  }

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const header: string[] = [];
  let unit: SliceResult["unit"] | undefined;
  let format: SliceResult["format"] | undefined;

  // 🔹 헤더 수집 + 데이터 시작 인덱스 찾기
  let dataStartIndex = 0;
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const s = line.trim();

    if (s.startsWith("#")) {
      const t = parseHeaderTokens(s);
      unit   = t.unit   ?? unit;
      format = t.format ?? format;
      header.push(line);
      dataStartIndex = idx + 1;
    } else if (s.startsWith("!") || s === "") {
      header.push(line);
      dataStartIndex = idx + 1;
    } else {
      // 첫 데이터 줄
      dataStartIndex = idx;
      break;
    }
  }

  const rows: SliceResult["rows"] = [];

  // 🔹 본문 파싱
  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (isComment(line)) continue;

    if (startsWithNumber(line)) {
      // ---- 하나의 freq 블록 구성 ----
      const blockLines: string[] = [];
      blockLines.push(line);

      for (let r = 1; r < ports; r++) {
        const ln = lines[i + r];
        if (!ln || isComment(ln) || !startsWithNumber(ln)) {
          break;
        }
        blockLines.push(ln);
      }

      // 기대한 포트 수만큼 줄이 안 나오면 이 블록 스킵
      if (blockLines.length < ports) {
        continue;
      }

      // ---- freq 파싱 ----
      const firstToks = blockLines[0].trim().split(/\s+/);
      const freq = Number(firstToks[0]);
      if (Number.isNaN(freq)) {
        continue;
      }

      // ---- 각 포트(row) 숫자 배열 생성 ----
      const rowNums: number[][] = [];

      // row1: freq 제거 후 숫자만
      const row1nums = numTokens(blockLines[0].replace(/^\s*[^\s]+\s+/, ""));
      rowNums.push(row1nums);

      // row2 ~ rowN: 전체 줄에서 숫자만
      for (let r = 1; r < ports; r++) {
        rowNums.push(numTokens(blockLines[r]));
      }

      // 각 row가 2*ports 이상 숫자를 가지고 있어야 함 (Sij 하나당 2개)
      const invalid = rowNums.some(r => r.length < 2 * ports);
      if (invalid) {
        console.warn("불완전한 데이터 블록 감지, 스킵:", { freq, rowNums });
        continue;
      }

      // ---- 원하는 S(out,in) 추출 ----
      const chosenRow = rowNums[outPort - 1];
      if (!chosenRow) {
        console.warn("outPort에 해당하는 row 없음", { outPort, ports, rowNums });
        continue;
      }

      const base = (inPort - 1) * 2;
      if (chosenRow.length <= base + 1) {
        console.warn("inPort 인덱스 범위 밖", { inPort, base, chosenRow });
        continue;
      }

      const v1 = chosenRow[base];
      const v2 = chosenRow[base + 1];

      rows.push({ freq, v1, v2 });

      // ---- i 를 블록 끝까지 이동 ----
      i += (ports - 1);
    }
  }

  return {
    header,
    rows,
    unit: unit ?? opts.unitFallback ?? "MHZ",
    format,
  };
}


// export function sliceSparamByPort(
//   text: string,
//   outPort: number, 
//   inPort: number, 
//   opts: SliceOptions = {}
// ): SliceResult {
//   const ports = opts.ports;

//   const lines = text.replace(/\r\n/g,"\n").split("\n");
//   const header: string[] = [];
//   let unit: SliceResult["unit"] | undefined;
//   let format: SliceResult["format"] | undefined;

//   // 헤더 수집
//   for (const line of lines) {
//     const s = line.trim();
//     if (s.startsWith("#")) {
//       const t = parseHeaderTokens(s);
//       unit   = t.unit ?? unit;
//       format = t.format ?? format;
//       header.push(line);
//     } else if (s.startsWith("!")) {
//       header.push(line);
//     } else if (s === "") {
//       header.push(line);
//     } else {
//       // 첫 데이터 줄 도달
//       break;
//     }
//   }

//   // 본문 파싱
//   const rows: SliceResult["rows"] = [];
//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i];
//     if (!line) continue;
//     if (isComment(line)) continue;

//     if (startsWithNumber(line)) {
//       // 1) freq줄
//       const toks = line.trim().split(/\s+/);
//       const freq = Number(toks[0]);
//       if (Number.isNaN(freq)) continue;

//       const row1nums = numTokens(line.replace(/^\s*[^\s]+\s+/, "")); // freq 제거 후 6개
//       const row2 = lines[i+1] ?? "";
//       const row3 = lines[i+2] ?? "";

//       const row2nums = numTokens(row2);
//       const row3nums = numTokens(row3);

//       if (row1nums.length < 6 || row2nums.length < 6 || row3nums.length < 6) {
//         // 불완전 블록은 스킵
//         continue;
//       }

//       const matrices = [row1nums, row2nums, row3nums]; // 3행
//       const chosenRow = matrices[outPort - 1];

//       // inPort는 1..3, 각 포트는 2숫자(형식 RI/MA/DB 관계없이 2개씩)
//       const base = (inPort - 1) * 2;
//       const v1 = chosenRow[base];
//       const v2 = chosenRow[base + 1];

//       rows.push({ freq, v1, v2 });

//       // 다음 반복 시 i를 블록 끝으로 이동
//       i += 2;
//     }
//   }

//   return {
//     header,
//     rows,
//     unit: unit ?? opts.unitFallback ?? "MHZ",
//     format,
//   };
// }

/** 텍스트로 직렬화 (header 유지 + 축소 컬럼 주석 추가) */
export function serializeSliced(result: SliceResult, outPort: number, inPort: number) {
  const head = [
    ...result.header,
    `! Reduced: keep S${outPort}${inPort} only (2 values per freq)`,
    "! Columns: Freq  V1  V2",
  ].join("\n");

  const body = result.rows
    .map(r => `${r.freq}\t${r.v1}\t${r.v2}`)
    .join("\n");

  return `${head}\n${body}\n`;
}
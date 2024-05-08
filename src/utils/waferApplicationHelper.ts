import { reactive } from "vue";

// Exporting the wafer size list for use in other files
export const waferSizeList: string[] = [
  "4 Inch (0.5CM) ",
  "4 Inch (1CM)",
  "6 Inch",
];

export const measTypes: string[] = [
  "TCF",
  "TEP-P",
  "Pre-TEG",
  "CPW",
  "TEG-1",
  "TEG-1.5",
  "TEG-2",
  "TEG-3",
  "PDT",
  "Delay Line",
  "Harmonic",
];

// Types for the return object of the function
// interface WaferInfo {
//   shots: string[];
//   disableShots: string[];
//   size: number;
//   status: string[];
// }

interface shotInformation {
  shots: string[];
  disableShots: string[];
  size: number;
  status: string[];
}

interface waferInformation {
  waferName : string;
  waferStatus : string;
  dateOfStart : Date | null;
  dateOfEnd : Date | null;
}

export interface FreqSectionInfo {
  start: string;
  stop: string;
  point: string;
  ifwb: string;
}

export interface MeasInfo {
  measType: string;
  freqSectionInfo: FreqSectionInfo[];
}



export interface TegFormRuleInterface {
  designer: string;
  requester: string;
  purpose: string;
  lotID: string;

  shotSize: string;
  chipSize: string;
  chipQuantity: string;
  maskName: string;
  isMaskChange: string;
  port: string;

  detail: string;

  shotPatternNo: string;
  thruPatternNo: string;
  openPatternNo: string;
  rawPatternNo: string;

  waferQuantity: number;
  waferIDList: string[];
  waferSize: string;
  activeShots: string[];

  measInfo: MeasInfo[];

  dateOfCreated: string | Date;
  dateOfReserve: string | Date;
  dateOfFinish: string | Date;
  dateOfMeasStart: string | Date | null;

  temperatures: string[];

  note: string;

  modelName: string;
  measType: string[];

  priority: string;
  applicationType: string;
}

export const TegApplicationForm = reactive<TegFormRuleInterface>({
  designer: "",
  requester: "",
  purpose: "",
  lotID: "",

  shotSize: "",
  chipSize: "",
  chipQuantity: "",
  maskName: "",
  isMaskChange: "",
  port: "",

  detail: "",

  shotPatternNo: "",
  thruPatternNo: "",
  openPatternNo: "",
  rawPatternNo: "",

  waferQuantity: 0,
  waferIDList: [],
  waferSize: "",
  activeShots: [],

  measInfo: [],
  temperatures: [],

  note: "",

  modelName: "",
  measType: [],

  priority: "",
  applicationType: "",

  dateOfCreated: "",
  dateOfReserve: "",
  dateOfFinish: "",
  dateOfMeasStart: "",
});



// Function to get wafer information based on the size
export function getWaferInfoBySize(waferSize: string): shotInformation {
  let disableShot: string[] = [];
  let size: number = 0;
  const shots: string[] = [];

  if (waferSize === "4 Inch (1CM)") {
    const tempDisableShot: string[] = [];
    size = 9;
    // for (let x = 0; x < size; x++) {
    //     for (let y = 0; y < size; y++) {
    //         if (x + 1 === 5 && y + 1 === 5) {
    //             tempDisableShot.push(`${y + 1},${x + 1}`);
    //         } else if (x + 1 === 1 || y + 1 === 1 || x + 1 === 9 || y + 1 === 9) {
    //             tempDisableShot.push(`${y + 1},${x + 1}`);
    //         }
    //     }
    // }
    // disableShot = tempDisableShot;
    disableShot = [
      "1,1",
      "2,1",
      "3,1",
      "7,1",
      "8,1",
      "9,1",
      "1,2",
      "9,2",
      "1,3",
      "9,3",
      "5,5",

      "1,7",
      "9,7",
      "1,8",
      "9,8",
      "1,9",
      "2,9",
      "3,9",
      "7,9",
      "8,9",
      "9,9",
    ];
  } else {
    size = 13;
    disableShot = [
      "1,1",
      "2,1",
      "3,1",
      "4,1",
      "10,1",
      "11,1",
      "12,1",
      "13,1",
      "1,2",
      "2,2",
      "12,2",
      "13,2",
      "1,3",
      "13,3",
      "1,4",
      "13,4",
      "7,7",
      "1,10",
      "13,10",
      "1,11",
      "13,11",
      "1,12",
      "2,12",
      "12,12",
      "13,12",
      "1,13",
      "2,13",
      "3,13",
      "4,13",
      "10,13",
      "11,13",
      "12,13",
      "13,13",
    ];
  }

  // Generate all shots
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      shots.push(`${y + 1},${x + 1}`);
    }
  }

  // Initialize status array
  const status: string[] = new Array(shots.length).fill("deactivate");

  // Set status to 'disable' where necessary
  shots.forEach((shot, index) => {
    if (disableShot.includes(shot)) {
      status[index] = "disable";
    }
  });

  return {
    shots,
    disableShots: disableShot,
    size,
    status,
  };
}



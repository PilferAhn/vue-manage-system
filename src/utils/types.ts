export interface CalcuatedSummary{
  sampleNumber : string;
  dbm3 : string;
  p1Input : string;
  p2Input : string;
  p1Output : string;
  targetFreq : string;

  lf1 : string;
  lf2 : string;
  rf1 : string;
  rf2 : string;

  pIn: Number[];
  pOut: Number[];
  rf1Mhz: Number[];
  rf2Mhz: Number[];

}

export interface CalcuatedAverageSummary{
  
  p1InputAvg : string;
  p2InputAvg : string;
  p1OutputAvg : string;

  p1InputStd : string;
  p2InputStd : string;
  p1OutputStd : string;

}


interface Sample {
  uuid: string;
  sampleNumber: string;
  db3Freq: string;
  targetFreq: string;
  isSelf: boolean;
  isEdit : boolean;
  status: string;
  pdtApplicationUuid: string;
  p_in : string | null ;
  p_out : string | null ;
}


export interface TegFormRuleInterface {
  name: string
  region: string
  count: string
  date1: string
  date2: string
  delivery: boolean
  type: string[]
  resource: string
  desc: string
  waferQuantity : number
  dateOfConvery : ""
  waferSize: string
  note : string
  purpose : string
  lotID : string
  designer : string
  requester : string
  modelName : string
}

export interface ApplicationForm {
  customerCompany: "";
  specTemperature: "";
  specPower: "";
  isSpecEdit: false;
  uuid: string;
  requestNumber: string | null;
  modelName: string;
  band: string;
  condition: string;
  designer: string;
  requester: string;
  purpose: string;
  waferType: string;
  productType: string;
  temperature: string;
  inputPower: string;
  detail: string;
  startFreq: string;
  endFreq: string;
  status: string;
  dateOfSampleConvey: string;
  dateOfCreated: string;
  dateOfConfirm: string | null;
  dateOfFinish: string | null;
  expectedMeasurementDate: string | null;
  expectedCompletionDate: string | null;
  desiredCompletionDate: string | null;
  testType : string
  signalType: string;
  duplexMode: string | null;
  bandwidth: string;
  packageType: string;
  targetPosition: string;
  sampleQuantity: number;
  samples: Sample[];
}

export interface productStatus {
  test_type: string;
  status: string;
}

export interface userApplicationForm {
  band: string;
  model_name: string;
  condition: string;
  designer: string;
  requester: string;
  purpose: string;
  wafer_type: string;
  product_type: string;
  temperature: string;
  input_power: string;
  hours: string;
  signal: string;
  test_type: string;
  startFreq: string;
  endFreq: string;
  date1: string;
  detail: string;
}

interface bandInfo {
  duplexMode: string;
  uplinkMhz: string[];
  downlinkMhz: string[];
  channelBandwidthsMhz: string[];
}

// Band 정보를 Server로 부터 받아온다.
interface NetworkData {
  [key: string]: bandInfo;
}

export interface BandData {
  [key: string]: NetworkData;
}

interface BandInformationDict {
  LTE: NetworkData;
  NR: NetworkData;
  CW: NetworkData;
}

export const bandInformationDict: BandInformationDict = {
  CW: {},
  LTE: {
    "1": {
      duplexMode: "FDD",
      uplinkMhz: ["1920", "1980"],
      downlinkMhz: ["2110", "2170"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "2": {
      duplexMode: "FDD",
      uplinkMhz: ["1850", "1910"],
      downlinkMhz: ["1930", "1990"],
      channelBandwidthsMhz: ["1.4", "3", "5", "10", "15", "20"],
    },
    "3": {
      duplexMode: "FDD",
      uplinkMhz: ["1710", "1785"],
      downlinkMhz: ["1805", "1880"],
      channelBandwidthsMhz: ["1.4", "3", "5", "10", "15", "20"],
    },
    "4": {
      duplexMode: "FDD",
      uplinkMhz: ["1710", "1755"],
      downlinkMhz: ["2110", "2155"],
      channelBandwidthsMhz: ["1.4", "3", "5", "10", "15", "20"],
    },
    "5": {
      duplexMode: "FDD",
      uplinkMhz: ["824", "849"],
      downlinkMhz: ["869", "894"],
      channelBandwidthsMhz: ["1.4", "3", "5", "10"],
    },
    "7": {
      duplexMode: "FDD",
      uplinkMhz: ["2500", "2570"],
      downlinkMhz: ["2620", "2690"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "8": {
      duplexMode: "FDD",
      uplinkMhz: ["880", "915"],
      downlinkMhz: ["925", "960"],
      channelBandwidthsMhz: ["1.4", "3", "5", "10"],
    },
    "11": {
      duplexMode: "FDD",
      uplinkMhz: ["1427.9", "1447.9"],
      downlinkMhz: ["1475.9", "1495.9"],
      channelBandwidthsMhz: ["5", "10"],
    },
    "12": {
      duplexMode: "FDD",
      uplinkMhz: ["699", "716"],
      downlinkMhz: ["729", "746"],
      channelBandwidthsMhz: ["1.4", "3", "5", "10"],
    },
    "13": {
      duplexMode: "FDD",
      uplinkMhz: ["777", "787"],
      downlinkMhz: ["746", "756"],
      channelBandwidthsMhz: ["5", "10"],
    },
    "14": {
      duplexMode: "FDD",
      uplinkMhz: ["788", "798"],
      downlinkMhz: ["758", "768"],
      channelBandwidthsMhz: ["5", "10"],
    },
    "17": {
      duplexMode: "FDD",
      uplinkMhz: ["704", "716"],
      downlinkMhz: ["734", "746"],
      channelBandwidthsMhz: ["5", "10"],
    },
    "18": {
      duplexMode: "FDD",
      uplinkMhz: ["815", "830"],
      downlinkMhz: ["860", "875"],
      channelBandwidthsMhz: ["5", "10", "15"],
    },
    "19": {
      duplexMode: "FDD",
      uplinkMhz: ["830", "845"],
      downlinkMhz: ["875", "890"],
      channelBandwidthsMhz: ["5", "10", "15"],
    },
    "20": {
      duplexMode: "FDD",
      uplinkMhz: ["832", "862"],
      downlinkMhz: ["791", "821"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "21": {
      duplexMode: "FDD",
      uplinkMhz: ["1447.9", "1462.9"],
      downlinkMhz: ["1495.9", "1510.9"],
      channelBandwidthsMhz: ["5", "10", "15"],
    },
    "24": {
      duplexMode: "FDD",
      uplinkMhz: ["1626.5", "1660.5[B 1]"],
      downlinkMhz: ["1525", "1559[B 2]"],
      channelBandwidthsMhz: ["5", "10"],
    },
    "25": {
      duplexMode: "FDD",
      uplinkMhz: ["1850", "1915"],
      downlinkMhz: ["1930", "1995"],
      channelBandwidthsMhz: ["1.4", "3", "5", "10", "15", "20"],
    },
    "26": {
      duplexMode: "FDD",
      uplinkMhz: ["814", "849"],
      downlinkMhz: ["859", "894"],
      channelBandwidthsMhz: ["1.4", "3", "5", "10", "15"],
    },
    "28A" : {
      duplexMode: "FDD",
      uplinkMhz: ["703", "733"],
      downlinkMhz: ["758", "788"],
      channelBandwidthsMhz: ["3", "5", "10", "15", "20"],
    },
    "28B" : {
      duplexMode: "FDD",
      uplinkMhz: ["718", "748"],
      downlinkMhz: ["773", "803"],
      channelBandwidthsMhz: ["3", "5", "10", "15", "20"],
    },
    "28F": {
      duplexMode: "FDD",
      uplinkMhz: ["703", "748"],
      downlinkMhz: ["758", "803"],
      channelBandwidthsMhz: ["3", "5", "10", "15", "20"],
    },    
    "29": {
      duplexMode: "SDL",
      uplinkMhz: ["\u2014"],
      downlinkMhz: ["717", "728"],
      channelBandwidthsMhz: ["3", "5", "10"],
    },
    "30": {
      duplexMode: "FDD",
      uplinkMhz: ["2305", "2315"],
      downlinkMhz: ["2350", "2360"],
      channelBandwidthsMhz: ["5", "10"],
    },
    "31": {
      duplexMode: "FDD",
      uplinkMhz: ["452.5", "457.5"],
      downlinkMhz: ["462.5", "467.5"],
      channelBandwidthsMhz: ["1.4", "3", "5"],
    },
    "32": {
      duplexMode: "SDL",
      uplinkMhz: ["\u2014"],
      downlinkMhz: ["1452", "1496"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "34": {
      duplexMode: "TDD",
      uplinkMhz: ["2010", "2025"],
      downlinkMhz: ["2010", "2025"],
      channelBandwidthsMhz: ["5", "10", "15"],
    },
    "37": {
      duplexMode: "TDD",
      uplinkMhz: ["1910", "1930"],
      downlinkMhz: ["1910", "1930"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "38": {
      duplexMode: "TDD",
      uplinkMhz: ["2570", "2620"],
      downlinkMhz: ["2570", "2620"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "39": {
      duplexMode: "TDD",
      uplinkMhz: ["1880", "1920"],
      downlinkMhz: ["1880", "1920"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "40": {
      duplexMode: "TDD",
      uplinkMhz: ["2300", "2400"],
      downlinkMhz: ["2300", "2400"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "41": {
      duplexMode: "TDD",
      uplinkMhz: ["2496", "2690"],
      downlinkMhz: ["2496", "2690"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "42": {
      duplexMode: "TDD",
      uplinkMhz: ["3400", "3600"],
      downlinkMhz: ["3400", "3600"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "43": {
      duplexMode: "TDD",
      uplinkMhz: ["3600", "3800"],
      downlinkMhz: ["3600", "3800"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "46": {
      duplexMode: "TDD",
      uplinkMhz: ["5150", "5925"],
      downlinkMhz: ["5150", "5925"],
      channelBandwidthsMhz: ["10", "20"],
    },
    "47": {
      duplexMode: "TDD",
      uplinkMhz: ["5855", "5925"],
      downlinkMhz: ["5855", "5925"],
      channelBandwidthsMhz: ["10", "20"],
    },
    "48": {
      duplexMode: "TDD",
      uplinkMhz: ["3550", "3700"],
      downlinkMhz: ["3550", "3700"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "50": {
      duplexMode: "TDD",
      uplinkMhz: ["1432", "1517"],
      downlinkMhz: ["1432", "1517"],
      channelBandwidthsMhz: ["3", "5", "10", "15", "20"],
    },
    "51": {
      duplexMode: "TDD",
      uplinkMhz: ["1427", "1432"],
      downlinkMhz: ["1427", "1432"],
      channelBandwidthsMhz: ["3", "5"],
    },
    "53": {
      duplexMode: "TDD",
      uplinkMhz: ["2483.5", "2495"],
      downlinkMhz: ["2483.5", "2495"],
      channelBandwidthsMhz: ["1.4", "3", "5", "10"],
    },
    "54": {
      duplexMode: "TDD",
      uplinkMhz: ["1670", "1675"],
      downlinkMhz: ["1670", "1675"],
      channelBandwidthsMhz: ["1.4", "3", "5"],
    },
    "65": {
      duplexMode: "FDD",
      uplinkMhz: ["1920", "2010"],
      downlinkMhz: ["2110", "2200"],
      channelBandwidthsMhz: ["1.4", "3", "5", "10", "15", "20"],
    },
    "66": {
      duplexMode: "FDD",
      uplinkMhz: ["1710", "1780"],
      downlinkMhz: ["2110", "2200[B 3]"],
      channelBandwidthsMhz: ["1.4", "3", "5", "10", "15", "20"],
    },
    "67": {
      duplexMode: "SDL",
      uplinkMhz: ["\u2014"],
      downlinkMhz: ["738", "758"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "69": {
      duplexMode: "SDL",
      uplinkMhz: ["\u2014"],
      downlinkMhz: ["2570", "2620"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "70": {
      duplexMode: "FDD",
      uplinkMhz: ["1695", "1710"],
      downlinkMhz: ["1995", "2020"],
      channelBandwidthsMhz: ["5", "10", "15", "20[B 5]"],
    },
    "71": {
      duplexMode: "FDD",
      uplinkMhz: ["663", "698"],
      downlinkMhz: ["617", "652"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "72": {
      duplexMode: "FDD",
      uplinkMhz: ["451", "456"],
      downlinkMhz: ["461", "466"],
      channelBandwidthsMhz: ["1.4", "3", "5"],
    },
    "73": {
      duplexMode: "FDD",
      uplinkMhz: ["450", "455"],
      downlinkMhz: ["460", "465"],
      channelBandwidthsMhz: ["1.4", "3", "5"],
    },
    "74": {
      duplexMode: "FDD",
      uplinkMhz: ["1427", "1470"],
      downlinkMhz: ["1475", "1518"],
      channelBandwidthsMhz: ["1.4", "3", "5", "10", "15", "20"],
    },
    "75": {
      duplexMode: "SDL",
      uplinkMhz: ["\u2014"],
      downlinkMhz: ["1432", "1517"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    "76": {
      duplexMode: "SDL",
      uplinkMhz: ["\u2014"],
      downlinkMhz: ["1427", "1432"],
      channelBandwidthsMhz: ["5"],
    },
    "85": {
      duplexMode: "FDD",
      uplinkMhz: ["698", "716"],
      downlinkMhz: ["728", "746"],
      channelBandwidthsMhz: ["5", "10"],
    },
    "87": {
      duplexMode: "FDD",
      uplinkMhz: ["410", "415"],
      downlinkMhz: ["420", "425"],
      channelBandwidthsMhz: ["1.4", "3", "5"],
    },
    "88": {
      duplexMode: "FDD",
      uplinkMhz: ["412", "417"],
      downlinkMhz: ["422", "427"],
      channelBandwidthsMhz: ["1.4", "3", "5"],
    },
    "103": {
      duplexMode: "FDD",
      uplinkMhz: ["787", "788"],
      downlinkMhz: ["757", "758"],
      channelBandwidthsMhz: ["nan"],
    },
    "106": {
      duplexMode: "FDD",
      uplinkMhz: ["896", "901"],
      downlinkMhz: ["935", "940"],
      channelBandwidthsMhz: ["1.4", "3"],
    },
    "107": {
      duplexMode: "SDO",
      uplinkMhz: ["\u2014"],
      downlinkMhz: ["612", "652"],
      channelBandwidthsMhz: ["6", "7", "8"],
    },
    "108": {
      duplexMode: "SDO",
      uplinkMhz: ["\u2014"],
      downlinkMhz: ["470", "698"],
      channelBandwidthsMhz: ["6", "7", "8"],
    },
  },
  NR: {
    n1: {
      duplexMode: "FDD",
      uplinkMhz: ["1920", "1980"],
      downlinkMhz: ["2110", "2170"],
      channelBandwidthsMhz: [
        "5",
        "10",
        "15",
        "20",
        "25",
        "30",
        "40",
        "45",
        "50",
      ],
    },
    n2: {
      duplexMode: "FDD",
      uplinkMhz: ["1850", "1910"],
      downlinkMhz: ["1930", "1990"],
      channelBandwidthsMhz: ["5", "10", "15", "20", "25", "30", "35", "40"],
    },
    n3: {
      duplexMode: "FDD",
      uplinkMhz: ["1710", "1785"],
      downlinkMhz: ["1805", "1880"],
      channelBandwidthsMhz: [
        "5",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
      ],
    },
    n5: {
      duplexMode: "FDD",
      uplinkMhz: ["824", "849"],
      downlinkMhz: ["869", "894"],
      channelBandwidthsMhz: ["5", "10", "15", "20", "25[B 1]"],
    },
    n7: {
      duplexMode: "FDD",
      uplinkMhz: ["2500", "2570"],
      downlinkMhz: ["2620", "2690"],
      channelBandwidthsMhz: [
        "5",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "50",
      ],
    },
    n8: {
      duplexMode: "FDD",
      uplinkMhz: ["880", "915"],
      downlinkMhz: ["925", "960"],
      channelBandwidthsMhz: ["5", "10", "15", "20", "25[B 1]", "35[B 1]"],
    },
    n12: {
      duplexMode: "FDD",
      uplinkMhz: ["699", "716"],
      downlinkMhz: ["729", "746"],
      channelBandwidthsMhz: ["5", "10", "15"],
    },
    n13: {
      duplexMode: "FDD",
      uplinkMhz: ["777", "787"],
      downlinkMhz: ["746", "756"],
      channelBandwidthsMhz: ["5", "10"],
    },
    n14: {
      duplexMode: "FDD",
      uplinkMhz: ["788", "798"],
      downlinkMhz: ["758", "768"],
      channelBandwidthsMhz: ["5", "10"],
    },
    n18: {
      duplexMode: "FDD",
      uplinkMhz: ["815", "830"],
      downlinkMhz: ["860", "875"],
      channelBandwidthsMhz: ["5", "10", "15"],
    },
    n20: {
      duplexMode: "FDD",
      uplinkMhz: ["832", "862"],
      downlinkMhz: ["791", "821"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    n24: {
      duplexMode: "FDD",
      uplinkMhz: ["1626.5", "1660.5[B 2]"],
      downlinkMhz: ["1525", "1559[B 3]"],
      channelBandwidthsMhz: ["5", "10"],
    },
    n25: {
      duplexMode: "FDD",
      uplinkMhz: ["1850", "1915"],
      downlinkMhz: ["1930", "1995"],
      channelBandwidthsMhz: [
        "5",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45[B 1]",
      ],
    },
    n26: {
      duplexMode: "FDD",
      uplinkMhz: ["814", "849"],
      downlinkMhz: ["859", "894"],
      channelBandwidthsMhz: ["3", "5", "10", "15", "20", "25[B 4]", "30[B 4]"],
    },
    n28: {
      duplexMode: "FDD",
      uplinkMhz: ["703", "748"],
      downlinkMhz: ["758", "803"],
      channelBandwidthsMhz: ["3", "5", "10", "15", "20", "25", "30"],
    },
    n29: {
      duplexMode: "SDL",
      uplinkMhz: ["\u2014"],
      downlinkMhz: ["717", "728"],
      channelBandwidthsMhz: ["5", "10"],
    },
    n30: {
      duplexMode: "FDD",
      uplinkMhz: ["2305", "2315"],
      downlinkMhz: ["2350", "2360"],
      channelBandwidthsMhz: ["5", "10"],
    },
    n31: {
      duplexMode: "FDD",
      uplinkMhz: ["452.5", "457.5"],
      downlinkMhz: ["462.5", "467.5"],
      channelBandwidthsMhz: ["3", "5"],
    },
    n34: {
      duplexMode: "TDD",
      uplinkMhz: ["2010", "2025"],
      downlinkMhz: ["2010", "2025"],
      channelBandwidthsMhz: ["5", "10", "15"],
    },
    n38: {
      duplexMode: "TDD",
      uplinkMhz: ["2570", "2620"],
      downlinkMhz: ["2570", "2620"],
      channelBandwidthsMhz: ["5", "10", "15", "20", "25", "30", "40"],
    },
    n39: {
      duplexMode: "TDD",
      uplinkMhz: ["1880", "1920"],
      downlinkMhz: ["1880", "1920"],
      channelBandwidthsMhz: ["5", "10", "15", "20", "25", "30", "35", "40"],
    },
    n40: {
      duplexMode: "TDD",
      uplinkMhz: ["2300", "2400"],
      downlinkMhz: ["2300", "2400"],
      channelBandwidthsMhz: [
        "5[B 6]",
        "10",
        "15",
        "20",
        "25",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
      ],
    },
    n41: {
      duplexMode: "TDD",
      uplinkMhz: ["2496", "2690"],
      downlinkMhz: ["2496", "2690"],
      channelBandwidthsMhz: [
        "5",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
      ],
    },
    n46: {
      duplexMode: "TDD",
      uplinkMhz: ["5150", "5925"],
      downlinkMhz: ["5150", "5925"],
      channelBandwidthsMhz: ["10[B 4]", "20", "40", "60", "80", "100"],
    },
    n47: {
      duplexMode: "TDD",
      uplinkMhz: ["5855", "5925"],
      downlinkMhz: ["5855", "5925"],
      channelBandwidthsMhz: ["10", "20", "30", "40"],
    },
    n48: {
      duplexMode: "TDD",
      uplinkMhz: ["3550", "3700"],
      downlinkMhz: ["3550", "3700"],
      channelBandwidthsMhz: [
        "5[B 6]",
        "10",
        "15",
        "20",
        "30",
        "40",
        "50[B 4]",
        "60[B 4]",
        "70[B 4]",
        "80[B 4]",
        "90[B 4]",
        "100[B 4]",
      ],
    },
    n50: {
      duplexMode: "TDD",
      uplinkMhz: ["1432", "1517"],
      downlinkMhz: ["1432", "1517"],
      channelBandwidthsMhz: [
        "5[B 6]",
        "10",
        "15",
        "20",
        "30",
        "40",
        "50",
        "60",
        "80[B 1]",
      ],
    },
    n51: {
      duplexMode: "TDD",
      uplinkMhz: ["1427", "1432"],
      downlinkMhz: ["1427", "1432"],
      channelBandwidthsMhz: ["5"],
    },
    n53: {
      duplexMode: "TDD",
      uplinkMhz: ["2483.5", "2495"],
      downlinkMhz: ["2483.5", "2495"],
      channelBandwidthsMhz: ["5", "10"],
    },
    n54: {
      duplexMode: "TDD",
      uplinkMhz: ["1670", "1675"],
      downlinkMhz: ["1670", "1675"],
      channelBandwidthsMhz: ["5"],
    },
    n65: {
      duplexMode: "FDD",
      uplinkMhz: ["1920", "2010"],
      downlinkMhz: ["2110", "2200"],
      channelBandwidthsMhz: ["5", "10", "15", "20", "50"],
    },
    n66: {
      duplexMode: "FDD",
      uplinkMhz: ["1710", "1780"],
      downlinkMhz: ["2110", "2200[B 8]"],
      channelBandwidthsMhz: [
        "5",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
      ],
    },
    n67: {
      duplexMode: "SDL",
      uplinkMhz: ["\u2014"],
      downlinkMhz: ["738", "758"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    n70: {
      duplexMode: "FDD",
      uplinkMhz: ["1695", "1710"],
      downlinkMhz: ["1995", "2020"],
      channelBandwidthsMhz: ["5", "10", "15", "20[B 1]", "25[B 1]"],
    },
    n71: {
      duplexMode: "FDD",
      uplinkMhz: ["663", "698"],
      downlinkMhz: ["617", "652"],
      channelBandwidthsMhz: [
        "5",
        "10",
        "15",
        "20",
        "25[B 1]",
        "30[B 1]",
        "35[B 1]",
      ],
    },
    n72: {
      duplexMode: "FDD",
      uplinkMhz: ["451", "456"],
      downlinkMhz: ["461", "466"],
      channelBandwidthsMhz: ["3", "5"],
    },
    n74: {
      duplexMode: "FDD",
      uplinkMhz: ["1427", "1470"],
      downlinkMhz: ["1475", "1518"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    n75: {
      duplexMode: "SDL",
      uplinkMhz: ["\u2014"],
      downlinkMhz: ["1432", "1517"],
      channelBandwidthsMhz: ["5", "10", "15", "20", "25", "30", "40", "50"],
    },
    n76: {
      duplexMode: "SDL",
      uplinkMhz: ["\u2014"],
      downlinkMhz: ["1427", "1432"],
      channelBandwidthsMhz: ["5"],
    },
    n77: {
      duplexMode: "TDD",
      uplinkMhz: ["3300", "4200"],
      downlinkMhz: ["3300", "4200"],
      channelBandwidthsMhz: [
        "10",
        "15",
        "20",
        "25",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
      ],
    },
    n78: {
      duplexMode: "TDD",
      uplinkMhz: ["3300", "3800"],
      downlinkMhz: ["3300", "3800"],
      channelBandwidthsMhz: [
        "10",
        "15",
        "20",
        "25",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
      ],
    },
    n79: {
      duplexMode: "TDD",
      uplinkMhz: ["4400", "5000"],
      downlinkMhz: ["4400", "5000"],
      channelBandwidthsMhz: [
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
      ],
    },
    n80: {
      duplexMode: "SUL",
      uplinkMhz: ["1710", "1785"],
      downlinkMhz: ["\u2014"],
      channelBandwidthsMhz: ["5", "10", "15", "20", "25", "30", "40"],
    },
    n81: {
      duplexMode: "SUL",
      uplinkMhz: ["880", "915"],
      downlinkMhz: ["\u2014"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    n82: {
      duplexMode: "SUL",
      uplinkMhz: ["832", "862"],
      downlinkMhz: ["\u2014"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    n83: {
      duplexMode: "SUL",
      uplinkMhz: ["703", "748"],
      downlinkMhz: ["\u2014"],
      channelBandwidthsMhz: ["5", "10", "15", "20", "25", "30"],
    },
    n84: {
      duplexMode: "SUL",
      uplinkMhz: ["1920", "1980"],
      downlinkMhz: ["\u2014"],
      channelBandwidthsMhz: ["5", "10", "15", "20", "25", "30", "40", "50"],
    },
    n85: {
      duplexMode: "FDD",
      uplinkMhz: ["698", "716"],
      downlinkMhz: ["728", "746"],
      channelBandwidthsMhz: ["3", "5", "10", "15"],
    },
    n86: {
      duplexMode: "SUL",
      uplinkMhz: ["1710", "1780"],
      downlinkMhz: ["\u2014"],
      channelBandwidthsMhz: ["5", "10", "15", "20", "40"],
    },
    n89: {
      duplexMode: "SUL",
      uplinkMhz: ["824", "849"],
      downlinkMhz: ["\u2014"],
      channelBandwidthsMhz: ["5", "10", "15", "20,"],
    },
    n90: {
      duplexMode: "TDD",
      uplinkMhz: ["2496", "2690"],
      downlinkMhz: ["2496", "2690"],
      channelBandwidthsMhz: [
        "5",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
      ],
    },
    n91: {
      duplexMode: "FDD",
      uplinkMhz: ["832", "862"],
      downlinkMhz: ["1427", "1432"],
      channelBandwidthsMhz: ["5", "10[B 12]"],
    },
    n92: {
      duplexMode: "FDD",
      uplinkMhz: ["832", "862"],
      downlinkMhz: ["1432", "1517"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    n93: {
      duplexMode: "FDD",
      uplinkMhz: ["880", "915"],
      downlinkMhz: ["1427", "1432"],
      channelBandwidthsMhz: ["5", "10[B 12]"],
    },
    n94: {
      duplexMode: "FDD",
      uplinkMhz: ["880", "915"],
      downlinkMhz: ["1432", "1517"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    n95: {
      duplexMode: "SUL",
      uplinkMhz: ["2010", "2025"],
      downlinkMhz: ["\u2014"],
      channelBandwidthsMhz: ["5", "10", "15"],
    },
    n96: {
      duplexMode: "TDD",
      uplinkMhz: ["5925", "7125"],
      downlinkMhz: ["5925", "7125"],
      channelBandwidthsMhz: ["20", "40", "60", "80", "100"],
    },
    n97: {
      duplexMode: "SUL",
      uplinkMhz: ["2300", "2400"],
      downlinkMhz: ["\u2014"],
      channelBandwidthsMhz: [
        "5",
        "10",
        "15",
        "20",
        "25",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
      ],
    },
    n98: {
      duplexMode: "SUL",
      uplinkMhz: ["1880", "1920"],
      downlinkMhz: ["\u2014"],
      channelBandwidthsMhz: ["5", "10", "15", "20", "25", "30", "35", "40"],
    },
    n99: {
      duplexMode: "SUL",
      uplinkMhz: ["1626.5", "1660.5[B 2]"],
      downlinkMhz: ["\u2014"],
      channelBandwidthsMhz: ["5", "10"],
    },
    n100: {
      duplexMode: "FDD",
      uplinkMhz: ["874.4", "880"],
      downlinkMhz: ["919.4", "925"],
      channelBandwidthsMhz: ["3", "5"],
    },
    n101: {
      duplexMode: "TDD",
      uplinkMhz: ["1900", "1910"],
      downlinkMhz: ["1900", "1910"],
      channelBandwidthsMhz: ["5", "10"],
    },
    n102: {
      duplexMode: "TDD",
      uplinkMhz: ["5925", "6425"],
      downlinkMhz: ["5925", "6425"],
      channelBandwidthsMhz: ["20", "40", "60", "80", "100"],
    },
    n104: {
      duplexMode: "TDD",
      uplinkMhz: ["6425", "7125"],
      downlinkMhz: ["6425", "7125"],
      channelBandwidthsMhz: [
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
      ],
    },
    n105: {
      duplexMode: "FDD",
      uplinkMhz: ["663", "703"],
      downlinkMhz: ["612", "652"],
      channelBandwidthsMhz: [
        "5",
        "10",
        "15",
        "20",
        "25[B 1]",
        "30[B 1]",
        "35[B 1]",
      ],
    },
    n106: {
      duplexMode: "FDD",
      uplinkMhz: ["896", "901"],
      downlinkMhz: ["935", "940"],
      channelBandwidthsMhz: ["3"],
    },
    n109: {
      duplexMode: "FDD",
      uplinkMhz: ["703", "733"],
      downlinkMhz: ["1432", "1517"],
      channelBandwidthsMhz: [
        "5",
        "10",
        "15",
        "20",
        "25",
        "30",
        "40[B 1]",
        "50[B 1]",
      ],
    },
    n254: {
      duplexMode: "FDD",
      uplinkMhz: ["1610", "1626.5"],
      downlinkMhz: ["2483.5", "2500"],
      channelBandwidthsMhz: ["5", "10", "15"],
    },
    n255: {
      duplexMode: "FDD",
      uplinkMhz: ["1626.5", "1660.5"],
      downlinkMhz: ["1525", "1559"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
    n256: {
      duplexMode: "FDD",
      uplinkMhz: ["1980", "2010"],
      downlinkMhz: ["2170", "2200"],
      channelBandwidthsMhz: ["5", "10", "15", "20"],
    },
  },
};

import { ref } from "vue";

export interface TableData {
  customer?: string;
  category?: string;
  testType?: string;
  signal_type?: string;
  signal_info?: string;
  temperature?: string;
  time: string;
  vswr: string;
  input_Power: string;
  pcl: string;
}

export const tableData = ref<TableData[]>(
  [
    {
        customer: "전장",
        category: "-",
        pcl: "Grade1",
        testType: "Lifetime",
        signal_type: "LTE",
        temperature: "125 ℃",
        input_Power: "29 dBm",
        time: "5,000 hr",
        "vswr": "1:01\n"
    },
    {
        customer: "전장",
        category: "-",
        pcl: "Grade1",
        testType: "Lifetime",
        signal_type: "NR",
        temperature: "125 ℃",
        input_Power: "27.5 dBm",
        time: "5,000 hr",
        "vswr": "1:01\n"
    },
    {
        customer: "전장",
        category: "-",
        pcl: "Grade2",
        testType: "Lifetime",
        signal_type: "LTE",
        temperature: "105 ℃",
        input_Power: "29 dBm",
        time: "5,000 hr",
        "vswr": "1:01\n"
    },
    {
        customer: "전장",
        category: "-",
        pcl: "Grade2",
        testType: "Lifetime",
        signal_type: "NR",
        temperature: "105 ℃",
        input_Power: "27.5 dBm",
        time: "5,000 hr",
        "vswr": "1:01\n"
    },
    {
        customer: "전장",
        category: "-",
        pcl: "Grade3",
        testType: "Lifetime",
        signal_type: "LTE",
        temperature: "85 ℃",
        input_Power: "29 dBm",
        time: "5,000 hr",
        "vswr": "1:01\n"
    },
    {
        customer: "전장",
        category: "-",
        pcl: "Grade3",
        testType: "Lifetime",
        signal_type: "NR",
        temperature: "85 ℃",
        input_Power: "27.5 dBm",
        time: "5,000 hr",
        "vswr": "1:01\n"
    },
    {
        customer: "K1",
        category: "-",
        pcl: "2",
        testType: "MaxFuse",
        signal_type: "LTE/NR",
        temperature: "85 ℃",
        input_Power: "34 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "K1",
        category: "-",
        pcl: "3",
        testType: "MaxFuse",
        signal_type: "LTE/NR",
        temperature: "85 ℃",
        input_Power: "32 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "K1",
        category: "-",
        pcl: "2",
        testType: "Lifetime",
        signal_type: "LTE",
        temperature: "85 ℃",
        input_Power: "32 dBm",
        time: "5,000 hr",
        "vswr": "1:1\n"
    },
    {
        customer: "K1",
        category: "-",
        pcl: "2",
        testType: "Lifetime",
        signal_type: "NR",
        temperature: "85 ℃",
        input_Power: "30.5 dBm",
        time: "5,000 hr",
        "vswr": "1:1\n"
    },
    {
        customer: "K1",
        category: "-",
        pcl: "3",
        testType: "Lifetime",
        signal_type: "LTE",
        temperature: "85 ℃",
        input_Power: "29 dBm",
        time: "5,000 hr",
        "vswr": "1:1\n"
    },
    {
        customer: "K1",
        category: "-",
        pcl: "3",
        testType: "Lifetime",
        signal_type: "NR",
        temperature: "85 ℃",
        input_Power: "27.5 dBm",
        time: "5,000 hr",
        "vswr": "1:1\n"
    },
    {
        customer: "K1",
        category: "-",
        pcl: "-",
        testType: "Lifetime",
        signal_type: "WLAN",
        temperature: "85 ℃",
        input_Power: "25 dBm",
        time: "5,000 hr",
        "vswr": "1:1\n"
    },
    {
        customer: "K1",
        category: "-",
        pcl: "-",
        testType: "AMR",
        signal_type: "LTE/NR",
        temperature: "85 ℃",
        input_Power: "32 dBm",
        time: "2 hr",
        "vswr": "1:1\n"
    },
    {
        customer: "K1",
        category: "-",
        pcl: "-",
        testType: "AMR",
        signal_type: "WLAN",
        temperature: "85 ℃",
        input_Power: "28 dBm",
        time: "2 hr",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "-",
        pcl: "2",
        testType: "Lifetime",
        signal_type: "LTE",
        temperature: "55 ℃",
        input_Power: "33 dBm",
        time: "5,000 hr",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "-",
        pcl: "2",
        testType: "Lifetime",
        signal_type: "NR",
        temperature: "55 ℃",
        input_Power: "31 dBm",
        time: "5,000 hr",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "-",
        pcl: "3",
        testType: "Lifetime",
        signal_type: "LTE",
        temperature: "55 ℃",
        input_Power: "31.5 dBm",
        time: "5,000 hr",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "-",
        pcl: "3",
        testType: "Lifetime",
        signal_type: "NR",
        temperature: "55 ℃",
        input_Power: "29.5 dBm",
        time: "5,000 hr",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "-",
        pcl: "-",
        testType: "Aging",
        signal_type: "LTE/NR",
        temperature: "55 ℃",
        input_Power: "32 dBm",
        time: "15 min",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "-",
        pcl: "-",
        testType: "Lifetime",
        signal_type: "WLAN",
        temperature: "85 ℃",
        input_Power: "25 dBm",
        time: "5,000 hr",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "Level 1 [OPPO/ VIVO]",
        pcl: "2",
        testType: "MaxFuse",
        signal_type: "LTE/NR",
        temperature: "60 ℃",
        input_Power: "34 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "Level 1 [OPPO/ VIVO]",
        pcl: "2",
        testType: "MaxFuse (Corner SPL)",
        signal_type: "NR",
        temperature: "85 ℃",
        input_Power: "33 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "Level 1 [OPPO/ VIVO]",
        pcl: "2",
        testType: "MaxFuse",
        signal_type: "LTE/NR",
        temperature: "60 ℃",
        input_Power: "32 dBm",
        time: "-",
        "vswr": "6:1\n"
    },
    {
        customer: "중화",
        category: "Level 1 [OPPO/ VIVO]",
        pcl: "3",
        testType: "MaxFuse",
        signal_type: "LTE/NR",
        temperature: "60 ℃",
        input_Power: "32 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "Level 1 [OPPO/ VIVO]",
        pcl: "3",
        testType: "MaxFuse (Corner SPL)",
        signal_type: "NR",
        temperature: "85 ℃",
        input_Power: "31 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "Level 1 [OPPO/ VIVO]",
        pcl: "3",
        testType: "MaxFuse",
        signal_type: "LTE/NR",
        temperature: "60 ℃",
        input_Power: "30 dBm",
        time: "-",
        "vswr": "6:1\n"
    },
    {
        customer: "중화",
        category: "Level 2 [그 외 Brand]",
        pcl: "2",
        testType: "MaxFuse",
        signal_type: "LTE/NR",
        temperature: "60 ℃",
        input_Power: "34 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "Level 2 [그 외 Brand]",
        pcl: "2",
        testType: "MaxFuse (Corner SPL)",
        signal_type: "NR",
        temperature: "85 ℃",
        input_Power: "33 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "Level 2 [그 외 Brand]",
        pcl: "3",
        testType: "MaxFuse",
        signal_type: "LTE/NR",
        temperature: "60 ℃",
        input_Power: "32 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "Level 2 [그 외 Brand]",
        pcl: "3",
        testType: "MaxFuse (Corner SPL)",
        signal_type: "NR",
        temperature: "85 ℃",
        input_Power: "31 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "Level 3 [ODM]",
        pcl: "2",
        testType: "MaxFuse",
        signal_type: "LTE/NR",
        temperature: "60 ℃",
        input_Power: "33 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "Level 3 [ODM]",
        pcl: "2",
        testType: "MaxFuse (Corner SPL)",
        signal_type: "NR",
        temperature: "85 ℃",
        input_Power: "31 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "Level 3 [ODM]",
        pcl: "3",
        testType: "MaxFuse",
        signal_type: "LTE/NR",
        temperature: "60 ℃",
        input_Power: "32 dBm",
        time: "-",
        "vswr": "1:1\n"
    },
    {
        customer: "중화",
        category: "Level 3 [ODM]",
        pcl: "3",
        testType: "MaxFuse (Corner SPL)",
        signal_type: "NR",
        temperature: "85 ℃",
        input_Power: "30 dBm",
        time: "-",
        "vswr": "1:1\n"
    }
]


);

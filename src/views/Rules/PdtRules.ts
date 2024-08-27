import { ref } from "vue";

interface TableData {
    customer: string;
    content: string;
    lteNrWifi: string;
    signal: string;
    temp: string;
    timeHour: string;
    vswr: string;
    inputPower: string;
    pcl: string;
  }

export const tableData = ref<TableData[]>([
    {
      customer: "K1",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal: "QPSK, 5MHz, 12RB",
      temp: "+85",
      timeHour: "2",
      vswr: "1:1",
      inputPower: "+32",
      pcl: "3",
    },
    {
      customer: "K1",
      content: "Lifetime",
      lteNrWifi: "LTE",
      signal: "QPSK, 5MHz, 1RB",
      temp: "+85",
      timeHour: "5,000",
      vswr: "1:1",
      inputPower: "+32",
      pcl: "2",
    },
    {
      customer: "K1",
      content: "Lifetime",
      lteNrWifi: "LTE",
      signal: "QPSK, 5MHz, 1RB",
      temp: "+85",
      timeHour: "5,000",
      vswr: "1:1",
      inputPower: "+29",
      pcl: "3",
    },
    {
      customer: "K1",
      content: "Lifetime",
      lteNrWifi: "NR",
      signal: "QPSK, 5MHz, 1RB",
      temp: "+85",
      timeHour: "5,000",
      vswr: "1:1",
      inputPower: "+30.5",
      pcl: "2",
    },
    {
      customer: "K1",
      content: "Lifetime",
      lteNrWifi: "NR",
      signal: "QPSK, 5MHz, 1RB",
      temp: "+85",
      timeHour: "5,000",
      vswr: "1:1",
      inputPower: "+27.5",
      pcl: "3",
    },
    {
      customer: "K1",
      content: "Lifetime",
      lteNrWifi: "WiFi",
      signal: "CW or WLAN (Ex. IEEE802.11g)",
      temp: "+85",
      timeHour: "5000",
      vswr: "1:1",
      inputPower: "+25",
      pcl: "-",
    },
  
    {
      customer: "중화",
      content: "Lifetime",
      lteNrWifi: "LTE",
      signal: "QPSK, 5MHz, 1RB",
      temp: "+55",
      timeHour: "5,000",
      vswr: "1:1",
      inputPower: "+33",
      pcl: "2",
    },
    {
      customer: "중화",
      content: "Lifetime",
      lteNrWifi: "LTE",
      signal: "QPSK, 5MHz, 1RB",
      temp: "+55",
      timeHour: "5,000",
      vswr: "1:1",
      inputPower: "+31",
      pcl: "3",
    },
    {
      customer: "중화",
      content: "Lifetime",
      lteNrWifi: "NR",
      signal: "CP-OFDM, 5MHz, 1RB",
      temp: "+55",
      timeHour: "5,000",
      vswr: "1:1",
      inputPower: "+31.5",
      pcl: "2",
    },
    {
      customer: "중화",
      content: "Lifetime",
      lteNrWifi: "NR",
      signal: "CP-OFDM, 5MHz, 1RB",
      temp: "+55",
      timeHour: "5,000",
      vswr: "1:1",
      inputPower: "+29.5",
      pcl: "3",
    },
    {
      customer: "중화",
      content: "Lifetime",
      lteNrWifi: "WiFi",
      signal: "CW or WLAN (Ex. IEEE802.11g)",
      temp: "+85",
      timeHour: "5,000",
      vswr: "1:1",
      inputPower: "+25",
      pcl: "-",
    },
  
    {
      customer: "전장",
      content: "Lifetime",
      lteNrWifi: "LTE",
      signal: "QPSK, 5MHz, 1RB",
      temp: "+85",
      timeHour: "5,000",
      vswr: "1:1",
      inputPower: "+29",
      pcl: "Grade3",
    },
    {
      customer: "전장",
      content: "Lifetime",
      lteNrWifi: "NR",
      signal: "CP-OFDM, 5MHz, 1RB",
      temp: "+105",
      timeHour: "5,000",
      vswr: "1:1",
      inputPower: "+29",
      pcl: "Grade2",
    },
    {
      customer: "전장",
      content: "Lifetime",
      lteNrWifi: "NR",
      signal: "CP-OFDM, 5MHz, 1RB",
      temp: "+125",
      timeHour: "5,000",
      vswr: "1:1",
      inputPower: "+29",
      pcl: "Grade1",
    },
  
    {
      customer: "중화[VIVO外]",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal: "SC-FDMA/DFT-S-OFDM, 5MHz, 1RB\n※ start 29 dBm, 0.5 dBm step",
      temp: "+25",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+33.5",
      pcl: "3",
    },
    {
      customer: "중화[VIVO外]",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal: "SC-FDMA/DFT-S-OFDM, 5MHz, 1RB\n※ start 29 dBm, 0.5 dBm step",
      temp: "+25",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+35.5",
      pcl: "2",
    },
  
    {
      customer: "중화[VIVO外]",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal: "SC-FDMA/DFT-S-OFDM, 5MHz, 1RB\n※ start 29 dBm, 0.5 dBm step",
      temp: "+55",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+32.5",
      pcl: "3",
    },
    {
      customer: "중화[VIVO外]",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal: "SC-FDMA/DFT-S-OFDM, 5MHz, 1RB\n※ start 29 dBm, 0.5 dBm step",
      temp: "+55",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+34.5",
      pcl: "2",
    },
  
    {
      customer: "중화[VIVO外]",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal: "SC-FDMA/DFT-S-OFDM, 5MHz, 1RB\n※ start 29 dBm, 0.5 dBm step",
      temp: "+85",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+31.5",
      pcl: "3",
    },
    {
      customer: "중화[VIVO外]",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal: "SC-FDMA/DFT-S-OFDM, 5MHz, 1RB\n※ start 29 dBm, 0.5 dBm step",
      temp: "+85",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+33.5",
      pcl: "2",
    },
  
    {
      customer: "중화[VIVO外]",
      content: "MaxFuse",
      lteNrWifi: "NR",
      signal: "CP-OFDM, 5MHz, 1RB\n※ start 27 dBm, 0.5 dBm step",
      temp: "+25",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+32",
      pcl: "3",
    },
    {
      customer: "중화[VIVO外]",
      content: "MaxFuse",
      lteNrWifi: "NR",
      signal: "CP-OFDM, 5MHz, 1RB\n※ start 27 dBm, 0.5 dBm step",
      temp: "+25",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+34",
      pcl: "2",
    },
  
    {
      customer: "중화[VIVO外]",
      content: "MaxFuse",
      lteNrWifi: "NR",
      signal: "CP-OFDM, 5MHz, 1RB\n※ start 27 dBm, 0.5 dBm step",
      temp: "+55",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+31",
      pcl: "3",
    },
    {
      customer: "중화[VIVO外]",
      content: "MaxFuse",
      lteNrWifi: "NR",
      signal: "CP-OFDM, 5MHz, 1RB\n※ start 27 dBm, 0.5 dBm step",
      temp: "+55",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+33",
      pcl: "2",
    },
  
    {
      customer: "중화[VIVO外]",
      content: "MaxFuse",
      lteNrWifi: "NR",
      signal: "CP-OFDM, 5MHz, 1RB\n※ start 27 dBm, 0.5 dBm step",
      temp: "+85",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+33",
      pcl: "3",
    },
    {
      customer: "중화[VIVO外]",
      content: "MaxFuse",
      lteNrWifi: "NR",
      signal: "CP-OFDM, 5MHz, 1RB\n※ start 27 dBm, 0.5 dBm step",
      temp: "+85",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+32",
      pcl: "2",
    },
  
    {
      customer: "중화[OPPO/VIVO]",
      content: "MaxFuse",
      lteNrWifi: "LTE/NR",
      signal: "QPSK/DFT-S-OFDM, 5MHz, 1RB",
      temp: "+60",
      timeHour: "2 min",
      vswr: "1:1, 6:1",
      inputPower: "+32dBm(1:1), +30dBm(6:1)",
      pcl: "3",
    },
    {
      customer: "중화[OPPO/VIVO]",
      content: "MaxFuse",
      lteNrWifi: "LTE/NR",
      signal: "QPSK/DFT-S-OFDM, 5MHz, 1RB",
      temp: "+60",
      timeHour: "2 min",
      vswr: "1:1, 6:1",
      inputPower: "+34dBm(1:1), +32dBm(6:1)",
      pcl: "2",
    },
  
    {
      customer: "중화[OPPO/VIVO]",
      content: "Corner MaxFuse",
      lteNrWifi: "NR",
      signal: "QPSK/DFT-S-OFDM, 5MHz, 1RB\n※ start 27 dBm, 0.5 dBm step",
      temp: "+85",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+31",
      pcl: "3",
    },
    {
      customer: "중화[OPPO/VIVO]",
      content: "Corner MaxFuse",
      lteNrWifi: "NR",
      signal: "QPSK/DFT-S-OFDM, 5MHz, 1RB\n※ start 27 dBm, 0.5 dBm step",
      temp: "+85",
      timeHour: "2 min",
      vswr: "1:1",
      inputPower: "+33",
      pcl: "2",
    },
  
    {
      customer: "WLP BIZ[RR四]",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal:
        "QPSK/DFT-s-OFDM, 10MHz, 1RB\n※ 1dBm Step, 45deg Step.\n(HS) Start : 31dBm, Stop : 35dBm",
      temp: "85(High)",
      timeHour: "20 sec.",
      vswr: "6:1",
      inputPower: "고객사 별도 확인",
      pcl: "2",
    },
    {
      customer: "WLP BIZ[RR四]",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal:
        "QPSK/DFT-s-OFDM, 10MHz, 1RB\n※ 1dBm Step, 45deg Step.\n(HS) Start : 31dBm, Stop : 35dBm",
      temp: "-20(Low)",
      timeHour: "20 sec",
      vswr: "6:1",
      inputPower: "고객사 별도 확인",
      pcl: "2",
    },
    {
      customer: "WLP BIZ[RR四]",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal:
        "QPSK/DFT-s-OFDM, 10MHz, 1RB\n※ 1dBm Step, 45deg Step.\n(HS) Start : 31dBm, Stop : 35dBm",
      temp: "-20(High)",
      timeHour: "20 sec",
      vswr: "6:1",
      inputPower: "고객사 별도 확인",
      pcl: "2",
    },
  
    {
      customer: "WLP BIZ[RR四]",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal:
        "DFT-s-OFDM, 5MHz, 1RB\n※ 1dBm Step, 45deg Step.\n(HS) Start : 31dBm, Stop : 35dBm",
      temp: "85(High)",
      timeHour: "20 sec.",
      vswr: "6:1",
      inputPower: "고객사 별도 확인",
      pcl: "3",
    },
    {
      customer: "WLP BIZ[RR四]",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal:
        "DFT-s-OFDM, 5MHz, 1RB\n※ 1dBm Step, 45deg Step.\n(HS) Start : 31dBm, Stop : 35dBm",
      temp: "-20(Low)",
      timeHour: "20 sec",
      vswr: "6:1",
      inputPower: "고객사 별도 확인",
      pcl: "3",
    },
    {
      customer: "WLP BIZ[RR四]",
      content: "MaxFuse",
      lteNrWifi: "LTE",
      signal:
        "DFT-s-OFDM, 5MHz, 1RB\n※ 1dBm Step, 45deg Step.\n(HS) Start : 31dBm, Stop : 35dBm",
      temp: "-20(High)",
      timeHour: "20 sec",
      vswr: "6:1",
      inputPower: "고객사 별도 확인",
      pcl: "3",
    },
  ]);
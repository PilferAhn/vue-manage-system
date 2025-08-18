import { reactive } from "vue";
import axios from "axios";
import { ApplicationData, SmtItem, PositionItem, BomList, PcbInterface } from "../interface/orderSheetInterface";

export async function getCodeWpms(modelCode: string) {
  try {
    const response = await axios.get(
      "/wpms/getCode/" + modelCode
    );
    return response.data;
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}

export async function getOds(sheetId: string) {
  try {

    const response = await axios.get(
      "/ordersheet/get-data?sheetId=" + sheetId
    )
    console.log(response.data)
    return response.data;
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}

export async function getLevels(modelCode: string) {
  try {
    const response = await axios.get(
      "/ordersheet/get-levels?modelCode=" + modelCode
    )

    if (response.data && response.data.levels) {
      return response.data.levels
    } else {
      return []  // 또는 null, 또는 에러 throw 등
    }
  } catch (error) {
    console.error(error)
    return []  // 실패 시 fallback
  }
}

export async function getSheetsByLevel(modelCode: string, level: string) {
  try {
    const response = await axios.get(
      "/ordersheet/get-sheet-by-lv?modelCode=" + modelCode + "&level=" + level
    )
    if (response.data && response.data.length > 0) {
      console.log(response.data);
      return response.data
    } else {
      return []  // 또는 null, 또는 에러 throw 등
    }
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}

export async function createSheet(modelCode: string, level: string) {
  const data = {
    model_name: modelCode,
    full_model_name: '',
    module_type: '',
    assy_purpose_type: '',
    assy_purpose_shipment: '',
    saw_type: '',
    assy_purpose_level: level
  }

  try {
    const response = await axios.get(
      "/wpms/getCode/" + modelCode
    )
    if (response.data) {
      console.log(response.data);
      const rs = response.data;
      if (rs) {
        data.full_model_name = rs.fullModelName;
        data.module_type = rs.moduleType;
        data.assy_purpose_type = rs.assyPurposeType;
        data.assy_purpose_shipment = rs.assyPurposeShipment;
        data.saw_type = rs.sawType
      }
      console.log(data);
      const sheet = await axios.post(
        '/ordersheet/createSheet', data
      )
      return sheet.data
    } else {
      return []  // 또는 null, 또는 에러 throw 등
    }
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;

  }
}

export async function deleteSheet(sheetId: string) {
  try {
    await axios.get('/ordersheet/deleteSheet?sheetId=' + sheetId)
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;

  }
}
export async function copySheet(sheetId: string) {
  try {
    await axios.get('/ordersheet/copy-sheet?selectedSheetId=' + sheetId)
    return 'true'
  } catch (err) {
    console.error("There was an error with the submission", err);
    return err
  }
}
export async function copyLevel(fCode: string, curLevel: string, pasteLevel: string) {
  try {
    const formData = new FormData();
    formData.append('model_code', fCode);
    formData.append('level', curLevel);
    formData.append('pasteLevel', pasteLevel);
    const response = await axios.post('/ordersheet/copyLevel', formData);
    return response.data;
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}

export async function changeSheetName(sheetId: string, sheetName: string) {
  try {
    const req = {
      sheet_id: sheetId,
      sheet_name: sheetName
    }
    const response = await axios.post('/ordersheet/changeSheetName', req);
    return response.data
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}

export async function createPcb(modelCode: string, level: string) {
  const req = {
    model_code: modelCode,
    stype: 'pcb',
    level: level,
    sheet_id: '',
    sheet_name: '',
    useyn: ''
  }
  try {
    const response = await axios.post('/ordersheet/pcbCreate', req)
    return response.data
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}


export async function createBom(modelCode: string, level: string) {
  const req = {
    model_code: modelCode,
    stype: 'bom',
    level: level,
    sheet_id: '',
    sheet_name: '',
    useyn: ''
  }
  try {
    const response = await axios.post('/ordersheet/bomCreate', req)
    return response.data
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}


export async function getBomList(sheetId: string) {
  try {
    const response = await axios.get('/ordersheet/getBomList?sheetId=' + sheetId)
    console.log(response.data)
    return response.data
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}

export async function getBomCode(req: SmtItem) {
  try {
    const response = await axios.post('/ordersheet/getBomCode', req)
    const list = [...response.data, { MAKTX: 'neW 등록', MATNR: '', WGBEZ: 'x9z00' }];

    return list
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}



export async function postSaveChildren(formdata: ApplicationData, imagesetSD: File[], imagesetMI: File[], imagesetMD: File[], deleteImage: { url: string; file_index: string; cell_name: string }[]) {
  const formDataToSend = new FormData();


  formDataToSend.append("deleteImage", JSON.stringify(deleteImage));
  // image processing
  imagesetSD.forEach(file => {
    formDataToSend.append('imagesetSD', file);
  });
  imagesetMI.forEach(file => {
    formDataToSend.append('imagesetMI', file);
  })
  imagesetMD.forEach(file => {
    formDataToSend.append('imagesetMD', file);
  })

  for (const key in formdata) {
    const value = formdata[key as keyof ApplicationData];

    if (value !== undefined && value !== null) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        formDataToSend.append(key, String(value));
      } else {
        if (key === 'smt_list' || key === 'position_list') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, JSON.stringify(value));
        }
      }
    }
  }
  try {
    await axios.post('/ordersheet/save', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    alert("saved")
  } catch (error) {
    console.error("There was an error with the submission", error);
    alert("x")
    throw error;
  }
}


export async function getMenu() {
  try {
    const response = await axios.get('/ordersheet/getMenu');
    return response.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}
export async function getPcbCode(modelcode: string) {
  try {
    const response = await axios.get('/ordersheet/getPcbCode?modelCode=' + modelcode);
    return response.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function saveBomList(list: BomList[]) {
  try {
    console.log("asd", list);
    const response = axios.post('/ordersheet/saveBomList', list)
    alert("save")
  } catch (error) {
    console.error("", error);
    alert("x")
    throw error;
  }
}

export async function getPcbSheet(sheetId: string) {
  try {
    const response = await axios.get('/ordersheet/pcb/?sheetId=' + sheetId)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error("", error);
    throw error;
  }
}

export async function savePcb(formdata: PcbInterface, imagesetPCB: File[], deleteImage: { url: string; file_index: string; cell_name: string }[]) {
  const formDataToSend = new FormData();

  formDataToSend.append("deleteImage", JSON.stringify(deleteImage));
  // image processing
  imagesetPCB.forEach(file => {
    formDataToSend.append('imagesetPCB', file);
  });

  for (const key in formdata) {
    const value = formdata[key as keyof PcbInterface];

    if (value !== undefined && value !== null) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        formDataToSend.append(key, String(value));
      } else {
        if (key === 'pcb_list') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, JSON.stringify(value));
        }
      }
    }
  }
  try {
    console.log(formDataToSend)
    await axios.post('/ordersheet/savePcb', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    alert("saved")
  } catch (error) {
    console.error("There was an error with the submission", error);
    alert("x")
    throw error;
  }
}
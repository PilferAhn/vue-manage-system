import { reactive } from "vue";
import axios from "axios";
import { ApplicationData, SmtItem, PositionItem, BomList, PcbInterface, BomModule, BomModuleTable } from "../interface/orderSheetInterface";
import ModelName from "../views/TegPage/Application/ModelName.vue";

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
    // console.log(response.data)
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
      // console.log(response.data);
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
      // console.log(response.data);
      const rs = response.data;
      if (rs) {
        data.full_model_name = rs.fullModelName;
        data.module_type = rs.moduleType;
        data.assy_purpose_type = rs.assyPurposeType;
        data.assy_purpose_shipment = rs.assyPurposeShipment;
        data.saw_type = rs.sawType
      }
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

export async function getModuleCodeRev(modelCode: string) {
  try {
    const req = {
      type: 'module',
      code: modelCode
    }
    const result = await axios.post('/api/rawmaterials', req)

    return result.data
  } catch (error) {
    console.error("There was an error with the submission", error);
    alert("x")
    throw error;
  }
}

export async function getSawType(modelCode: string, level: string) {
  try {
    const result = await axios.get('/ordersheet/getsawtype?modelCode=' + modelCode + "&level=" + level)

  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}
export async function getMMQ() {
  try {
    const result = await axios.get('/ordersheet/getmodulesizetable')
    return result.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}
export async function postModuleSize(data) {
  try {
    const req = {
      mname: data.mname,
      msize: data.msize,
      mthickness: data.mthickness,
      mbaseqty: data.mbaseqty
    }

    const result = await axios.post('/ordersheet/postmodulesize', req)
    return result.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function postModuleSolder(data) {
  try {
    const req = {
      msize: data.msize,
      mcover: data.mcover,
      mcarrier: data.mcarrier,
      msolder: data.msolder
    }

    const result = await axios.post('/ordersheet/postmodulesolder', req)
    return result.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function postModuleMeterial(data) {
  try {
    const req = {
      saw_type: data.saw_type,
      mname: data.mname,
      msize: data.msize,
      mthickness: data.mthickness,
      mtip: data.mtip,
      mfilm: data.mfilm,
      mpcb: data.mpcb,
      meapcb: data.meapcb,
      mbadcell: data.mbadcell,
      mqty: data.mqty,
      mbomrequest: data.mbomrequest,
      msap: data.msap
    }

    const result = await axios.post('/ordersheet/postmodulemeterial', req)
    return result.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function getMeterialQtyBySheetId(sheetId: string) {
  try {

  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function getOdsBom(modelCode: string, level: string) {
  try {
    const result = await axios.get('/ordersheet/getOdsBom?modelCode=' + modelCode + "&level=" + level)
    return result.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function saveBomWait(req: BomModule[], table: BomModuleTable, sheetData: any, size: string) {
  try {
    const body = {
      table: table,
      details: req
    };
    const result = await axios.post('/ordersheet/saveBomWait', body);
    if (result.status === 200) {
      const mname = sheetData.model_name;
      const saw_type = sheetData.saw_type;
      const mthickness = sheetData.cellsize_t;
      for (const item of req) {
        if (item.sref === 'Epoxy') {
          if (!item.comoponent_quantity || item.comoponent_quantity === '0000') {
            const str = `/sqty ${mname},${saw_type},${size},${mthickness},`;

            try {
              // axios.post()를 사용하여 메시지 보내기
              // API가 요구하는 형식에 맞춰 데이터 객체를 구성해야 합니다.
              const data = {
                chatid: "19:51d7e8b09e0e4c18bdda1c5fc3ea2957@thread.v2",
                content: str,
                Message: "<div>" + str + "</div>"
              }
              alert("sended")
              await axios.post('/api/teams', data);

              console.log(`Message sent successfully for item: ${item.sref}`);
            } catch (error) {
              console.error(`Failed to send message for item: ${item.sref}`, error);
            }
          }
        }
      }




    }
    return result.data;

  } catch (error) {
    console.error("There was an error with the submission", error);
    alert("There was an error with the submission")
    throw error;
  }
}

export async function getBomWait() {
  try {
    const result = await axios.get('/ordersheet/getBomWait')
    return result.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function getBomWaitById(index: number) {
  try {
    const result = await axios.get('/ordersheet/getBomWaitById?wtid=' + index)
    return result.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function postConfirm(index: number, username: string) {
  try {
    const result = await axios.get('/ordersheet/postConfirm?wtid=' + index + "&username=" + username)
    return result.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}


export async function SendModuleBoms(list: BomModule[], wtid: number) {
  try {

    // const result = await axios.post('/api/SendModuleBoms', list)
    // const response = await axios.get('/ordersheet/postbom?wtid=' + wtid)
    // return result.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}


export async function delBom(wtid: number) {
  try {
    const result = await axios.get('/ordersheet/delbom?wtid=' + wtid)

    return result.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function excelDownload(modelCode: string, level: string) {
  try {
    const url = `/ordersheet/excel-download?modelCode=${encodeURIComponent(modelCode)}&level=${encodeURIComponent(level)}`;
    window.open(url, '_blank');
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}
export async function findSheetName(modelCode: string, level: string) {
  try {
    const result = await axios.get('/ordersheet/find-sheetname?modelCode=' + modelCode + "&level=" + level)

    return result.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function getQtyByPnSheetId(spn: string, sheetId: string) {
  try {
    const result = await axios.get('/ordersheet/getQtyByPnSheetId', {
      params: {
        spn: spn,
        sheetId: sheetId
      }
    });
    return result.data;
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}

export async function qtyRequest(sheet) {
  try {

    // const result = await axios.post('/api/SendModuleBoms', )
    // return result.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function getEpoxyBomQty(mname: string, saw_type: string, msize: string, mthickness: string, sheetId: string) {
  const data = {
    mname: mname,
    saw_type: saw_type,
    msize: msize,
    mthickness: mthickness,
    sheetId: sheetId
  }
  try {
    const result = await axios.post('/ordersheet/getEpoxyBomQty', data);

    return result.data;
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}
export async function getCCSQty(ssize: string) {
  try {
    const result = await axios.get('/ordersheet/getCCSQty', {
      params: {
        ssize: ssize
      }
    });
    return result.data;
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}
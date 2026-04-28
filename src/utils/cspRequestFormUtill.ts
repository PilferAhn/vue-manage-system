import { ApplicationData, CspImages } from "../interface/cspRequestFormInterface";
import { TableData } from "../interface/cspTableInterface"
import { reactive } from "vue";
import axios from "axios";


// Function to initialize and return a reactive ApplicationData object
export const initializeApplicationData = () => {
  return reactive<ApplicationData>({
    default_modelName: "",
    default_requireName: "",
    default_requireDate: "",
    default_requireAmount: "",
    default_pkgRequirement: "",
    default_productSize: "",
    default_purpose: "",

    system_erp_wafer: "",
    system_erp_pkg: "",
    system_erp_epoxy: "",

    system_mes_wafer: "",
    system_mes_pkg: "",
    system_mes_epoxy: "",

    wafer_chip_size: "",
    wafer_thickness: "",
    wafer_pad_type: "",
    wafer_send_quantity: "",
    wafer_mes_code: "",
    wafer_mark: "",
    wafer_lot_no: "",
    wafer_chip_qty: "",

    pkg_size: "",
    pkg_erp_code: "",
    pkg_meterial: "",
    pkg_note: "",

    epoxy_model: "",
    epoxy_thickness: "",

    bb_ballsize: "",

    bg_thickness: "",
    bg_afterthickness: "",

    dc_meterial: "",
    dc_thickness: "",
    dc_blade_thickness: "",
    mk_note: "",

    pd_dicing_line_size: "",
    pd_note: "",

    el_link_method: "",
    el_EVB_setup_port: "",

    analysis_fa_item: "",

    reliability_item: "",
    others_cer_check: "",
    fb_2_spl: "",
    fb_direction: "",
    fb_note: "",
    fb_1_numbering: "",
    mk_marking: "",
    form_status: "",
    box_id: "",
    bump_map: "",
    el_carrier_tape:"",
    pak_direction:"",
    wafer_sin: "",
  wafer_angle: "",
  el_ir_test: "",
  el_jig_vers: "",
  el_jig_spara: "",
  el_evb_flag: "",
  el_qty: ""

  });
};


export async function dataValidation(formdata: ApplicationData) {



  return true;

}

export async function getColumnData() {
  // const list<List[TableData]>

  try {
    const response = await axios.get(
      "/csp/getCspTableList?modelCode=");
    return response.data
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }

}



export async function handleSubmitForm(formdata: ApplicationData, imagesFB1: File[], imagesFB2: File[],
  imagesFB3: File[], imagesFB4: File[], imagesMK1: File[], imagesWMA1: File[], imagesPMAP1: File[], imagesWMAP1: File[],
  deleteImage: { url: string; file_index: string; cell_name: string }[]) {
  const formDataToSend = new FormData();
  console.log("delete image +>", deleteImage);

  for (const key in formdata) {
    if (formdata[key as keyof ApplicationData] !== undefined && formdata[key as keyof ApplicationData] !== null) {
      formDataToSend.append(key, formdata[key as keyof ApplicationData]);
    }
  }

  formDataToSend.append("deleteImage", JSON.stringify(deleteImage));
  // image processing
  imagesFB1.forEach(file => {
    formDataToSend.append('imagesetFB1', file);
  });
  imagesFB2.forEach(file => {
    formDataToSend.append('imagesetFB2', file);
  })
  imagesFB3.forEach(file => {
    formDataToSend.append('imagesetFB3', file);
  })

  imagesFB4.forEach(file => {
    formDataToSend.append('imagesetFB4', file);
  })

  imagesMK1.forEach(file => {
    formDataToSend.append('imagesetMK1', file);
  })

  imagesWMA1.forEach(file => {
    formDataToSend.append('imagesetWMA1', file);
  })
  imagesPMAP1.forEach(file => {
    formDataToSend.append('imagesetPMAP1', file);
  })
  imagesWMAP1.forEach(file => {
    formDataToSend.append('imagesetWMAP1', file);
  })
  try {
    await axios.post('/csp/create', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    alert("saved")
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}


export async function handleSubmitTempForm(formdata: ApplicationData, imagesFB1: File[], imagesFB2: File[], imagesFB3: File[], imagesFB4: File[], imagesMK1: File[], imagesEV1: File[], imagesSS1: File[],
  imagesWMA1: File[], imagesPMAP1: File[], imagesWMAP1: File[], imagesPAK1: File[],imagesJIG1:File[], deleteImage: { url: string; file_index: string; cell_name: string }[]) {
  const formDataToSend = new FormData();
  console.log("delete image +>", deleteImage);

  for (const key in formdata) {
    if (formdata[key as keyof ApplicationData] !== undefined && formdata[key as keyof ApplicationData] !== null) {
      formDataToSend.append(key, formdata[key as keyof ApplicationData]);
    }
  }

  formDataToSend.append("deleteImage", JSON.stringify(deleteImage));
  // image processing
  imagesFB1.forEach(file => {
    formDataToSend.append('imagesetFB1', file);
  });
  imagesFB2.forEach(file => {
    formDataToSend.append('imagesetFB2', file);
  })
  imagesFB3.forEach(file => {
    formDataToSend.append('imagesetFB3', file);
  })

  imagesFB4.forEach(file => {
    formDataToSend.append('imagesetFB4', file);
  })

  imagesMK1.forEach(file => {
    formDataToSend.append('imagesetMK1', file);
  })
  imagesEV1.forEach(file => {
    formDataToSend.append('imagesetEV1', file);
  })
  imagesSS1.forEach(file => {
    formDataToSend.append('filesetSS1', file);
  })

  imagesWMA1.forEach(file => {
    formDataToSend.append('filesetWMA1', file);
  })
  imagesPMAP1.forEach(file => {
    formDataToSend.append('filesetPMAP1', file);
  })
  imagesWMAP1.forEach(file => {
    formDataToSend.append('filesetWMAP1', file);
  })
  imagesPAK1.forEach(file => {
    formDataToSend.append('imagesetPAK1', file);
  })
  imagesJIG1.forEach(file => {
    formDataToSend.append('imagesetJIG1', file);
  })
  try {
    await axios.post('/csp/createtemp', formDataToSend, {
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

export async function handleGetDataByModelCode(code: string) {
  try {
    // console.log("try to axios ",data);
    const response = await axios.get(
      "/csp/getcsperpmes?modelCode=" + code);
    console.log("Submission successful", response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function handleGetFormList(code: string, username: string) {
  try {
    const response = await axios.get(
      "/csp/getcspform?modelCode=" + code + "&username=" + username
    );

    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}


export async function excelDownloadOne(modelCode: string) {
  // const list<List[TableData]>

  try {
    const url = `/csp/excelDownloadOne?modelCode=${encodeURIComponent(modelCode)}`;
    window.open(url, '_blank');

  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }

}

export async function getCheckSap(modelCode: string) {
  try {
    const response = await axios.get(
      "/csp/getchecksap?modelCode=" + modelCode
    );
    return response.data;
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}

export async function getLotNo(modelCode: string) {
  try {
    const response = await axios.get(
      "/csp/get_lot_no?modelCode=" + modelCode
    );

    console.log(response.data)
    return response.data;
  } catch (err) {
    console.error("There was an error with the submission", err);
    throw err;
  }
}

export async function fileDownload(id: number) {
  try {
    const response = await axios.get(
      `/csp/fileDownload?img_id=${id}`, // 템플릿 리터럴 사용으로 변경
      {
        // 1. 응답 타입을 'blob'으로 설정 (가장 중요!)
        responseType: 'blob',
      }
    );

    // 2. 응답 헤더에서 파일 이름 가져오기
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'unknown'; // 기본 파일 이름
    if (contentDisposition) {
      // "attachment; filename*=UTF-8''%ED%85%8C%EC%8A%A4%ED%8A%B8.jpg" 와 같은 형식 처리
      const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/);
      if (filenameMatch && filenameMatch[1]) {
        // URL 인코딩된 파일 이름 디코딩
        filename = decodeURIComponent(filenameMatch[1].replace(/"/g, ''));
      }
    }

    // 3. Blob 데이터로 임시 URL 생성
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // 4. 가상의 <a> 태그를 만들어 다운로드 실행
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // 여기서 파일 이름이 설정됩니다.
    document.body.appendChild(link);
    link.click();

    // 5. 생성했던 임시 URL과 링크 제거
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // 다운로드가 성공했음을 알리기 위해 true를 반환할 수 있습니다.
    return true;

  } catch (err) {
    console.error("파일 다운로드 중 에러가 발생했습니다.", err);
    // 사용자에게 에러 메시지를 보여주는 로직을 추가하면 좋습니다.
    throw err;
  }
}
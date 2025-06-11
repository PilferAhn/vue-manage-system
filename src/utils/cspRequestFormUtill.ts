import { ApplicationData,CspImages } from "../interface/cspRequestFormInterface";
import {TableData} from "../interface/cspTableInterface"
import { reactive } from "vue";
import axios from "axios";


// Function to initialize and return a reactive ApplicationData object
export const initializeApplicationData = () => {
  return reactive<ApplicationData>({
    default_modelName:"",
    default_requireName:"",
    default_requireDate:"",
    default_requireAmount:"" ,
    default_pkgRequirement:"" ,
    default_productSize:"" ,
    default_purpose:"" ,

    system_erp_wafer:"" ,
    system_erp_pkg:"" ,
    system_erp_epoxy:"" ,

    system_mes_wafer:"" ,
    system_mes_pkg:"" ,
    system_mes_epoxy:"" ,

    wafer_chip_size:"" ,
    wafer_thickness:"" ,
    wafer_pad_type:"" ,
    wafer_send_quantity:"" ,
    wafer_mes_code:"" ,
    wafer_mark:"" ,
    wafer_lot_no:"" ,
    wafer_chip_qty:"" ,

    pkg_size:"" ,
    pkg_erp_code:"" ,
    pkg_meterial:"" ,
    pkg_note:"" ,

    epoxy_model:"" ,
    epoxy_thickness:"" ,

    bb_ballsize:"" ,

    bg_thickness:"" ,
    bg_afterthickness:"" ,

    dc_meterial:"" ,
    mk_note: "",

    pd_dicing_line_size : "",
    pd_note : "",

    el_link_method : "",
    el_EVB_setup_port: "",

    analysis_fa_item: "",

    reliability_item: "",
    others_cer_check:"",
    fb_2_spl:""

  });
};


export async function dataValidation(formdata: ApplicationData) {
 


  return true;

}

export async function getColumnData(){
  // const list<List[TableData]>

  try{
    const response = await axios.get(
      "/csp/getCspTableList?modelCode=");
      return response.data
  }catch(error){
    console.error("There was an error with the submission", error);
    throw error;
  }

}


export async function handleSubmitForm(formdata: ApplicationData, imagesFB1 :File[], imagesFB2:File[], imagesFB3 :File[], imagesFB4:File[], imagesMK1 :File[]){
  const formDataToSend = new FormData();

  for(const key in formdata){
    if(formdata[key as keyof ApplicationData] !== undefined && formdata[key as keyof ApplicationData] !== null){
      formDataToSend.append(key,formdata[key as keyof ApplicationData]);
    }
  }

  // image processing
  imagesFB1.forEach(file =>{
    formDataToSend.append('imagesetFB1',file);
  });
  imagesFB2.forEach(file=>{
    formDataToSend.append('imagesetFB2',file);
  })
  imagesFB3.forEach(file=>{
    formDataToSend.append('imagesetFB3',file);
  })

  imagesFB4.forEach(file=>{
    formDataToSend.append('imagesetFB4',file);
  })

  imagesMK1.forEach(file=>{
    formDataToSend.append('imagesetMK1',file);
  })


  try{
    await axios.post('/csp/create',formDataToSend,{
      headers:{
        'Content-Type':'multipart/form-data'
      }
    })
    alert("saved")
  }catch(error){
    console.error("There was an error with the submission", error);
    throw error;
  }
}
export async function handleSubmitTempForm(formdata: ApplicationData, imagesFB1 :File[], imagesFB2:File[], imagesFB3 :File[], imagesFB4:File[], imagesMK1 :File[],  deleteImage: { url: string; file_index: string; cell_name: string }[]){
  const formDataToSend = new FormData();
  console.log("delete image +>",deleteImage);

  for(const key in formdata){
    if(formdata[key as keyof ApplicationData] !== undefined && formdata[key as keyof ApplicationData] !== null){
      formDataToSend.append(key,formdata[key as keyof ApplicationData]);
    }
  }

  formDataToSend.append("deleteImage", JSON.stringify(deleteImage));
  // image processing
  imagesFB1.forEach(file =>{
    formDataToSend.append('imagesetFB1',file);
  });
  imagesFB2.forEach(file=>{
    formDataToSend.append('imagesetFB2',file);
  })
  imagesFB3.forEach(file=>{
    formDataToSend.append('imagesetFB3',file);
  })

  imagesFB4.forEach(file=>{
    formDataToSend.append('imagesetFB4',file);
  })

  imagesMK1.forEach(file=>{
    formDataToSend.append('imagesetMK1',file);
  })


  try{
    await axios.post('/csp/createtemp',formDataToSend,{
      headers:{
        'Content-Type':'multipart/form-data'
      }
    })
    alert("saved")
  }catch(error){
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function handleGetDataByModelCode(code: string) {
  try {
    // console.log("try to axios ",data);
    const response = await axios.get(
      "/csp/getcsperpmes?modelCode="+code);
    console.log("Submission successful", response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error with the submission", error);
    throw error;
  }
}

export async function handleGetFormList(code : string,username:string){
  try{
    const response = await axios.get(
      "/csp/getcspform?modelCode="+code+"&username="+username
    );
 
    console.log(response.data);
    return response.data;
  }catch(err){
    console.error("There was an error with the submission", err);
    throw err;
  }
}


export async function excelDownloadOne(modelCode:string){
  // const list<List[TableData]>

  try{
    const url = `/csp/excelDownloadOne?modelCode=${encodeURIComponent(modelCode)}`;
    window.open(url, '_blank');

  }catch(error){
    console.error("There was an error with the submission", error);
    throw error;
  }

}
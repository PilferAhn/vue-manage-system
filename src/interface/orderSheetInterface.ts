
// SMT 항목 정의
export interface SmtItem {
    smt_id: number,
    sheet_id: string;
    sorder: string;
    sref: string;
    sbom: string;
    spn: string;
    svalue: string;
    ssize: string;
    smarker: string;
    sx: string;
    sy: string;
}

// 포지션 항목 정의
export interface PositionItem {
    position_id: number;
    sheet_id: string;
    point: string;
    xtop: string;
    ytop: string;
    pindex: string;
}

// solder application entity
export interface ApplicationData {
    sheet_id: string
    model_name: string
    full_model_name: string
    metal_mask: string
    pcb_code: string
    quantity: string
    pcb_amount: string
    assy_purpose_type: string
    assy_purpose_level: string
    assy_purpose_submit_yn: string
    assy_purpose_shipment: string
    assy_purpose_shipment_etc: string,
    request_requestor: string
    request_receiver: string
    request_request_date: string
    request_date_end: string
    module_type: string
    saw_type: string
    msl_level: string
    assembly_history: string
    changed_yn: string
    history_remark: string
    requirement_remark: string
    assembly_type: string
    heat: string
    ft: string
    fa: string
    taping: string
    array_x: string
    array_y: string
    array_quantinty: string
    cellsize_l: string
    cellsize_w: string
    cellsize_t: string
    ap_smt_flag: string
    ap_smt_item: string
    ap_smt_flux: string
    ap_smt_solder: string
    ap_smt_remark: string
    ap_molding_flag: string
    ap_molding_item: string
    ap_molding_description: string
    ap_molding_remark: string
    ap_grinding_flag: string
    ap_grinding_item: string
    ap_grinding_description: string
    ap_grinding_remark: string
    ap_marking_flag: string
    ap_marking_item: string
    ap_marking_description: string
    ap_marking_remark: string
    ap_dicing_flag: string
    ap_dicing_item: string
    ap_dicing_l: string
    ap_dicing_w: string
    ap_dicing_t: string
    ap_dicing_remark: string
    smt_list: SmtItem[];
    position_list: PositionItem[];
    image_List: CspImages[]
}


export interface PcbInterface {
    sheet_id: string,
    array_flag: string,
    remark: string,
    note: string,
    pcb_list: PcbList[]
    image_List: CspImages[]
}
export interface PcbList {
    pcb_id: number,
    sheet_id: string,
    status: string,
    array_no: string,
    px: string,
    py: string,
    quantity: string,
    colno: string,
    rowno: string,
    remark: string
}
export interface BomList {
    sheet_id: string,
    model_code: string,
    level: string,
    sref: string,
    sbom: string,
    spn: string,
    svalue: string,
    ssize: string,
    smarker: string,
    bomcheck: string,
    moving_avgp: string,
    moq: string,
    remark: string
}
export interface ModuleMenu {
    mlabel: string,
    mvalue: string,
    morder: string,
    mtype: string,
}

export interface BomMeterial {
    MATNR: string,
    MAKTX: string,
    MTART: string,
    WERKS: string
}

export interface CspImages {
    model_name: string
    cell_name: string
    file_index: string
    url: string
}

export interface BomModule {
    material_numbering: string,
    desc: string,
    bom_item_number: string,
    bom_component: string,
    maktx: string,
    comoponent_quantity: string,
    unit: string,
    username: string,
    saw_type: string,
    module_type: string,
    sref: string,
}


export interface BomModuleTable {
    wtid: number,
    model_code: string,
    level: string,
    ruser: string,
    cuser: string,
    comfirmyn: string,
    status: string,
    radte: string
}
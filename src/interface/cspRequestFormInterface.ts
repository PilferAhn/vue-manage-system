import { Interaction } from "chart.js"






// solder application entity
export interface ApplicationData {
    default_modelName: string
    default_requireName: string
    default_requireDate: string
    default_requireAmount: string
    default_pkgRequirement: string
    default_productSize: string
    default_purpose: string

    system_erp_wafer: string
    system_erp_pkg: string
    system_erp_epoxy: string

    system_mes_wafer: string
    system_mes_pkg: string
    system_mes_epoxy: string

    wafer_chip_size: string
    wafer_thickness: string
    wafer_pad_type: string
    wafer_send_quantity: string
    wafer_mes_code: string
    wafer_mark: string
    wafer_lot_no: string
    wafer_chip_qty: string

    pkg_size: string
    pkg_erp_code: string
    pkg_meterial: string
    pkg_note: string

    epoxy_model: string
    epoxy_thickness: string

    bb_ballsize: string

    bg_thickness: string
    bg_afterthickness: string

    dc_meterial: string
    dc_blade_thickness: string
    dc_thickness: string

    mk_note: string
    bump_map: string

    pd_dicing_line_size: string
    pd_note: string

    el_link_method: string
    el_EVB_setup_port: string

    analysis_fa_item: string

    reliability_item: string
    others_cer_check: string
    fb_2_spl: string
    fb_direction: string
    fb_note: string
    fb_1_numbering: string
    mk_marking: string
    form_status: string
    box_id:string
    el_carrier_tape:string
    pak_direction:string
}

export interface CspImages {
    model_name: string
    cell_name: string
    file_index: string
    url: string
    file_name: string
    img_id: string
}

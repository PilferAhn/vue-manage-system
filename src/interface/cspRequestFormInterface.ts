





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

    mk_note: string

    pd_dicing_line_size : string
    pd_note : string

    el_link_method : string
    el_EVB_setup_port: string

    analysis_fa_item:string

    reliability_item:string

}

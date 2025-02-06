// 데이터 타입 정의
export interface PDTApplicationSample {
    [key: string]: any;
  }
  
  export interface PDTApplicationExcelInfo {
    application_uuid: string;
    file_name?: string;
    customer_company?: string;
    spec_temperature?: string;
    spec_power?: string;
    is_spec_edit?: string;
    product_name: string;
    condition: string;
    signal_type: string;
    band?: string;
    duplex_mode?: string;
    bandwidth?: string;
    designer: string;
    requester: string;
    purpose?: string;
    date_of_sample_convey?: string;
    wafer_type: string;
    package_type: string;
    test_type: string;
    target_position: string;
    temperature: string;
    detail?: string;
    data: PDTApplicationSample[];
    force?: boolean;
    sample_quantity?: string;
  }
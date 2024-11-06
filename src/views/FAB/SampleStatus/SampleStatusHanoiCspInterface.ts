// SampleStatusHanoiCspInterface.ts

export interface BumpWaferPA {
    Plan?: string;
    Actual?: string;
    Plan2?: string;
    Actual2?: string;
    Comment?: string | null;
    DayReInput?: string | null;
    IsHold?: boolean;
    Diff?: number;
  }
  
  export interface ApplicationData {
    ModelInfo?: string | null;
    Nam?: string;
    Thang?: string;
    KhachHang?: string;
    Size_ThanhPham?: string;
    MODEL?: string;
    IsSoldering?: string;
    IsJigMatching?: string;
    BAND?: string;
    Tech?: string;
    Type?: string;
    LotID?: string;
    BoxNo?: string;
    WaferID?: string;
    GiaiDoanPhatTrien?: string;
    PL_PhuTrach?: string;
    Chip?: string;
    TenPKG?: string;
    LoaiPKG?: string;
    Chip_MOQ?: number;
    Qty_XuatHang_WF?: string;
    Qty_XuatHang_PKG?: string;
    Qty_SPL_Need?: string;
    MucDich?: string;
    NgayXuatHang?: string;
    NgayTaiNhapKhau?: string;
    NgayInputDuKien?: string;
    LyDoTriHoan?: string | null;
    XacNhan?: string | null;
    Complete?: boolean;
    CurrentOperation?: string;
    CurrentQty?: number;
    BumpWaferPA_PLAN?: string;
    WaferDicingInspection_PLAN?: string;
    AirBlower_PLAN?: string;
    Laminating_PLAN?: string;
    PackageDicing_PLAN?: string;
    Solder_PLAN?: string | null;
    JigMatching_PLAN?: string | null;
    EndLine_PLAN?: string;
    OQC_PLAN?: string;
    BumpWaferPA_Actual?: string;
    WaferDicingInspection_Actual?: string;
    AirBlower_Actual?: string;
    Laminating_Actual?: string;
    PackageDicing_Actual?: string | null;
    Solder_Actual?: string | null;
    JigMatching_Actual?: string | null;
    EndLine_Actual?: string | null;
    OQC_Actual?: string | null;
    Output_DuKien_Plan?: string;
    Output_DuKien_Actual?: string;
    LeadTimePlan?: number;
    LeadTimeActual?: number;
    TienDo?: string;
    Rank?: string | null;
    DateCreated?: string;
    DateModified?: string;
    UserCreated?: string | null;
    UserModified?: string;
    PKG_ID?: string;
    ASSY_ID?: string;
    REEL_ID?: string;
    BumpWaferPA?: BumpWaferPA;
  }
  
  export interface ApplicationDataResponse {
    data?: ApplicationData[];
  }
  
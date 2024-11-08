export interface MaterialInfo {
    material_id: string;
    site_id: string;
    name: string;
    category: string;
    package_type: string;
    process_type: string;
    band: string;
    creator_id: string;
    modifier_id: string | null;
    delete_flag: string;
    creation_date: string;
    modify_date: string | null;
    cassettes_member: CassetteMember[]; // 카세트 멤버 배열
  }
  
  export interface CassetteMember {
    lot_id: string;
    history_seq: number;
    lot_type: string;
    material_id: string;
    judge_flag: string;
    lot_status: string;
    tx_user_id: string;
    tx_user_name: string;
    tx_comment: string;
    cassette_id: string;
    delete_flag: string;
    original_date: string;
    creation_date: string;
    original_due_date: string;
    schedule_due_date: string;
    site_in_date: string;
    movein_date: string;
    moveout_date: string | null;
    start_date: string | null;
    operation: Operation;
    history: any[]; // history 내용이 정의되지 않아서 any[]로 설정
    prev_history: PrevHistory | null;
    hanoi_csp: any | null;
    child: any | null;
  }
  
  export interface Operation {
    site_id: string;
    operation_id: string;
    name: string;
  }
  
  export interface PrevHistory {
    lot_id: string;
    history_seq: number;
    site_id: string;
    operation_id: string;
    delete_flag: string;
    start_date: string;
    end_date: string | null;
    operation: Operation;
  }
  
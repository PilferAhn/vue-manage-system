interface Operation {
  site_id: string;
  operation_id: string;
  name: string;
}

interface HanoiCSP {
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
  original_date: string | null;
  creation_date: string;
  original_due_date: string | null;
  schedule_due_date: string | null;
  site_in_date: string | null;
  movein_date: string | null;
  moveout_date: string | null;
  start_date: string | null;
  operation: Operation;
  history: any[]; // Assuming it's an array, but specify a type if available
  prev_history: HanoiCSP | null;
  first_history: HanoiCSP | null;
  hanoi_csp: HanoiCSP | null;
  child: HanoiCSP | null;
}

export interface LotData {
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
  movein_date: string | null;
  moveout_date: string | null;
  start_date: string | null;
  operation: any;
  history: any[] | null; // Assuming it's an array, but specify a type if available
  prev_history: HanoiCSP | null;
  first_history: HanoiCSP | null;
  hanoi_csp: HanoiCSP | null;
  child: HanoiCSP | null;
}

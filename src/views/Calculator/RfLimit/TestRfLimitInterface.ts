export interface Spec {
  spec_start: number;
  spec_stop: number;
  marker_left: number;
  marker_right: number;
  spec_il: number;
  typ: string;
  peek_type: string;
  line_color: string;
  output: number;
  input: number;
}

export interface Spec2 {
  spec_start?: string;
  spec_stop?: string;
  marker_start?: string;
  marker_stop?: string;
  spec_il?: string;
  type?: string;
  line_color?: string;
  output?: string;
  input?: string;
  isMax? : boolean;
}

// Interface for SPara properties
export interface SPara {
  dbm: number[];
  file_path: string;
  freq: number[];
  il_input: number;
  il_output: number;
  line_color: string;
  max_dbm_index: number;
  max_dbm_val: number;
  max_freq_val: number;
  name: string;
  scattering_para: number[][][]; // 3D array for scattering parameters
}

// Interface for test data items with target_spec and reference_spec arrays
export interface TestDataItem {
  name: string;
  target_spec: Spec[];
  reference_spec: Spec[];
  spara: SPara;
  jig: SPara;
  solder: SPara;
  is_max: boolean;
}

export interface SParameterFile {
  fileName?: string;
  fileType?: string;
  port?: string;
}

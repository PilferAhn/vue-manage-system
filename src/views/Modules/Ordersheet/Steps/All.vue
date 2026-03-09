<template v-if="isLoading">

    <el-row :gutter="20">
        <el-col :span="22">
            <!-- <div style="
      background-color: black;
      color: #00FF00;
      font-family: 'Courier New', monospace;
      border: 4px solid white;
      border-radius: 65px;
      padding: 6px 10px;
      font-size: 14px;
      line-height: 1.4;
      white-space: pre-wrap;
    ">
                    message:
                    <span v-if="message">
                        {{ message }}
                    </span>
                </div> -->
        </el-col>
        <el-col :span="2">
            <div style="
      background-color: white;
      color: black;
      /* font-family: 'Courier New', monospace; */
      border: 4px solid white;
      border-radius: 65px;
      padding: 6px 10px;
      font-size: 14px;
      font-weight: 800;
      line-height: 1.4;
      cursor: pointer;
      white-space: pre-wrap;
    " @click="saveChildren">
                SAVE

            </div>
        </el-col>
    </el-row>

    <el-card>
        <table class="custom-top-table">
            <!-- HEADER TABLE -->
            <colgroup>
                <col style="width :8.74%;" />
                <col style="width :3.44%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.72%;" />
                <col style="width :3.16%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.62%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.16%;" />
                <col style="width :2.7%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
            </colgroup>
            <tbody>
                <!-- # 1 Row -->
                <tr>
                    <td class="hcell">
                        Model
                    </td>
                    <td colspan="9">
                        <!-- D5Z0 -->
                        {{ formData.model_name }}
                    </td>
                    <td rowspan="2" colspan="15" class="ccell">
                        Ass'y Purpose
                    </td>
                    <td rowspan="2" colspan="13" class="ccell">
                        Request
                    </td>
                </tr>
                <!-- # 2 Row -->
                <tr>
                    <td class="hcell">
                        (Full Name)
                    </td>
                    <td colspan="9">
                        <!-- SFMD5Z0K401 -->
                        {{ formData.full_model_name }}
                    </td>
                </tr>
                <!-- # 3 Row -->
                <tr>
                    <td class="hcell">
                        Metal Mask
                    </td>
                    <td colspan="9" style="padding: 0px;">
                        <CustomSelect v-model="formDataTemp.metal_mask" :options="pcbcodes" />
                    </td>
                    <td colspan="4" class="ccell">
                        구분
                    </td>
                    <td colspan="11" style="padding:0;">
                        <el-checkbox :label="'SPL'" :true-label="'SPL'" :false-label="''"
                            v-model="formDataTemp.assy_purpose_type" size="small"
                            style="margin-right: 4px; font-size:6px">
                            SPL
                        </el-checkbox>
                        <el-checkbox :label="'DVR'" :true-label="'DVR'" :false-label="''"
                            v-model="formDataTemp.assy_purpose_type" size="small"
                            style="margin-right: 4px; font-size:6px">
                            DVR
                        </el-checkbox>
                        <el-checkbox :label="'PVR'" :true-label="'PVR'" :false-label="''"
                            v-model="formDataTemp.assy_purpose_type" size="small"
                            style="margin-right: 4px; font-size:6px">
                            PVR
                        </el-checkbox>
                        <el-checkbox :label="'PRA'" :true-label="'PRA'" :false-label="''"
                            v-model="formDataTemp.assy_purpose_type" size="small"
                            style="margin-right: 4px; font-size:6px">
                            PRA
                        </el-checkbox>
                    </td>
                    <td colspan="4" class="ccell">
                        Requestor
                    </td>
                    <td colspan="9">
                        {{ formData.request_requestor }}
                    </td>
                </tr>
                <!-- # 4 Row -->
                <tr>
                    <td class="hcell">
                        PCB
                    </td>
                    <td colspan="9" style="padding: 0px;">
                        {{ formData.pcb_code }}
                    </td>
                    <td colspan="4" class="ccell">
                        차수
                    </td>
                    <td colspan="11" contenteditable="true"
                        @input="e => formDataTemp.assy_purpose_level = (e.target as HTMLElement).innerText">
                        {{ formData.assy_purpose_level }}
                    </td>
                    <td colspan="4" class="ccell">
                        Receiver
                    </td>
                    <td colspan="9" contenteditable="true"
                        @input="e => formDataTemp.request_receiver = (e.target as HTMLElement).innerText">
                        {{ formData.request_receiver }}
                    </td>
                </tr>
                <!-- # 5 Row -->
                <tr>
                    <td class="hcell">
                        Quantity
                    </td>
                    <td colspan="9" contenteditable="true"
                        @input="e => formDataTemp.quantity = (e.target as HTMLElement).innerText">
                        {{ formData.quantity }}
                    </td>
                    <td colspan="4" class="ccell">
                        제출여부
                    </td>
                    <td colspan="11" contenteditable="true"
                        @input="e => formDataTemp.assy_purpose_submit_yn = (e.target as HTMLElement).innerText">
                        {{ formData.assy_purpose_submit_yn }}
                    </td>
                    <td colspan="4" class="ccell">
                        Request Date
                    </td>
                    <td colspan="9" contenteditable="true"
                        @input="e => formDataTemp.request_request_date = (e.target as HTMLElement).innerText">
                        {{ formData.request_request_date }}
                    </td>
                </tr>
                <!-- # 6 Row -->
                <tr>
                    <td class="hcell">
                        PCB 수량
                    </td>
                    <td colspan="9" contenteditable="true"
                        @input="e => formDataTemp.pcb_amount = (e.target as HTMLElement).innerText">
                        {{ formData.pcb_amount }}
                    </td>
                    <td colspan="4" class="ccell">
                        Shipment
                    </td>

                    <td colspan="11" style="padding: 0; vertical-align: middle;">
                        <div
                            style="display: flex; justify-content: center; align-items: center; height: 100%; font-size: 6px;">

                            <el-checkbox :label="'K1'" :true-label="'K1'" :false-label="''"
                                v-model="formDataTemp.assy_purpose_shipment" size="small"
                                style="margin-right: 4px; font-size:6px">
                                K1
                            </el-checkbox>
                            <el-checkbox :label="'K2'" :true-label="'K2'" :false-label="''"
                                v-model="formDataTemp.assy_purpose_shipment" size="small"
                                style="margin-right: 4px; font-size:6px">
                                K2
                            </el-checkbox>
                            <el-checkbox :label="'K3'" :true-label="'K3'" :false-label="''"
                                v-model="formDataTemp.assy_purpose_shipment" size="small"
                                style="margin-right: 4px; font-size:6px">
                                K3
                            </el-checkbox>
                            <el-checkbox :label="'기타1'" :true-label="'기타'" :false-label="''"
                                v-model="formDataTemp.assy_purpose_shipment" size="small"
                                style="margin-right: 4px; font-size:6px">
                                <div style="display: flex;">
                                    <div>
                                        기타
                                    </div>

                                </div>

                            </el-checkbox>
                            <span
                                v-if="formData.assy_purpose_shipment === '기타' || formDataTemp.assy_purpose_shipment === '기타'"
                                style="display: inline-flex; align-items: center; font-size: 12px;">
                                (
                                <div contenteditable="true"
                                    @input="e => formDataTemp.assy_purpose_shipment_etc = (e.target as HTMLElement).innerText"
                                    style="width: 50px; height: 14px; border: 1px solid #ccc; padding: 1px 2px; margin: 0 2px;
               display: inline-block; vertical-align: middle; font-size: 12px; line-height: 14px;">
                                    {{ formData.assy_purpose_shipment_etc }}
                                </div>
                                )
                            </span>
                        </div>
                    </td>

                    <td colspan="4" class="ccell">
                        End Date
                    </td>
                    <td colspan="9" contenteditable="true"
                        @input="e => formDataTemp.request_date_end = (e.target as HTMLElement).innerText">
                        {{ formData.request_date_end }}
                    </td>
                </tr>
                <tr>
                    <td class="hcell">
                        MSL등급
                    </td>
                    <td colspan="37" style="padding: 0px;">
                        <el-checkbox :label="'2a'" :true-label="'2a'" :false-label="''" v-model="formDataTemp.msl_level"
                            size="small" style="margin-right: 4px; font-size:6px">
                            2a
                        </el-checkbox>
                        <el-checkbox :label="'3'" :true-label="'3'" :false-label="''" v-model="formDataTemp.msl_level"
                            size="small" style="margin-right: 4px; font-size:6px">
                            3
                        </el-checkbox>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="custom-top-table" style="margin-top: 10px;">
            <!-- HEADER TABLE -->
            <colgroup>
                <col style="width :8.74%;" />
                <col style="width :3.44%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.72%;" />
                <col style="width :3.16%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.62%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.16%;" />
                <col style="width :2.7%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
            </colgroup>
            <tbody>
                <!-- # 7 Row -->
                <tr>
                    <td class="hcell">
                        Module Type
                    </td>
                    <td colspan="9" style="padding: 0px">
                        <el-checkbox :label="'GLM'" :true-label="'GLM'" :false-label="''"
                            v-model="formDataTemp.module_type" size="small" style="margin-right: 4px; font-size:6px">
                            GLM
                        </el-checkbox>
                        <el-checkbox :label="'LFEM'" :true-label="'LFEM'" :false-label="''"
                            v-model="formDataTemp.module_type" size="small" style="margin-right: 4px; font-size:6px">
                            LFEM
                        </el-checkbox>
                        <el-checkbox :label="'RFEM'" :true-label="'RFEM'" :false-label="''"
                            v-model="formDataTemp.module_type" size="small" style="margin-right: 4px; font-size:6px">
                            RFEM
                        </el-checkbox>
                        <el-checkbox :label="'FEMiD'" :true-label="'FEMiD'" :false-label="''"
                            v-model="formDataTemp.module_type" size="small" style="margin-right: 4px; font-size:6px">
                            FEMiD
                        </el-checkbox>
                    </td>
                    <td rowspan="2" colspan="4" class="ccell">
                        이력확인
                    </td>
                    <td colspan="4" class="ccell">
                        조립이력
                    </td>
                    <td colspan="4" class="ccell">
                        변경점
                    </td>
                    <td colspan="16" class="ccell">
                        비고 (변경 확인 사항)
                    </td>
                </tr>
                <!-- # 8 Row -->
                <tr>
                    <td class="hcell">
                        SAW Type
                    </td>
                    <td colspan="9" style="padding: 0px">
                        <!-- <el-checkbox :label="'SCSP'" :true-label="'SCSP'" :false-label="''" v-model="formData.saw_type"
                        size="small" style="margin-right: 4px; font-size:6px">
                        SCSP
                    </el-checkbox> -->
                        <el-checkbox :label="'CSP'" :true-label="'CSP'" :false-label="''"
                            v-model="formDataTemp.saw_type" size="small" style="margin-right: 4px; font-size:6px">
                            (S)CSP
                        </el-checkbox>
                        <el-checkbox :label="'WLP'" :true-label="'WLP'" :false-label="''"
                            v-model="formDataTemp.saw_type" size="small" style="margin-right: 4px; font-size:6px">
                            WLP
                        </el-checkbox>
                        <el-checkbox :label="'BDMP'" :true-label="'BDMP'" :false-label="''"
                            v-model="formDataTemp.saw_type" size="small" style="margin-right: 4px; font-size:6px">
                            BDMP
                        </el-checkbox>
                    </td>
                    <td colspan="4" style="padding: 0px">
                        <el-checkbox :label="'유'" :true-label="'유'" :false-label="''"
                            v-model="formDataTemp.assembly_history" size="small"
                            style="margin-right: 4px; font-size:6px">
                            유
                        </el-checkbox>
                        <el-checkbox :label="'무'" :true-label="'무'" :false-label="''"
                            v-model="formDataTemp.assembly_history" size="small"
                            style="margin-right: 4px; font-size:6px">
                            무
                        </el-checkbox>
                    </td>
                    <td colspan="4" style="padding: 0px">
                        <el-checkbox :label="'유'" :true-label="'유'" :false-label="''" v-model="formDataTemp.changed_yn"
                            size="small" style="margin-right: 4px; font-size:6px">
                            유
                        </el-checkbox>
                        <el-checkbox :label="'무'" :true-label="'무'" :false-label="''" v-model="formDataTemp.changed_yn"
                            size="small" style="margin-right: 4px; font-size:6px">
                            무
                        </el-checkbox>
                    </td>
                    <td colspan="16" style="padding: 0px">
                        <el-checkbox :label="'PCB'" :true-label="'PCB'" :false-label="''"
                            v-model="formDataTemp.history_remark" size="small" style="margin-right: 4px; font-size:6px">
                            PCB
                        </el-checkbox>
                        <el-checkbox :label="'MASK'" :true-label="'MASK'" :false-label="''"
                            v-model="formDataTemp.history_remark" size="small" style="margin-right: 4px; font-size:6px">
                            MASK
                        </el-checkbox>
                        <el-checkbox :label="'자재'" :true-label="'자재'" :false-label="''"
                            v-model="formDataTemp.history_remark" size="small" style="margin-right: 4px; font-size:6px">
                            자재
                        </el-checkbox>
                        <el-checkbox :label="'SMT정보'" :true-label="'SMT정보'" :false-label="''"
                            v-model="formDataTemp.history_remark" size="small" style="margin-right: 4px; font-size:6px">
                            SMT정보
                        </el-checkbox>
                        <el-checkbox :label="'무'" :true-label="'무'" :false-label="''"
                            v-model="formDataTemp.history_remark" size="small" style="margin-right: 4px; font-size:6px">
                            기타
                        </el-checkbox>
                    </td>
                </tr>

            </tbody>
        </table>

        <table class="custom-top-table" style="margin-top: 10px;">
            <!-- note TABLE -->
            <colgroup>
                <col style="width :8.74%;" />
                <col style="width :3.44%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.72%;" />
                <col style="width :3.16%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.62%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.16%;" />
                <col style="width :2.7%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
            </colgroup>
            <tbody>
                <!-- # 9 Row -->
                <tr>
                    <td class="ccell" rowspan="5">
                        확인&요청 <br />
                        사항
                    </td>
                    <td colspan="24" rowspan="5"
                        style="white-space: pre-line;text-align: left; vertical-align: top; padding: 4px; line-height: 1.6;"
                        contenteditable="true"
                        @input="e => formDataTemp.requirement_remark = (e.target as HTMLElement).innerText">
                        {{ formData.requirement_remark }}
                    </td>
                    <td colspan="4" class="ccell">
                        조립구분
                    </td>
                    <td colspan="9" style="padding:0px">
                        <el-checkbox :label="'Mold'" :true-label="'Mold'" :false-label="''"
                            v-model="formDataTemp.assembly_type" size="small" style="margin-right: 4px; font-size:6px">
                            Mold
                        </el-checkbox>
                        <el-checkbox :label="'No-Mold'" :true-label="'No-Mold'" :false-label="''"
                            v-model="formDataTemp.assembly_type" size="small" style="margin-right: 4px; font-size:6px">
                            No-Mold
                        </el-checkbox>
                    </td>
                </tr>
                <!-- # 10 Row -->
                <tr>
                    <td colspan="4" class="ccell">
                        열충격
                    </td>
                    <td colspan="9" style="padding:0px">
                        <el-checkbox :label="'진행'" :true-label="'진행'" :false-label="''" v-model="formDataTemp.heat"
                            size="small" style="margin-right: 4px; font-size:10px">
                            진행
                        </el-checkbox>
                        <el-checkbox :label="'미진행'" :true-label="'미진행'" :false-label="''" v-model="formDataTemp.heat"
                            size="small" style="margin-right: 4px; font-size:10px">
                            미진행
                        </el-checkbox>
                    </td>
                </tr>
                <!-- # 11 Row -->
                <tr>
                    <td colspan="4" class="ccell">
                        F/T
                    </td>
                    <td colspan="9" style="padding:0px">
                        <el-checkbox :label="'진행'" :true-label="'진행'" :false-label="''" v-model="formDataTemp.ft"
                            size="small" style="margin-right: 4px; font-size:10px">
                            진행
                        </el-checkbox>
                        <el-checkbox :label="'미진행'" :true-label="'미진행'" :false-label="''" v-model="formDataTemp.ft"
                            size="small" style="margin-right: 4px; font-size:10px">
                            미진행
                        </el-checkbox>
                    </td>

                </tr>
                <!-- # 12 Row -->
                <tr>
                    <td colspan="4" class="ccell">
                        F/A
                    </td>
                    <td colspan="9" style="padding:0px">
                        <el-checkbox :label="'진행'" :true-label="'진행'" :false-label="''" v-model="formDataTemp.fa"
                            size="small" style="margin-right: 4px; font-size:10px">
                            진행
                        </el-checkbox>
                        <el-checkbox :label="'미진행'" :true-label="'미진행'" :false-label="''" v-model="formDataTemp.fa"
                            size="small" style="margin-right: 4px; font-size:10px">
                            미진행
                        </el-checkbox>
                    </td>

                </tr>
                <!-- # 13 Row -->
                <tr>
                    <td colspan="4" class="ccell">
                        Taping
                    </td>
                    <td colspan="9" style="padding:0px">
                        <el-checkbox :label="'진행'" :true-label="'진행'" :false-label="''" v-model="formDataTemp.taping"
                            size="small" style="margin-right: 4px; font-size:10px">
                            진행
                        </el-checkbox>
                        <el-checkbox :label="'미진행'" :true-label="'미진행'" :false-label="''" v-model="formDataTemp.taping"
                            size="small" style="margin-right: 4px; font-size:10px">
                            미진행
                        </el-checkbox>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="custom-top-table" style="margin-top: 10px;">
            <!-- SMT TABLE -->
            <colgroup>
                <col style="width :8.74%;" />
                <col style="width :3.44%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.72%;" />
                <col style="width :3.16%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.62%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.16%;" />
                <col style="width :2.7%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
            </colgroup>
            <tbody>
                <!-- # 9 Row -->
                <tr>
                    <td class="ccell" :rowspan="4 + prow">
                        PCB <br />
                        Information
                    </td>
                    <td colspan="4" rowspan="2" class="bcell">
                        Array
                    </td>
                    <td colspan="4" class="bcell">
                        X
                    </td>
                    <td colspan="4" class="bcell">
                        Y
                    </td>
                    <td colspan="4" class="bcell">
                        Quantity
                    </td>
                    <td colspan="4" :rowspan="4 + prow" class="bcell" @click="changeProw('u', 0)">
                        Position
                        <br />
                        row +
                    </td>
                    <td colspan="9" class="bcell">
                        Point
                    </td>
                    <td colspan="4" class="bcell">
                        X_TOP
                    </td>
                    <td colspan="4" class="bcell">
                        Y_TOP
                    </td>
                </tr>
                <!-- # 10 Row -->
                <tr>


                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.array_x = (e.target as HTMLElement).innerText">
                        {{ formData.array_x }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.array_y = (e.target as HTMLElement).innerText">
                        {{ formData.array_y }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.array_quantinty = (e.target as HTMLElement).innerText">
                        {{ formData.array_quantinty }}
                    </td>
                    <!-- <td colspan="9">
                    asd
                </td>
                <td colspan="4">
                    asd
                </td>
                <td colspan="4">
                    asd
                </td> -->

                    <td colspan="9" contenteditable="true"
                        @input="e => formDataTemp.position_list[0].point = (e.target as HTMLElement).innerText">
                        {{ formData.position_list[0].point }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.position_list[0].xtop = (e.target as HTMLElement).innerText">
                        {{ formData.position_list[0].xtop }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.position_list[0].ytop = (e.target as HTMLElement).innerText">
                        {{ formData.position_list[0].ytop }}
                    </td>
                </tr>
                <!-- # 9 Row -->
                <tr>

                    <td colspan="4" rowspan="2" class="bcell">
                        Cell Size
                    </td>
                    <td colspan="4" class="bcell">
                        L
                    </td>
                    <td colspan="4" class="bcell">
                        W
                    </td>
                    <td colspan="4" class="bcell">
                        T
                    </td>

                    <td colspan="9" contenteditable="true"
                        @input="e => formDataTemp.position_list[1].point = (e.target as HTMLElement).innerText">
                        {{ formData.position_list[1].point }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.position_list[1].xtop = (e.target as HTMLElement).innerText">
                        {{ formData.position_list[1].xtop }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.position_list[1].ytop = (e.target as HTMLElement).innerText">
                        {{ formData.position_list[1].ytop }}
                    </td>
                </tr>
                <tr>

                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.cellsize_l = (e.target as HTMLElement).innerText"
                        @keydown.enter.prevent="handleEnterCellsize('l')">
                        {{ formData.cellsize_l }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.cellsize_w = (e.target as HTMLElement).innerText"
                        @keydown.enter.prevent="handleEnterCellsize('w')">
                        {{ formData.cellsize_w }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.cellsize_t = (e.target as HTMLElement).innerText"
                        @keydown.enter.prevent="handleEnterCellsize('t')">
                        {{ formData.cellsize_t }}
                    </td>

                    <td colspan="9" contenteditable="true"
                        @input="e => formDataTemp.position_list[2].point = (e.target as HTMLElement).innerText">
                        {{ formData.position_list[2].point }}
                        Module Start Point
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.position_list[2].xtop = (e.target as HTMLElement).innerText">
                        {{ formData.position_list[2].xtop }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.position_list[2].ytop = (e.target as HTMLElement).innerText">
                        {{ formData.position_list[2].ytop }}
                    </td>
                </tr>
                <tr v-for="(index) in prow" :key="index">
                    <td colspan="16" @click="changeProw('d', index)"
                        style="background-color: #f2f2f2; cursor: pointer;border: 0px;">
                        row -
                    </td>
                    <td colspan="9" contenteditable="true"
                        @input="e => formDataTemp.position_list[index + 2].point = (e.target as HTMLElement).innerText">
                        {{ formData.position_list[index + 2].point }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formData.position_list[index + 2].xtop = (e.target as HTMLElement).innerText">
                        {{ formData.position_list[index + 2].xtop }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formData.position_list[index + 2].ytop = (e.target as HTMLElement).innerText">
                        {{ formData.position_list[index + 2].ytop }}
                    </td>
                </tr>


                <tr>
                    <td class="ccell" :rowspan="srow" @click="changeSrows('u', 0)">
                        SMT <br />
                        Information<br />
                        row +
                    </td>
                    <td class="bcell">
                        No.
                    </td>
                    <td colspan="3" class="bcell">
                        Ref
                    </td>
                    <td colspan="5" class="bcell">
                        BOM
                    </td>
                    <td colspan="9" class="bcell">
                        P/N
                    </td>
                    <td colspan="5" class="bcell">
                        Value
                    </td>
                    <td colspan="5" class="bcell">
                        Size
                    </td>
                    <td colspan="3" class="bcell">
                        Maker
                    </td>
                    <td colspan="3" class="bcell">
                        X
                    </td>
                    <td colspan="3" class="bcell">
                        Y
                    </td>
                </tr>

                <tr v-for="(smt, index) in formData.smt_list" :key="index">
                    <!-- <td class="ccell" @click="changeSrow('d', index)"> row - </td> -->
                    <td contenteditable="true"
                        @input="e => formDataTemp.smt_list[index].sorder = (e.target as HTMLElement).innerText"> {{
                            smt.sorder }}. </td>
                    <td colspan="3" style="padding: 0px;">
                        <CustomSelect v-model="formDataTemp.smt_list[index].sref" :options="refs" />
                    </td>
                    <td colspan="5" v-if="smt.sref !== 'CarrierTape'" contenteditable="true"
                        @input="e => formDataTemp.smt_list[index].sbom = (e.target as HTMLElement).innerText">
                        {{ smt.sbom }}
                    </td>
                    <td colspan="5" v-else>
                        {{ getCarrierBomCode('default', index) }}
                    </td>
                    <td colspan="9"
                        v-if="smt.sref === 'CarrierTape' || formDataTemp.smt_list[index].sref === 'CarrierTape'"
                        style="padding:0px">
                        <CustomSelect v-model="formDataTemp.smt_list[index].spn" :options="carriertapes" />
                    </td>

                    <!-- <td colspan="9" v-else-if="smt.sref === 'PCB' || formDataTemp.smt_list[index].sref === 'PCB'"
                        style="padding:0px">
                        {{ pcbAdd(formDataTemp.pcb_code, index) }}
                    </td> -->
                    <td colspan="9" v-else contenteditable="true"
                        @input="e => formDataTemp.smt_list[index].spn = (e.target as HTMLElement).innerText"
                        @keydown.enter.prevent="handleEnterKey('default', index)">
                        {{ smt.spn }}
                    </td>

                    <td v-if="smt.sref !== 'IC' && formDataTemp.smt_list[index].sref !== 'IC'" colspan="5"
                        contenteditable="true"
                        @input="e => formDataTemp.smt_list[index].svalue = (e.target as HTMLElement).innerText">
                        {{ smt.svalue }}
                    </td>
                    <td colspan="5" v-else style="padding:0px">
                        <CustomSelect v-model="formDataTemp.smt_list[index].svalue" :options="ics" />
                    </td>
                    <td colspan="5" contenteditable="true"
                        @input="e => formDataTemp.smt_list[index].ssize = (e.target as HTMLElement).innerText">
                        {{ smt.ssize }} </td>
                    <td colspan="3" style="padding: 0px;" v-if="formDataTemp.smt_list[index].sref === 'IC'">
                        <CustomSelect v-model="formDataTemp.smt_list[index].smarker" :options="makers_ics" />
                    </td>
                    <td colspan="3" style="padding: 0px;" v-else-if="formDataTemp.smt_list[index].sref === 'PCB'">
                        <CustomSelect v-model="formDataTemp.smt_list[index].smarker" :options="makers_pcb" />
                    </td>
                    <td colspan="3" style="padding: 0px;"
                        v-else-if="formDataTemp.smt_list[index].sref === 'Inductor' || formDataTemp.smt_list[index].sref === 'Capacitor' || formDataTemp.smt_list[index].sref === 'Resistor'">
                        <CustomSelect v-model="formDataTemp.smt_list[index].smarker" :options="makers_smd" />
                    </td>
                    <td colspan="3" style="padding: 0px;" v-else-if="formDataTemp.smt_list[index].sref === 'SAW'">
                        <CustomSelect v-model="formDataTemp.smt_list[index].smarker" :options="makers_saw" />
                    </td>
                    <td colspan="3" style="padding: 0px;" v-else>
                        <CustomSelect v-model="formDataTemp.smt_list[index].smarker" :options="markers" />
                    </td>


                    <td colspan="3" contenteditable="true"
                        @input="e => formDataTemp.smt_list[index].sx = (e.target as HTMLElement).innerText"> {{
                            smt.sx }} </td>
                    <td colspan="3" contenteditable="true"
                        @input="e => formDataTemp.smt_list[index].sy = (e.target as HTMLElement).innerText"> {{
                            smt.sy }} </td>
                </tr>


                <tr v-for="(item, index) in tempSmt" :key="index">
                    <td class="ccell" @click="changeSrows('d', index)"> row - </td>
                    <td contenteditable="true"
                        @input="e => tempSmt[index].sorder = (e.target as HTMLElement).innerText"> {{
                            tempSmtView[index].sorder }} </td>
                    <td colspan="3" style="padding: 0px;">
                        <CustomSelect v-model="tempSmt[index].sref" :options="refs" />
                    </td>
                    <td colspan="5" v-if="item.sref !== 'CarrierTape'" contenteditable="true"
                        @input="e => tempSmt[index].sbom = (e.target as HTMLElement).innerText">
                        {{ tempSmtView[index].sbom }}
                    </td>
                    <td colspan="5" v-else>
                        {{ getCarrierBomCode('new', index) }}
                    </td>
                    <td colspan="9"
                        v-if="tempSmtView[index].sref === 'CarrierTape' || tempSmt[index].sref === 'CarrierTape'"
                        style="padding:0px">

                        <CustomSelect v-model="tempSmt[index].spn" :options="carriertapes" />
                    </td>

                    <!-- <td colspan="9" v-else-if="smt.sref === 'PCB' || tempSmt[index].sref === 'PCB'"
                        style="padding:0px">
                        {{ pcbAdd(formDataTemp.pcb_code, index) }}
                    </td> -->
                    <td colspan="9" v-else contenteditable="true"
                        @input="e => tempSmt[index].spn = (e.target as HTMLElement).innerText"
                        @keydown.enter.prevent="handleEnterKey('new', index)">
                        {{ tempSmtView[index].spn }}
                    </td>

                    <td v-if="tempSmtView[index].sref !== 'IC' && tempSmt[index].sref !== 'IC'" colspan="5"
                        contenteditable="true"
                        @input="e => tempSmt[index].svalue = (e.target as HTMLElement).innerText">
                        {{ tempSmtView[index].svalue }}
                    </td>
                    <td colspan="5" v-else style="padding:0px">
                        <CustomSelect v-model="tempSmt[index].svalue" :options="ics" />
                    </td>
                    <td colspan="5" contenteditable="true"
                        @input="e => tempSmt[index].ssize = (e.target as HTMLElement).innerText">
                        {{ tempSmtView[index].ssize }} </td>
                    <td colspan="3" style="padding: 0px;" v-if="tempSmtView[index].sref === 'IC'">
                        <CustomSelect v-model="tempSmt[index].smarker" :options="makers_ics" />
                    </td>
                    <td colspan="3" style="padding: 0px;" v-else-if="tempSmtView[index].sref === 'PCB'">
                        <CustomSelect v-model="tempSmt[index].smarker" :options="makers_pcb" />
                    </td>
                    <td colspan="3" style="padding: 0px;"
                        v-else-if="tempSmtView[index].sref === 'Inductor' || tempSmtView[index].sref === 'Capacitor' || tempSmtView[index].sref === 'Resistor'">
                        <CustomSelect v-model="tempSmt[index].smarker" :options="makers_smd" />
                    </td>
                    <td colspan="3" style="padding: 0px;" v-else-if="tempSmtView[index].sref === 'SAW'">
                        <CustomSelect v-model="tempSmt[index].smarker" :options="makers_saw" />
                    </td>
                    <td colspan="3" style="padding: 0px;" v-else>
                        <CustomSelect v-model="tempSmt[index].smarker" :options="markers" />
                    </td>


                    <td colspan="3" contenteditable="true"
                        @input="e => tempSmt[index].sx = (e.target as HTMLElement).innerText"> {{
                            tempSmtView[index].sx }} </td>
                    <td colspan="3" contenteditable="true"
                        @input="e => tempSmt[index].sy = (e.target as HTMLElement).innerText"> {{
                            tempSmtView[index].sy }} </td>
                </tr>

                <tr>
                    <td class="ccell">
                        SMT <br />
                        Diagram
                    </td>
                    <td colspan="20">
                        <div style="display: flex;">
                            <div class="drop-zone" @click="triggerFileSelect('fileInputSD')" @drop.prevent="onDropSD"
                                style="min-height: 300px;width: 100%; flex:2" @dragover.prevent>
                                <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                                <div v-for="(img, index) in existingSD" :key="'existing-' + index"
                                    style="position: relative; display: inline-block; margin: 10px;">
                                    <img :src="img.url" style="max-width:200px;" />

                                    <button @click.stop="removeExistingImageSD(index)"
                                        style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                                        ❌
                                    </button>
                                </div>
                                <div v-for="(file, index) in imagesetSD" :key="index"
                                    style="position: relative; display: inline-block; margin: 10px;">
                                    <img :src="getObjectURL(file)" alt="업로드된 이미지"
                                        style="max-width: 200px; max-height: 300px;" />
                                    <button @click.stop="removeImageSD(index)"
                                        style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                                        ❌
                                    </button>
                                </div>
                                <input ref="fileInputSD" type="file" accept="image/*" style="display:none"
                                    @change="handleFilesChangeSD" multiple />
                            </div>
                            <div style="width: 100%; border:1px solid black; flex:1" contenteditable="true"
                                @paste.prevent="handlePaste('SD', $event)">
                                <!-- {{ formData.el_EVB_setup_port }} -->
                            </div>
                        </div>

                    </td>
                    <td colspan="3" class="ccell">
                        Marking <br />
                        Information
                    </td>
                    <td colspan="16">

                        <div style="display: flex;">
                            <div class="drop-zone" @click="triggerFileSelect('fileInputMI')" @drop.prevent="onDropMI"
                                style="min-height: 300px; flex:2" @dragover.prevent>
                                <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                                <div v-for="(img, index) in existingMI" :key="'existing-' + index"
                                    style="position: relative; display: inline-block; margin: 10px;">
                                    <img :src="img.url" style="max-width:200px;" />

                                    <button @click.stop="removeExistingImageMI(index)"
                                        style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                                        ❌
                                    </button>
                                </div>
                                <div v-for="(file, index) in imagesetMI" :key="index"
                                    style="position: relative; display: inline-block; margin: 10px;">
                                    <img :src="getObjectURL(file)" alt="업로드된 이미지"
                                        style="max-width: 200px; max-height: 300px;" />
                                    <button @click.stop="removeImageMI(index)"
                                        style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                                        ❌
                                    </button>
                                </div>
                                <input ref="fileInputMI" type="file" accept="image/*"
                                    style="display:none; min-height: 300px;" @change="handleFilesChangeMI" multiple />
                            </div>
                            <div style="width: 100%; border:1px solid black; flex:1" contenteditable="true"
                                @paste.prevent="handlePaste('MI', $event)">
                                <!-- {{ formData.el_EVB_setup_port }} -->
                            </div>
                        </div>

                    </td>
                </tr>
            </tbody>
        </table>

        <table class="custom-top-table" style="margin-top: 10px;">
            <!-- Ass'y process TABLE -->
            <colgroup>
                <col style="width :8.74%;" />
                <col style="width :3.44%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.72%;" />
                <col style="width :3.16%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.62%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :3.16%;" />
                <col style="width :2.7%;" />
                <col style="width :2.7%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
                <col style="width :2.23%;" />
            </colgroup>
            <tbody>
                <!-- # 9 Row -->
                <tr>
                    <td colspan="6" class="bcell">
                        Main Process
                    </td>
                    <td colspan="12" class="bcell">
                        Check Item
                    </td>
                    <td colspan="12" class="bcell">
                        Description
                    </td>
                    <td colspan="8" class="bcell">
                        Remark
                    </td>
                </tr>
                <tr>
                    <td class="ccell" rowspan="2">
                        SMT
                    </td>
                    <td colspan="5" rowspan="2">
                        <!-- {{ formData.ap_smt_flag }} -->
                        <el-checkbox :label="'O'" :true-label="'O'" :false-label="''" v-model="formDataTemp.ap_smt_flag"
                            size="small" style="margin-right: 4px; font-size:6px">
                            O
                        </el-checkbox>
                        <el-checkbox :label="'X'" :true-label="'X'" :false-label="''" v-model="formDataTemp.ap_smt_flag"
                            size="small" style="margin-right: 4px; font-size:6px">
                            X
                        </el-checkbox>
                    </td>
                    <td colspan="12" rowspan="2" contenteditable="true"
                        @input="e => formDataTemp.ap_smt_item = (e.target as HTMLElement).innerText">
                        {{ formData.ap_smt_item }}
                    </td>
                    <td colspan="6" class="bcell">
                        Flux Type
                    </td>
                    <td colspan="6" class="bcell">
                        Solder Type
                    </td>
                    <td colspan="8" rowspan="2" contenteditable="true"
                        @input="e => formDataTemp.ap_smt_remark = (e.target as HTMLElement).innerText">
                        {{ formData.ap_smt_remark }}
                    </td>
                </tr>
                <tr>
                    <td colspan="6" contenteditable="true"
                        @input="e => formDataTemp.ap_smt_flux = (e.target as HTMLElement).innerText">
                        {{ formData.ap_smt_flux }}
                    </td>
                    <td colspan="6" contenteditable="true"
                        @input="e => formDataTemp.ap_smt_solder = (e.target as HTMLElement).innerText">
                        {{ formData.ap_smt_solder }}
                    </td>
                </tr>
                <tr>
                    <td class="ccell">
                        Molding
                    </td>
                    <td colspan="5">
                        <el-checkbox :label="'O'" :true-label="'O'" :false-label="''"
                            v-model="formDataTemp.ap_molding_flag" size="small"
                            style="margin-right: 4px; font-size:6px">
                            O
                        </el-checkbox>
                        <el-checkbox :label="'X'" :true-label="'X'" :false-label="''"
                            v-model="formDataTemp.ap_molding_flag" size="small"
                            style="margin-right: 4px; font-size:6px">
                            X
                        </el-checkbox>
                    </td>
                    <td colspan="12" contenteditable="true"
                        @input="e => formDataTemp.ap_molding_item = (e.target as HTMLElement).innerText">
                        {{ formData.ap_molding_item }}
                    </td>
                    <td colspan="12" style="padding: 0px;">
                        <CustomSelect v-model="formDataTemp.ap_molding_description" :options="epoxys" />
                    </td>
                    <td colspan="8" contenteditable="true"
                        @input="e => formDataTemp.ap_molding_remark = (e.target as HTMLElement).innerText">
                        {{ formData.ap_molding_remark }}
                    </td>
                </tr>
                <tr>
                    <td class="ccell">
                        Grinding
                    </td>
                    <td colspan="5">
                        <el-checkbox :label="'O'" :true-label="'O'" :false-label="''"
                            v-model="formDataTemp.ap_grinding_flag" size="small"
                            style="margin-right: 4px; font-size:6px">
                            O
                        </el-checkbox>
                        <el-checkbox :label="'X'" :true-label="'X'" :false-label="''"
                            v-model="formDataTemp.ap_grinding_flag" size="small"
                            style="margin-right: 4px; font-size:6px">
                            X
                        </el-checkbox>
                    </td>
                    <td colspan="12" contenteditable="true"
                        @input="e => formDataTemp.ap_grinding_item = (e.target as HTMLElement).innerText">
                        {{ formData.ap_grinding_item }}
                    </td>
                    <td colspan="12" contenteditable="true"
                        @input="e => formDataTemp.ap_grinding_description = (e.target as HTMLElement).innerText">
                        {{ formData.ap_grinding_description }}
                    </td>
                    <td colspan="8" contenteditable="true"
                        @input="e => formDataTemp.ap_grinding_remark = (e.target as HTMLElement).innerText">
                        {{ formData.ap_grinding_remark }}
                    </td>
                </tr>
                <tr>
                    <td class="ccell">
                        Marking
                    </td>
                    <td colspan="5">
                        <el-checkbox :label="'O'" :true-label="'O'" :false-label="''"
                            v-model="formDataTemp.ap_marking_flag" size="small"
                            style="margin-right: 4px; font-size:6px">
                            O
                        </el-checkbox>
                        <el-checkbox :label="'X'" :true-label="'X'" :false-label="''"
                            v-model="formDataTemp.ap_marking_flag" size="small"
                            style="margin-right: 4px; font-size:6px">
                            X
                        </el-checkbox>
                    </td>
                    <td colspan="12" contenteditable="true"
                        @input="e => formDataTemp.ap_marking_item = (e.target as HTMLElement).innerText">
                        {{ formData.ap_marking_item }}
                    </td>
                    <td colspan="12">
                        <div style="display: flex;">
                            <div class="drop-zone" @click="triggerFileSelect('fileInputMD')" @drop.prevent="onDropMD"
                                style="min-height: 75px; flex:2" @dragover.prevent>
                                <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                                <div v-for="(img, index) in existingMD" :key="'existing-' + index"
                                    style="position: relative; display: inline-block; margin: 10px;">
                                    <img :src="img.url" style="max-width:200px;" />

                                    <button @click.stop="removeExistingImageMD(index)"
                                        style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                                        ❌
                                    </button>
                                </div>
                                <div v-for="(file, index) in imagesetMD" :key="index"
                                    style="position: relative; display: inline-block; margin: 10px;">
                                    <img :src="getObjectURL(file)" alt="업로드된 이미지"
                                        style="max-width: 200px; max-height:  75px;" />
                                    <button @click.stop="removeImageMD(index)"
                                        style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                                        ❌
                                    </button>
                                </div>
                                <input ref="fileInputMD" type="file" accept="image/*"
                                    style="display:none; min-height:  75px;" @change="handleFilesChangeMD" multiple />
                            </div>
                            <div style="width: 100%; border:1px solid black; flex:1" contenteditable="true"
                                @paste.prevent="handlePaste('MD', $event)">
                                <!-- {{ formData.el_EVB_setup_port }} -->
                            </div>
                        </div>



                    </td>
                    <td colspan="8" contenteditable="true"
                        @input="e => formDataTemp.ap_marking_remark = (e.target as HTMLElement).innerText">
                        {{ formData.ap_marking_remark }}
                    </td>
                </tr>
                <tr>
                    <td class="ccell" rowspan="2">
                        Dicing
                    </td>
                    <td colspan="5" rowspan="2">
                        <el-checkbox :label="'O'" :true-label="'O'" :false-label="''"
                            v-model="formDataTemp.ap_dicing_flag" size="small" style="margin-right: 4px; font-size:6px">
                            O
                        </el-checkbox>
                        <el-checkbox :label="'X'" :true-label="'X'" :false-label="''"
                            v-model="formDataTemp.ap_dicing_flag" size="small" style="margin-right: 4px; font-size:6px">
                            X
                        </el-checkbox>
                    </td>
                    <td colspan="12" rowspan="2" contenteditable="true"
                        @input="e => formDataTemp.ap_dicing_item = (e.target as HTMLElement).innerText">
                        {{ formData.ap_dicing_item }}
                    </td>
                    <td colspan="4" class="bcell">
                        L
                    </td>
                    <td colspan="4" class="bcell">
                        W
                    </td>
                    <td colspan="4" class="bcell">
                        T
                    </td>
                    <td colspan="8" rowspan="2" contenteditable="true"
                        @input="e => formDataTemp.ap_dicing_remark = (e.target as HTMLElement).innerText">
                        {{ formData.ap_dicing_remark }}
                    </td>
                </tr>
                <tr>

                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.ap_dicing_l = (e.target as HTMLElement).innerText">
                        {{ formData.ap_dicing_l }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.ap_dicing_w = (e.target as HTMLElement).innerText">
                        {{ formData.ap_dicing_w }}
                    </td>
                    <td colspan="4" contenteditable="true"
                        @input="e => formDataTemp.ap_dicing_t = (e.target as HTMLElement).innerText">
                        {{ formData.ap_dicing_t }}
                    </td>

                </tr>
            </tbody>
        </table>
    </el-card>
    <BomSelectModal v-if="showBomPopup" :items="bomOptions" @select="onSelectBom" @close="showBomPopup = false" />

    <BomSelectModal v-if="showBomPopup1" :items="bomOptions" @select="onSelectBomNew" @close="showBomPopup1 = false" />

    <BomSelectModalIC v-if="showBomPopupIc" :items="bomOptions" @select="onSelectBom" @close="showBomPopupIc = false" />

    <BomSelectModalIC v-if="showBomPopupIc1" :items="bomOptions" @select="onSelectBomNew"
        @close="showBomPopupIc1 = false" />

</template>

<script lang="ts" setup>
// 로직이 있다면 여기에
import { Ref, ref, onMounted, nextTick, watchEffect, watch } from "vue";
import type {
    ApplicationData, BomMeterial, SmtItem, ModuleMenu
} from "../../../../interface/orderSheetInterface";
import { getBomCode, postSaveChildren, getMenu, getPcbCode, getOds } from '../../../../utils/orderShiitUtils';
import { useRoute, useRouter } from "vue-router";
import CustomSelect from '../components/CustomSelect.vue';
import BomSelectModal from "../components/BomSelectModal.vue";
import BomSelectModalIC from "../components/BomSelectModalIC.vue";
// import { setLabels } from "vue-chartjs/dist/utils";
import Module from "module";
import MeteiralSim from "../components/MeteiralSim.vue";
const {
    formData,
    formDataTemp,
    changeProw,
    changeSrow,
    prow,
    srow,
    menuAll,
    mappingTempM,
} = defineProps<{
    formData: ApplicationData
    formDataTemp: ApplicationData
    changeProw: (event: string, pindex: number) => void
    changeSrow: (event: string, sindex: number) => void
    mappingTempM: (fq: ApplicationData) => void
    prow: Ref<number>
    srow: Ref<number>
    menuAll: Ref<ModuleMenu[]>
}>()
const isLoading = ref(false);

const fileInputSD = ref<HTMLInputElement | null>(null);
const fileInputMI = ref<HTMLInputElement | null>(null);
const fileInputMD = ref<HTMLInputElement | null>(null);

const existingSD = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const existingMI = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const existingMD = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const deleteImage = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const imagesetSD = ref<File[]>([]);
const imagesetMI = ref<File[]>([]);
const imagesetMD = ref<File[]>([]);
const tempSmt = ref<SmtItem[]>([]);
const tempSmtView = ref<SmtItem[]>([]);
const bomSearchResult = ref<BomMeterial[]>([]);

const showBomPopup = ref(false);
const showBomPopup1 = ref(false);
const showBomPopupIc = ref(false)
const showBomPopupIc1 = ref(false)
const showMeterialPop = ref(false);
const bomOptions = ref<any[]>([]);
const enterIndex = ref<number>(0);
const selectedBom = ref<any | null>(null);

const refs = ref<ModuleMenu[]>([]);
const epoxys = ref<ModuleMenu[]>([]);
const markers = ref<ModuleMenu[]>([]);
const makers_ics = ref<ModuleMenu[]>([]);
const makers_pcb = ref<ModuleMenu[]>([]);
const makers_car = ref<ModuleMenu[]>([]);
const makers_smd = ref<ModuleMenu[]>([]);
const makers_saw = ref<ModuleMenu[]>([]);
const carriertapes = ref<ModuleMenu[]>([]);
const ics = ref<ModuleMenu[]>([]);
const carrierbom = ref<ModuleMenu[]>([]);
const epoxybom = ref<ModuleMenu[]>([]);
const pcbcodes = ref<ModuleMenu[]>([]);

function triggerFileSelect(target: 'fileInputSD' | 'fileInputMI' | 'fileInputMD') {
    console.log('triggerFileSelect 실행됨', fileInputSD.value);
    if (target === 'fileInputSD') fileInputSD.value?.click();
    if (target === 'fileInputMI') fileInputMI.value?.click();
    if (target === 'fileInputMD') fileInputMD.value?.click();
}


function onDropSD(event: DragEvent) {
    const files = event.dataTransfer?.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {

            imagesetSD.value.push(file);

        } else {
            alert("이미지 파일만 업로드할 수 있습니다.");
        }
    }
}

function onDropMI(event: DragEvent) {
    const files = event.dataTransfer?.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
            imagesetMI.value.push(file);

        } else {
            alert("이미지 파일만 업로드할 수 있습니다.");
        }
    }
}
function onDropMD(event: DragEvent) {
    const files = event.dataTransfer?.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
            imagesetMD.value.push(file);

        } else {
            alert("이미지 파일만 업로드할 수 있습니다.");
        }
    }
}



function removeExistingImageMI(index: number) {
    const target = existingMI.value[index];
    if (target) {
        deleteImage.value.push(target);
        existingMI.value.splice(index, 1);
    }
}
function removeExistingImageSD(index: number) {
    const target = existingSD.value[index];
    if (target) {
        deleteImage.value.push(target);
        existingSD.value.splice(index, 1);
    }
}
function removeExistingImageMD(index: number) {
    const target = existingMD.value[index];
    if (target) {
        deleteImage.value.push(target);
        existingMD.value.splice(index, 1);
    }
}


function removeImageSD(index: number) {
    imagesetSD.value.splice(index, 1);
}
function removeImageMI(index: number) {
    imagesetMI.value.splice(index, 1);
}
function removeImageMD(index: number) {
    imagesetMD.value.splice(index, 1);
}

function handleFilesChangeSD(e: Event) {
    onFilesChange(e, imagesetSD);
}
function handleFilesChangeMI(e: Event) {
    onFilesChange(e, imagesetMI);
}
function handleFilesChangeMD(e: Event) {
    onFilesChange(e, imagesetMD);
}
function onFilesChange(event: Event, imageset: Ref<File[]>) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!imageset) {
        console.error('imageset이 undefined입니다!');
        return;
    }

    if (files) {
        for (const file of Array.from(files)) {
            if (file.type.startsWith('image/')) {
                imageset.value.push(file); // 🔥 여기서 진짜 파일을 저장해야 함
            }
        }
    }
}

function getObjectURL(file: File): string {
    return URL.createObjectURL(file)
}
async function handleEnterKey(state: string, index: number) {

    if (state === 'new') {
        console.log(tempSmt.value)
        const smt = tempSmt.value[index];
        const request: SmtItem = {
            sheet_id: '123123123',
            sorder: smt.sorder || '',
            sref: smt.sref || '',
            sbom: smt.sbom || '',
            spn: smt.spn || '',
            svalue: smt.svalue || '',
            ssize: smt.ssize || '',
            smarker: smt.smarker || '',
            sx: smt.sx || '',
            sy: smt.sy || '',
            smt_id: smt.smt_id || 0,
        };

        if (smt.sref === 'SAW') {
            request.svalue = formDataTemp.saw_type;
        }

        const response = await getBomCode(request);

        bomOptions.value = response;
        if (smt.sref === "IC") {
            showBomPopupIc1.value = true;
        }
        else {
            showBomPopup1.value = true;
        }
        enterIndex.value = index;
        return;
    }
    else {
        const smt = formDataTemp.smt_list[index];

        const request: SmtItem = {
            sheet_id: '123123123',
            sorder: smt.sorder || '',
            sref: smt.sref || '',
            sbom: smt.sbom || '',
            spn: smt.spn || '',
            svalue: smt.svalue || '',
            ssize: smt.ssize || '',
            smarker: smt.smarker || '',
            sx: smt.sx || '',
            sy: smt.sy || '',
            smt_id: smt.smt_id || 0,
        };

        if (smt.sref === 'SAW') {
            request.svalue = formDataTemp.saw_type;
        }

        const response = await getBomCode(request);

        // const response = await getBomCode(request);

        bomOptions.value = response;
        if (smt.sref === "IC") {
            showBomPopupIc.value = true;
        }
        else {
            showBomPopup.value = true;
        }
        // showBomPopup.value = true;
        enterIndex.value = index;
        return;
    }
}

function onSelectBom(item: any) {
    console.log("선택된 BOM old:", item);
    // 예시: 선택한 항목을 현재 행에 반영
    if (item.WGBEZ === 'x9z00') {

        // showMeterialPop.value = true
        return;
    }
    const index = enterIndex.value
    formData.smt_list[index].sbom = item.MATNR
    formDataTemp.smt_list[index].sbom = item.MATNR
    const maktx = item.MAKTX || "";
    let refs = '';
    const markerMap: Record<string, string> = {
        S: "AKM",
        D: "Daisho Denshi",
        N: "NJRC",
    };
    const markerMapIC: Record<string, string> = {
        N: "NR lab",
        C: "Canaana",
        W: "Wisol",
        T: "Thoshiba",
        F: "Ferfics",
        I: "Infineno",
        P: "Peregrine",
        S: "Silanna",
        R: "TowerSemi",
        D: "Radrock",
    };
    const markerMapSmd: Record<string, string> = {
        M: "Murata",
        N: "Murata",
        H: "Murata",
        P: "Murata",
        L: "Sunload",
        D: "Sunload",
        J: "Sunload",
        A: "Sunload",
        T: "TDK"
    };
    if (maktx) {
        const parts = maktx.split(";");

        refs = parts[0]

        if (item.MATNR) {
            if (item.MATNR.startsWith("2702")) {
                refs = 'Resistor';
            }
            if (item.MATNR.startsWith("2703")) {
                refs = 'Inductor';
            }
            if (item.MATNR.startsWith("2203")) {
                refs = 'Capacitor';
            }
        }
        if (parts[0] === 'SWITCH' || parts[0] === 'LNA' || parts[0] === 'COMBO') {
            refs = 'IC';
        }
        if (item.MAKTX && /cover tape/i.test(item.MAKTX)) {
            refs = 'CoverTape'
        }
        if (item.MAKTX && /solder/i.test(item.MAKTX)) {
            refs = 'Solder'
        }
        if (item.MAKTX && /epoxy/i.test(item.MAKTX) || item.MAKTX && /film/i.test(item.MAKTX)) {
            refs = 'Epoxy'
        }

    }
    if (formDataTemp.smt_list[index].sref === 'Inductor' || refs === 'Inductor') {
        // 사이즈 추출 (쉼표 뒤 마지막 단어)
        const parts = maktx.split(",");
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";

        const markerName = markerMapSmd[mk] || "Unknown";
        // ssize: "IND; 0402" → split(";")[1] → " 0402" → trim()
        const ssize = parts.length > 0 ? parts[0].split(";")[1]?.trim() || "" : "";
        // svalue: 그냥 두 번째 파트
        const svalue = parts.length > 1 ? parts[1].trim() : "";
        formData.smt_list[index].sbom = item.MATNR
        formDataTemp.smt_list[index].sbom = item.MATNR
        formDataTemp.smt_list[index].sref = 'Inductor'
        formDataTemp.smt_list[index].smarker = markerName
        formData.smt_list[index].smarker = markerName
        formData.smt_list[index].sref = 'Inductor'
        formData.smt_list[index].svalue = svalue
        formDataTemp.smt_list[index].svalue = svalue
        formData.smt_list[index].ssize = ssize
        formDataTemp.smt_list[index].ssize = ssize
        formData.smt_list[index].spn = item.MAKTX
        formDataTemp.smt_list[index].spn = item.MAKTX
    }
    if (formDataTemp.smt_list[index].sref === 'Capacitor' || refs === 'Capacitor') {
        // 사이즈 추출 (쉼표 뒤 마지막 단어)
        const parts = maktx.split(",");
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";
        const markerName = markerMapSmd[mk] || "Unknown";
        // ssize: "IND; 0402" → split(";")[1] → " 0402" → trim()
        const ssize = parts.length > 0 ? parts[0].split(";")[1]?.trim() || "" : "";
        // svalue: 그냥 두 번째 파트
        const svalue = parts.length > 1 ? parts[1].trim() : "";
        formData.smt_list[index].sbom = item.MATNR
        formDataTemp.smt_list[index].sbom = item.MATNR
        formDataTemp.smt_list[index].sref = 'Capacitor'
        formData.smt_list[index].sref = 'Capacitor'
        formDataTemp.smt_list[index].smarker = markerName
        formData.smt_list[index].smarker = markerName
        formData.smt_list[index].svalue = svalue
        formDataTemp.smt_list[index].svalue = svalue
        formData.smt_list[index].ssize = ssize
        formDataTemp.smt_list[index].ssize = ssize
        formData.smt_list[index].spn = item.MAKTX
        formDataTemp.smt_list[index].spn = item.MAKTX
    }
    if (formDataTemp.smt_list[index].sref === 'Resistor' || refs === 'Resistor') {
        const parts = maktx.split(",");
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";
        const markerName = markerMapSmd[mk] || "Unknown";
        const ssize = parts.length > 0 ? parts[0].split(";")[1]?.trim() || "" : "";
        const svalue = parts.length > 1 ? parts[1].trim() : "";
        const spn = parts.length > 2 ? parts[2].trim() : "";
        formData.smt_list[index].sbom = item.MATNR
        formDataTemp.smt_list[index].sbom = item.MATNR
        formDataTemp.smt_list[index].sref = refs
        formData.smt_list[index].sref = refs
        formDataTemp.smt_list[index].smarker = markerName
        formData.smt_list[index].smarker = markerName
        formData.smt_list[index].svalue = svalue
        formDataTemp.smt_list[index].svalue = svalue
        formData.smt_list[index].ssize = ssize
        formDataTemp.smt_list[index].ssize = ssize
        formData.smt_list[index].spn = item.MAKTX
        formDataTemp.smt_list[index].spn = item.MAKTX

    }
    if (formDataTemp.smt_list[index].sref === 'PCB' || refs === 'PCB') {
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";
        const markerName = markerMap[mk] || "Unknown";
        const parts = maktx.split(",");
        const ssize = parts.length > 0 ? parts[0].split(";")[1]?.trim() || "" : "";
        const svalue = parts.length > 1 ? parts[1].trim() : "";
        console.log(ssize, maktx);
        formDataTemp.smt_list[index].sref = 'PCB'
        formData.smt_list[index].sref = 'PCB'
        formDataTemp.smt_list[index].smarker = markerName
        formData.smt_list[index].smarker = markerName
        formData.smt_list[index].spn = maktx
        formDataTemp.smt_list[index].spn = maktx
        if ((!formDataTemp.cellsize_l || !formDataTemp.cellsize_w) && ssize) {
            let s = String(ssize);
            if (s.length >= 4) {   // 최소 4자리 이상일 때만 파싱
                let l = s.substring(0, 2);
                let w = s.substring(2, 4);

                let lFormatted = l[0] + "." + l[1] + " ± 0.05";
                let wFormatted = w[0] + "." + w[1] + " ± 0.05";

                formData.cellsize_l = lFormatted;
                formData.cellsize_w = wFormatted;
                formDataTemp.cellsize_l = lFormatted;
                formDataTemp.cellsize_w = wFormatted;
            }
        }

        formData.smt_list[index].ssize = ssize
        formDataTemp.smt_list[index].ssize = ssize
        formDataTemp.pcb_code = svalue
        formData.pcb_code = svalue
    }
    if (formDataTemp.smt_list[index].sref == 'IC' || refs === 'IC') {
        const maktx = item.MAKTX || "";
        const sref = maktx.split(";")[0].trim();
        const parts = maktx.split(",");
        const ssize = parts.length > 1 ? parts[parts.length - 1].trim() : "";
        const spn = parts.length > 0
            ? parts[0].split(";")[1].trim()
            : "";
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";
        const markerName = markerMapIC[mk] || "Unknown";
        formData.smt_list[index].sbom = item.MATNR
        formDataTemp.smt_list[index].sbom = item.MATNR

        formData.smt_list[index].sref = refs
        formDataTemp.smt_list[index].sref = refs
        formData.smt_list[index].svalue = sref

        formDataTemp.smt_list[index].svalue = sref
        formData.smt_list[index].ssize = ssize
        formDataTemp.smt_list[index].ssize = ssize
        formData.smt_list[index].smarker = markerName
        formDataTemp.smt_list[index].smarker = markerName
        formDataTemp.smt_list[index].spn = maktx
        formData.smt_list[index].spn = maktx
    }
    if (formDataTemp.smt_list[index].sref == 'SAW') {
        formData.smt_list[index].smarker = 'Wisol'
        formDataTemp.smt_list[index].smarker = 'Wisol'
        formData.smt_list[index].spn = item.MAKTX,
            formDataTemp.smt_list[index].spn = item.MAKTX
    }
    if (formDataTemp.smt_list[index].sref === 'CoverTape' || refs === 'CoverTape') {

        formDataTemp.smt_list[index].sref = 'CoverTape'
        formData.smt_list[index].sref = 'CoverTape'
        formData.smt_list[index].sbom = item.MATNR
        formDataTemp.smt_list[index].sbom = item.MATNR
        formData.smt_list[index].spn = item.MAKTX,
            formDataTemp.smt_list[index].spn = item.MAKTX
    }
    if (formDataTemp.smt_list[index].sref === 'Solder' || refs === 'Solder') {

        formDataTemp.smt_list[index].sref = 'Solder'
        formData.smt_list[index].sref = 'Solder'
        formData.smt_list[index].sbom = item.MATNR
        formDataTemp.smt_list[index].sbom = item.MATNR
        formData.smt_list[index].spn = item.MAKTX,
            formDataTemp.smt_list[index].spn = item.MAKTX
    }
    if (formDataTemp.smt_list[index].sref === 'Epoxy' || refs === 'Epoxy') {

        formDataTemp.smt_list[index].sref = 'Epoxy'
        formData.smt_list[index].sref = 'Epoxy'
        formData.smt_list[index].sbom = item.MATNR
        formDataTemp.smt_list[index].sbom = item.MATNR
        formData.smt_list[index].spn = item.MAKTX,
            formDataTemp.smt_list[index].spn = item.MAKTX
    }
    enterIndex.value = 0
}

function onSelectBomNew(item: any) {
    console.log("선택된 BOM new:", item);
    // 예시: 선택한 항목을 현재 행에 반영
    const index = enterIndex.value
    tempSmtView.value[index].sbom = item.MATNR
    tempSmt.value[index].sbom = item.MATNR

    if (item.WGBEZ === 'x9z00') {
        // showMeterialPop.value = true
        return;
    }
    const maktx = item.MAKTX || "";
    let refs = '';
    if (maktx) {
        const parts = maktx.split(";");

        refs = parts[0]

        if (item.MATNR) {
            if (item.MATNR.startsWith("2702")) {
                refs = 'Resistor';
            }
            if (item.MATNR.startsWith("2703")) {
                refs = 'Inductor';
            }
            if (item.MATNR.startsWith("2203")) {
                refs = 'Capacitor';
            }
        }
        if (parts[0] === 'SWITCH' || parts[0] === 'LNA' || parts[0] === 'COMBO') {
            refs = 'IC';
        }
        if (item.MAKTX && /cover tape/i.test(item.MAKTX)) {
            refs = 'CoverTape'
        }
        if (item.MAKTX && /solder/i.test(item.MAKTX)) {
            refs = 'Solder'
        }
        if (item.MAKTX && /epoxy/i.test(item.MAKTX) || item.MAKTX && /film/i.test(item.MAKTX)) {
            refs = 'Epoxy'
        }

    }
    const markerMap: Record<string, string> = {
        S: "AKM",
        D: "Daisho Denshi",
        N: "NJRC",
    };
    const markerMapIC: Record<string, string> = {
        N: "NR lab",
        C: "Canaana",
        W: "Wisol",
        T: "Thoshiba",
        F: "Ferfics",
        I: "Infineno",
        P: "Peregrine",
        S: "Silanna",
        R: "TowerSemi",
        D: "Radrock",
    };
    const markerMapSmd: Record<string, string> = {
        U: "Uniohm",
        M: "Murata",
        S: "Sunload",
        T: "TDK"
    };
    if (formDataTemp.smt_list[index].sref === 'Inductor' || refs === 'IND') {

        const parts = maktx.split(",");
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";

        const markerName = markerMapSmd[mk] || "Unknown";
        // ssize: "IND; 0402" → split(";")[1] → " 0402" → trim()
        const ssize = parts.length > 0 ? parts[0].split(";")[1]?.trim() || "" : "";
        // svalue: 그냥 두 번째 파트
        const svalue = parts.length > 1 ? parts[1].trim() : "";
        const spn = parts.length > 2 ? parts[2].trim() : "";
        tempSmtView.value[index].sbom = item.MATNR
        tempSmt.value[index].sbom = item.MATNR
        tempSmt.value[index].sref = 'Inductor'
        tempSmt.value[index].smarker = markerName
        tempSmtView.value[index].smarker = markerName
        tempSmtView.value[index].sref = 'Inductor'
        tempSmtView.value[index].svalue = svalue
        tempSmt.value[index].svalue = svalue
        tempSmtView.value[index].ssize = ssize
        tempSmt.value[index].ssize = ssize
        tempSmtView.value[index].spn = spn
        tempSmt.value[index].spn = spn
        console.log(spn);
    }
    if (tempSmt.value[index].sref === 'Capacitor' || refs === 'Capacitor') {
        // 사이즈 추출 (쉼표 뒤 마지막 단어)
        const parts = maktx.split(",");
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";
        const markerName = markerMapSmd[mk] || "Unknown";
        // ssize: "IND; 0402" → split(";")[1] → " 0402" → trim()
        const ssize = parts.length > 0 ? parts[0].split(";")[1]?.trim() || "" : "";
        // svalue: 그냥 두 번째 파트
        const svalue = parts.length > 1 ? parts[1].trim() : "";
        const spn = parts.length > 2 ? parts[2].trim() : "";
        tempSmtView.value[index].sbom = item.MATNR
        tempSmt.value[index].sbom = item.MATNR
        tempSmt.value[index].sref = 'Capacitor'
        tempSmtView.value[index].sref = 'Capacitor'
        tempSmt.value[index].smarker = markerName
        tempSmtView.value[index].smarker = markerName
        tempSmtView.value[index].svalue = svalue
        tempSmt.value[index].svalue = svalue
        tempSmtView.value[index].ssize = ssize
        tempSmt.value[index].ssize = ssize
        tempSmtView.value[index].spn = spn
        tempSmt.value[index].spn = spn
    }
    if (tempSmt.value[index].sref === 'Resistor' || refs === 'Resistor') {
        const parts = maktx.split(",");
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";
        const markerName = markerMapSmd[mk] || "Unknown";
        const ssize = parts.length > 0 ? parts[0].split(";")[1]?.trim() || "" : "";
        const svalue = parts.length > 1 ? parts[1].trim() : "";
        const spn = parts.length > 2 ? parts[2].trim() : "";
        tempSmtView.value[index].sbom = item.MATNR
        tempSmt.value[index].sbom = item.MATNR
        tempSmt.value[index].sref = refs
        tempSmtView.value[index].sref = refs
        tempSmt.value[index].smarker = markerName
        tempSmtView.value[index].smarker = markerName
        tempSmtView.value[index].svalue = svalue
        tempSmt.value[index].svalue = svalue
        tempSmtView.value[index].ssize = ssize
        tempSmt.value[index].ssize = ssize
        tempSmtView.value[index].spn = spn
        tempSmt.value[index].spn = spn
    }

    if (tempSmt.value[index].sref === 'PCB' || refs === 'PCB') {
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";
        const markerName = markerMap[mk] || "Unknown";
        const parts = maktx.split(",");
        const ssize = parts.length > 0 ? parts[0].split(";")[1]?.trim() || "" : "";
        const svalue = parts.length > 1 ? parts[1].trim() : "";
        console.log(ssize, svalue);
        tempSmt.value[index].sref = 'PCB'
        tempSmtView.value[index].sref = 'PCB'
        tempSmt.value[index].smarker = markerName
        tempSmtView.value[index].smarker = markerName
        tempSmtView.value[index].spn = maktx
        tempSmt.value[index].spn = maktx
        if ((formDataTemp.cellsize_l === '' || formDataTemp.cellsize_w === '') && ssize) {
            let s = String(ssize);

            if (s.length >= 4) {   // 최소 4자리 이상일 때만 파싱
                let l = s.substring(0, 2);
                let w = s.substring(2, 4);

                let lFormatted = l[0] + "." + l[1] + " ± 0.05";
                let wFormatted = w[0] + "." + w[1] + " ± 0.05";

                formData.cellsize_l = lFormatted;
                formData.cellsize_w = wFormatted;
                formDataTemp.cellsize_l = lFormatted;
                formDataTemp.cellsize_w = wFormatted;
            }
        }
        tempSmtView.value[index].ssize = ssize
        tempSmt.value[index].ssize = ssize
        formDataTemp.pcb_code = svalue
        formData.pcb_code = svalue
    }
    if (tempSmt.value[index].sref == 'IC' || refs === 'IC') {
        const maktx = item.MAKTX || "";
        const sref = maktx.split(";")[0].trim();
        const parts = maktx.split(",");
        const ssize = parts.length > 1 ? parts[parts.length - 1].trim() : "";
        const spn = parts.length > 0
            ? parts[0].split(";")[1].trim()
            : "";
        const mk = item.MATNR ? item.MATNR[item.MATNR.length - 1] : "";
        const markerName = markerMapIC[mk] || "Unknown";
        tempSmtView.value[index].sbom = item.MATNR
        tempSmt.value[index].sbom = item.MATNR
        tempSmt.value[index].sref = refs
        tempSmtView.value[index].sref = refs
        tempSmt.value[index].svalue = sref
        tempSmtView.value[index].svalue = sref
        tempSmtView.value[index].ssize = ssize
        tempSmt.value[index].ssize = ssize
        tempSmtView.value[index].smarker = markerName
        tempSmt.value[index].smarker = markerName
        tempSmt.value[index].spn = maktx
        tempSmtView.value[index].spn = maktx


    }
    if (tempSmt.value[index].sref == 'SAW') {
        tempSmtView.value[index].smarker = 'Wisol'
        tempSmt.value[index].smarker = 'Wisol'
        tempSmt.value[index].spn = item.MAKTX
        tempSmtView.value[index].spn = item.MAKTX
    }
    if (tempSmt.value[index].sref == 'CoverTape' || refs === 'CoverTape') {
        tempSmtView.value[index].sref = 'CoverTape'
        tempSmt.value[index].sref = 'CoverTape'
        tempSmt.value[index].sbom = item.MATNR
        tempSmtView.value[index].sbom = item.MATNR
        tempSmt.value[index].spn = item.MAKTX
        tempSmtView.value[index].spn = item.MAKTX
    }
    if (tempSmt.value[index].sref == 'CarrierTape' || refs === 'CarrierTape') {
        tempSmtView.value[index].sref = 'CarrierTape'
        tempSmt.value[index].sref = 'CarrierTape'
        tempSmt.value[index].sbom = item.MATNR
        tempSmtView.value[index].sbom = item.MATNR
        tempSmt.value[index].spn = item.MAKTX
        tempSmtView.value[index].spn = item.MAKTX
    }
    if (tempSmt.value[index].sref == 'Solder' || refs === 'Solder') {
        tempSmtView.value[index].sref = 'Solder'
        tempSmt.value[index].sref = 'Solder'
        tempSmt.value[index].sbom = item.MATNR
        tempSmtView.value[index].sbom = item.MATNR
        tempSmt.value[index].spn = maktx
        tempSmtView.value[index].spn = maktx
    }
    if (tempSmt.value[index].sref == 'Epoxy' || refs === 'Epoxy') {
        tempSmtView.value[index].sref = 'Epoxy'
        tempSmt.value[index].sref = 'Epoxy'
        tempSmt.value[index].sbom = item.MATNR
        tempSmtView.value[index].sbom = item.MATNR
        tempSmt.value[index].spn = maktx
        tempSmtView.value[index].spn = maktx
    }
    enterIndex.value = 0
}

const route = useRoute()
function changeSrows(event: 'u' | 'd', deleteIndex?: number) {
    const sheetId = route.params.sheetId as string
    console.log("up")

    if (event === 'u') {
        tempSmt.value.push({
            sheet_id: sheetId,
            sorder: '',
            sref: '',
            sbom: '',
            spn: '',
            svalue: '',
            ssize: '',
            smarker: '',
            sx: '',
            sy: '',
            smt_id: 0
        })
        tempSmtView.value.push({
            sheet_id: sheetId,
            sorder: '',
            sref: '',
            sbom: '',
            spn: '',
            svalue: '',
            ssize: '',
            smarker: '',
            sx: '',
            sy: '',
            smt_id: 0
        })
    } else if (event === 'd' && typeof deleteIndex === 'number') {
        if (tempSmt.value.length > 0 && deleteIndex >= 0 && deleteIndex < tempSmt.value.length &&
            tempSmtView.value.length > 0 && deleteIndex >= 0 && deleteIndex < tempSmtView.value.length

        ) {
            tempSmt.value.splice(deleteIndex, 1)
            tempSmtView.value.splice(deleteIndex, 1)
        }
    }
}

async function saveChildren() {
    await mappingData();
    const result = postSaveChildren(formData, imagesetSD.value, imagesetMI.value, imagesetMD.value, deleteImage.value);
    const sheetId = route.params.sheetId as '';
    console.log(sheetId)
    const sheet = await getOds(sheetId);
    await mappingTempM(sheet)
    tempSmt.value = []
    tempSmtView.value = []
}

const mappingData = () => {
    formData.model_name = formDataTemp.model_name
    formData.full_model_name = formDataTemp.full_model_name
    formData.metal_mask = formDataTemp.metal_mask
    formData.pcb_code = formDataTemp.pcb_code
    formData.quantity = formDataTemp.quantity
    formData.pcb_amount = formDataTemp.pcb_amount
    formData.assy_purpose_type = formDataTemp.assy_purpose_type
    formData.assy_purpose_level = formDataTemp.assy_purpose_level
    formData.assy_purpose_submit_yn = formDataTemp.assy_purpose_submit_yn
    formData.assy_purpose_shipment = formDataTemp.assy_purpose_shipment
    formData.request_requestor = formDataTemp.request_requestor
    formData.request_receiver = formDataTemp.request_receiver
    formData.request_request_date = formDataTemp.request_request_date
    formData.request_date_end = formDataTemp.request_date_end
    formData.module_type = formDataTemp.module_type
    formData.saw_type = formDataTemp.saw_type
    formData.assembly_history = formDataTemp.assembly_history
    formData.changed_yn = formDataTemp.changed_yn
    formData.history_remark = formDataTemp.history_remark
    formData.requirement_remark = formDataTemp.requirement_remark
    formData.assembly_type = formDataTemp.assembly_type
    formData.heat = formDataTemp.heat
    formData.ft = formDataTemp.ft
    formData.fa = formDataTemp.fa
    formData.taping = formDataTemp.taping
    formData.array_x = formDataTemp.array_x
    formData.array_y = formDataTemp.array_y
    formData.array_quantinty = formDataTemp.array_quantinty
    formData.cellsize_l = formDataTemp.cellsize_l
    formData.cellsize_w = formDataTemp.cellsize_w
    formData.cellsize_t = formDataTemp.cellsize_t
    formData.ap_smt_flag = formDataTemp.ap_smt_flag
    formData.ap_smt_item = formDataTemp.ap_smt_item
    formData.ap_smt_flux = formDataTemp.ap_smt_flux
    formData.ap_smt_solder = formDataTemp.ap_smt_solder
    formData.ap_smt_remark = formDataTemp.ap_smt_remark
    formData.ap_molding_flag = formDataTemp.ap_molding_flag
    formData.ap_molding_item = formDataTemp.ap_molding_item
    formData.ap_molding_description = formDataTemp.ap_molding_description
    formData.ap_molding_remark = formDataTemp.ap_molding_remark
    formData.ap_grinding_flag = formDataTemp.ap_grinding_flag
    formData.ap_grinding_item = formDataTemp.ap_grinding_item
    formData.ap_grinding_description = formDataTemp.ap_grinding_description
    formData.ap_grinding_remark = formDataTemp.ap_grinding_remark
    formData.ap_marking_flag = formDataTemp.ap_marking_flag
    formData.ap_marking_item = formDataTemp.ap_marking_item
    formData.ap_marking_description = formDataTemp.ap_marking_description
    formData.ap_marking_remark = formDataTemp.ap_marking_remark
    formData.ap_dicing_flag = formDataTemp.ap_dicing_flag
    formData.ap_dicing_item = formDataTemp.ap_dicing_item
    formData.ap_dicing_l = formDataTemp.ap_dicing_l
    formData.ap_dicing_w = formDataTemp.ap_dicing_w
    formData.ap_dicing_t = formDataTemp.ap_dicing_t
    formData.ap_dicing_remark = formDataTemp.ap_dicing_remark
    formData.msl_level = formDataTemp.msl_level
    //list 매핑 , 초기화 해줘야됌
    formData.smt_list = [...formDataTemp.smt_list, ...tempSmt.value];
    formData.position_list = [...formDataTemp.position_list];
}

function getCarrierBomCode(statec: string, index: number) {
    // console.log(tempSmt.value)
    console.log(tempSmt.value)
    if (statec == 'default') {
        const pn = formDataTemp.smt_list[index].spn
        if (pn) {
            const match = carrierbom.value.find(q => q.mlabel === pn);
            formDataTemp.smt_list[index].sbom = match?.mvalue || ''
            return match?.mvalue || '';
        }
    } else if (statec === 'new') {
        const pn = tempSmt.value[index].spn
        if (pn) {
            const match = carrierbom.value.find(q => q.mlabel === pn);
            tempSmt.value[index].sbom = match?.mvalue || ''
            tempSmtView.value[index].sbom = match?.mvalue || ''
            return match?.mvalue || '';
        }
    }
}

function handleEnterCellsize(state: string) {

    if (state === 't') {
        const raw = formDataTemp.cellsize_t.trim()
        // const digitsOnly = raw.replace(/\D/g, '');
        const val = raw.split(' ')
        const left = val[0]
        const right = val[1]

        const leftFormatted = `${left[0]}.${left.substring(1)}`;   // "0.55"
        const rightFormatted = `${right[0]}.${right.substring(1)}`; // "0.05"

        const result = `${leftFormatted} ± ${rightFormatted}`;
        formDataTemp.cellsize_t = result
        formData.cellsize_t = result

    } else if (state === 'l') {
        const raw = formDataTemp.cellsize_l.replace(/\s+/g, ''); // 모든 공백 제거
        const digitsOnly = raw.replace(/\D/g, '');
        if (raw.length === 5) {
            const left = digitsOnly.substring(0, 2);   // "055"
            const right = digitsOnly.substring(2, 5);  // "005"

            const leftFormatted = `${left[0]}.${left.substring(1)}`;   // "0.55"
            const rightFormatted = `${right[0]}.${right.substring(1)}`; // "0.05"

            const result = `${leftFormatted} ± ${rightFormatted}`;

            formDataTemp.cellsize_l = result
            formData.cellsize_l = result

        }
    } else if (state === 'w') {
        const raw = formDataTemp.cellsize_w.replace(/\s+/g, ''); // 모든 공백 제거
        const digitsOnly = raw.replace(/\D/g, '');
        if (raw.length === 5) {
            const left = digitsOnly.substring(0, 2);   // "055"
            const right = digitsOnly.substring(2, 5);  // "005"

            const leftFormatted = `${left[0]}.${left.substring(1)}`;   // "0.55"
            const rightFormatted = `${right[0]}.${right.substring(1)}`; // "0.05"

            const result = `${leftFormatted} ± ${rightFormatted}`;

            formDataTemp.cellsize_w = result
            formData.cellsize_w = result

        }
    }

}

onMounted(async () => {
    const menu = await getMenu()
    const pcbCodes = await getPcbCode(formData.model_name)
    if (formData.image_List && formData.image_List.length > 0) {
        formData.image_List.forEach((item) => {
            if (item.cell_name === 'MI') {
                existingMI.value.push(item);
            } else if (item.cell_name === 'MD') {
                existingMD.value.push(item);
            } else if (item.cell_name === 'SD') {
                existingSD.value.push(item);
            }
        });
    }
    refs.value = menu
        .filter(item => item.mtype === "refs")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    epoxys.value = menu
        .filter(item => item.mtype === "epoxys")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    makers_ics.value = menu
        .filter(item => item.mtype === "markers_ics")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    makers_pcb.value = menu
        .filter(item => item.mtype === "markers_pcb")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    makers_car.value = menu
        .filter(item => item.mtype === "markers_car")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    makers_smd.value = menu
        .filter(item => item.mtype === "markers_smd")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    makers_saw.value = menu
        .filter(item => item.mtype === "markers_saw")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    carriertapes.value = menu
        .filter(item => item.mtype === "carriertapes")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    ics.value = menu
        .filter(item => item.mtype === "ics")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    carrierbom.value = menu
        .filter(item => item.mtype === "carrierbom")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    epoxybom.value = menu.filter(item => item.mtype === "epoxybom")
        .map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));
    pcbcodes.value = pcbCodes.map(item => ({ mvalue: item.mvalue, mlabel: item.mlabel }));


    isLoading.value = true
});


function pcbAdd(code: string, index: number) {
    if (!code) {
        return
    }
    formDataTemp.smt_list[index].spn = code
    formData.smt_list[index].spn = code
    if (!formData.smt_list[index].sbom) {
        handleEnterKey("default", index)
    }
    return code
}


watch(
    // ⭐️ 소스를 배열로 묶어서 전달해야 합니다.
    [() => formDataTemp.array_x, () => formDataTemp.array_y],

    (newValues) => {
        // ⭐️ newValues는 [array_x의 새 값, array_y의 새 값] 형태의 배열입니다.
        const [new_x, new_y] = newValues;

        // X와 Y가 모두 0보다 큰 값일 때만 계산을 수행하도록 로직을 변경합니다.
        if (new_x > 0 && new_y > 0) {
            const value = new_x * new_y; // newValues의 값을 사용해야 합니다.

            // ⭐️ 계산된 값을 두 객체에 업데이트
            formDataTemp.array_quantinty = value.toString();
            formData.array_quantinty = value.toString();
        } else {
            // 둘 중 하나라도 0 이하라면 quantity를 0으로 초기화
            formDataTemp.array_quantinty = '0';
            formData.array_quantinty = '0';
        }
    },
    { immediate: true } // 컴포넌트 마운트 시 한 번 실행하여 초기값 설정 (선택 사항)
);

const handlePaste = (state: string, e: ClipboardEvent) => {
    // 1. 클립보드 아이템들을 가져옵니다.
    // console.log(e)
    // return
    const items = e.clipboardData.items;
    let isImageFound = false;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file' && item.type.startsWith('image/')) {
            isImageFound = true; // 이미지를 찾았음!
            const file = item.getAsFile();
            if (state === 'SD') {
                imagesetSD.value.push(file);
                return
            }
            if (state === 'MI') {
                imagesetMI.value.push(file);
                return
            }
            if (state === 'MD') {
                imagesetMD.value.push(file);
                return
            }
            // const reader = new FileReader();
            // reader.onload = (event) => {
            //   const imageUrl = event.target.result;
            //   const imgTag = `<img src="${imageUrl}" style="max-width: 100%;">`;
            //   document.execCommand('insertHTML', false, imgTag);
            // };
            // reader.readAsDataURL(file);
            break;
        }
    }
}
</script>

<style scoped>
@import "../../../../assets/style/orderSheet.css";
</style>
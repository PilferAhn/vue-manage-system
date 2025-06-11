<template>
  <!-- <div v-if="username === '이정민'"> -->
  <el-form :model="applicationData" :rules="rules" label-position="top" label-width="100px" ref="applicationForm">

    <div class="container" v-if="!loading">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <div style="text-align: right;">
              <el-button type="primary" @click="handleTempSave">임시저장</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <div style="text-align:center;">
              <span style="font-size: 25px; font-weight: bold;"> 변경품 / New Model 투입 의뢰서</span><br />
              <span style="font-size: 25px; font-weight: bold;">[Yêu cầu input new model/ sản phẩm thay đổi]</span>
            </div>
          </el-card>
          <el-card>
            <table class="custom-top-table">
              <colgroup>
                <col style="width: 11%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 19%;" />

                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
              </colgroup>

              <tbody>
                <tr>
                  <td colspan="1" class="hcell" style="background-color: #ff00ff;">Model<br />기종명</td>
                  <td colspan="2">
                    {{ `${formData.default_modelName}` }}
                  </td>

                  <td colspan="1" class="hcell" style="background-color: #ff00ff;">Người yêu cầu<br />의뢰인</td>
                  <td colspan="1"> {{ formData.default_requireName }} </td>
                  <td colspan="1" class="hcell" style="background-color: #ff00ff;">Ngày yêu cầu<br />의뢰날짜</td>
                  <td colspan="3"> {{ formData.default_requireDate }}</td>
                </tr>
                <tr>
                  <td colspan="1" class="hcell">Số lượng yêu cầu <br />
                    의뢰수량</td>

                  <td colspan="2" contenteditable="true"
                    @input="e => formDataTemp.default_requireAmount = (e.target as HTMLElement).innerText">
                    {{ formData.default_requireAmount }}
                  </td>



                  <td colspan="1" class="hcell">Yêu cầu packing
                    <br />포장요구사항
                  </td>
                  <td colspan="5" contenteditable="true"
                    @input="e => formDataTemp.default_pkgRequirement = (e.target as HTMLElement).innerText">
                    {{ formData.default_pkgRequirement }}
                  </td>

                </tr>
                <tr>
                  <td colspan="1" class="hcell">Product Size</td>
                  <td colspan="2" style="background-color: #f0f9ff;">
                    <!-- {{ `${formData.default_productSize}` }} -->
                    <el-select v-model="formData.default_productSize" placeholder="선택" class="custom-select"
                      style=" height: 100%; ">
                      <el-option v-for="item in columnOptionsMap.default_productSize.value" :key="item.value"
                        :label="item.label" :value="item.value" />
                    </el-select>
                  </td>

                  <td colspan="1" class="hcell" style="background-color: #ff00ff;">mục đích test<br />
                    실험목적</td>
                  <td colspan="5">
                    {{ `${formData.default_purpose}` }}

                  </td>
                </tr>

              </tbody>
            </table>
          </el-card>


          <el-card>
            <table class="custom-table">
              <colgroup>
                <col style="width: 11%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 19%;" />

                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
                <col style="width: 10%;" />
              </colgroup>

              <tbody>
                <tr>
                  <td colspan="1" class="hcell">Loại hình <br /> 유형</td>
                  <td colspan="1" class="hcell">Hạng mục
                    <br /> 항목
                  </td>
                  <td colspan="7" class="hcell">Quy cách
                    <br /> 규격
                  </td>
                </tr>

                <!-- MERERIAL System -->
                <tr>
                  <td colspan="1" rowspan="11" class="hcell">Vật liệu
                    <br />
                    자재
                  </td>
                  <td colspan="1" rowspan="3" class="hcell">System <br /> 시스템</td>
                  <td colspan="1" rowspan="3" class="hcell" style="background-color: #ff00ff;">ERP BOM</td>
                  <td colspan="1" style="background-color: #ff00ff;">WAFER</td>
                  <td colspan="1">{{ `${formData.system_erp_wafer} &nbsp` }}</td>
                  <td colspan="1" rowspan="3" class="hcell" style="background-color: #ff00ff;">MES CODE
                  </td>
                  <td colspan="1" style="background-color: #ff00ff;">
                    WAFER
                  </td>
                  <td colspan="2">{{ `${formData.system_mes_wafer} &nbsp` }}</td>
                </tr>
                <tr>
                  <td colspan="1" style="background-color: #ff00ff;">PKG/PCB</td>

                  <td colspan="1">
                    {{ `${formData.system_erp_pkg} &nbsp` }}
                  </td>
                  <td colspan="1" style="background-color: #ff00ff;">PKG/PCB</td>
                  <td colspan="2">
                    {{ `${formData.system_mes_pkg}&nbsp` }}
                  </td>
                </tr>
                <tr>
                  <td colspan="1" style="background-color: #ff00ff;">EPOXY</td>
                  <td colspan="1">{{ `${formData.system_erp_epoxy}&nbsp` }}</td>
                  <td colspan="1" style="background-color: #ff00ff;">EPOXY</td>
                  <td colspan="2">{{ `${formData.system_mes_epoxy}&nbsp` }}</td>
                </tr>
                <!-- MERERIAL Wafer -->
                <tr>
                  <td rowspan="4" class="hcell">
                    Wafer
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Chip size
                  </td>
                  <td colspan="2">
                    {{ formData.wafer_chip_size }}
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Wafer Thickness
                  </td>
                  <td colspan="3">
                    {{ `${formData.wafer_thickness}` }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell">
                    PAD Type/유형
                  </td>
                  <td colspan="2" style=" background-color: #f0f9ff;">
                    <el-select v-model="formData.wafer_pad_type" placeholder="선택" class="custom-select"
                      style=" height: 100%; ">
                      <el-option v-for="item in columnOptionsMap.wafer_pad_type.value" :key="item.value"
                        :label="item.label" :value="item.value" />
                    </el-select>
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Số lượng gửi <br />
                    발송수량
                  </td>
                  <td colspan="3">
                    {{ formData.wafer_send_quantity }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell" style="background-color: #ff00ff;">
                    MES Code
                  </td>

                  <td colspan="2">
                    {{ formData.system_mes_wafer }}
                  </td>
                  <td class="hcell">
                    Wafer Mark
                  </td>
                  <td colspan="3" contenteditable="true"
                    @input="e => formDataTemp.wafer_mark = (e.target as HTMLElement).innerText">
                    {{ formData.wafer_mark }}
                  </td>
                </tr>
                <tr>
                  <td class="hcell" style="background-color: #ff00ff;">
                    Wafer LOT NO
                  </td>
                  <td colspan="2">
                    <el-checkbox-group v-model="selectedLots" size="small">
                      <el-checkbox v-for="(lot, index) in wafer_lot_no_opt" :key="index" :label="lot" border />
                    </el-checkbox-group>

                  </td>



                  <td class="hcell" style="background-color: #ff00ff;">
                    Chip Qty
                  </td>
                  <td colspan="3">
                    {{ `${formData.wafer_chip_qty}*${formData.wafer_send_quantity}` }}
                  </td>
                </tr>


                <!-- MERERIAL PKG -->


                <tr>
                  <td rowspan="3" class="hcell">
                    PKG
                  </td>
                  <td class="hcell">
                    PKG <br /> Số hàng * Số cột
                  </td>
                  <td colspan="2" contenteditable="true"
                    @input="e => formDataTemp.pkg_size = (e.target as HTMLElement).innerText">
                    {{ formData.pkg_size }}
                  </td>
                  <td class="hcell" style="background-color: #ff00ff;">
                    ERP Code
                  </td>
                  <td colspan="3">
                    {{ formData.system_erp_wafer }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell">
                    Chât liệu <br /> 재질
                  </td>
                  <td colspan="6" style=" background-color: #f0f9ff;">
                    <el-select v-model="formData.pkg_meterial" placeholder="선택" class="custom-select"
                      style=" height: 100%; ">
                      <el-option v-for="item in columnOptionsMap.pkg_meterial.value" :key="item.value"
                        :label="item.label" :value="item.value" />
                    </el-select>
                  </td>

                </tr>
                <tr>

                  <td class="hcell">
                    Mục chú ý <br />주의사항
                  </td>
                  <td colspan="6" contenteditable="true"
                    @input="e => formDataTemp.pkg_note = (e.target as HTMLElement).innerText">
                    {{ formData.pkg_note }}
                  </td>
                </tr>
                <tr>
                  <td rowspan="1" class="hcell">
                    Epoxy
                  </td>
                  <td class="hcell">
                    Model
                  </td>
                  <td colspan="2" style=" background-color: #f0f9ff;">
                    <el-select v-model="formData.epoxy_model" placeholder="선택" class="custom-select"
                      style=" height: 100%; ">
                      <el-option v-for="item in columnOptionsMap.epoxy_model.value" :key="item.value"
                        :label="item.label" :value="item.value" />
                    </el-select>
                  </td>
                  <td class="hcell">
                    Thickness
                  </td>
                  <td colspan="3" style=" background-color: #f0f9ff;">
                    <el-select v-model="formData.epoxy_thickness" placeholder="선택" class="custom-select"
                      style=" height: 100%; ">
                      <el-option v-for="item in columnOptionsMap.epoxy_thickness.value" :key="item.value"
                        :label="item.label" :value="item.value" />
                    </el-select>
                  </td>
                </tr>



                <!-- 중점공정 -->
                <tr>
                  <td rowspan="10" class="hcell">
                    Trọng tâm công đoạn <br />
                    중점공정
                  </td>
                  <td class="hcell" colspan="1">
                    B/B
                  </td>
                  <td class="hcell" colspan="1" style="background-color: #ff00ff;">
                    BALL SIZE
                  </td>
                  <td colspan="6">
                    {{ formData.bb_ballsize }}
                  </td>

                </tr>
                <tr>
                  <td class="hcell" colspan="1">
                    B/G
                  </td>
                  <td class="hcell" colspan="1">
                    Thickness <br />
                    B/G 를 하는것만 작성
                  </td>
                  <td colspan="2" style=" background-color: #f0f9ff;">
                    <el-select v-model="formData.bg_thickness" placeholder="선택" class="custom-select"
                      style=" height: 100%; ">
                      <el-option v-for="item in columnOptionsMap.bg_thickness.value" :key="item.value"
                        :label="item.label" :value="item.value" />
                    </el-select>
                  </td>
                  <td class="hcell" colspan="1">
                    Độ dày sau B/G <br />
                    B/G후두께
                  </td>
                  <td colspan="3" style=" background-color: #f0f9ff;">
                    <el-select v-model="formData.bg_afterthickness" placeholder="선택" class="custom-select"
                      style=" height: 100%; ">
                      <el-option v-for="item in columnOptionsMap.bg_afterthickness.value" :key="item.value"
                        :label="item.label" :value="item.value" />
                    </el-select>
                  </td>
                </tr>
                <tr>

                  <td class="hcell" colspan="1">
                    D/C
                  </td>
                  <td class="hcell" colspan="1">
                    Phân loại chất liệu
                  </td>
                  <td colspan="6" style=" background-color: #f0f9ff;">
                    <el-select v-model="formData.dc_meterial" placeholder="선택" class="custom-select"
                      style=" height: 100%; ">
                      <el-option v-for="item in columnOptionsMap.dc_meterial.value" :key="item.value"
                        :label="item.label" :value="item.value" />
                    </el-select>
                  </td>

                </tr>

                <tr>

                  <td class="hcell" rowspan="2" colspan="1">
                    F/B
                  </td>
                  <td class="hcell" colspan="1">
                    Hướng lắp ráp FB<br />
                    FB 조립 방향
                    <span>
                      （photo size：4cm*?cm）
                    </span>

                  </td>
                  <td colspan="2">

                    <div class="drop-zone" @click="triggerFileSelect('fileInputFB1')" @drop.prevent="onDropFB1"
                      @dragover.prevent>
                      <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                      <div v-for="(img, index) in existingFB1" :key="'existing-' + index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="img.url" style="max-width:200px;" />

                        <button @click.stop="removeExistingImageFB1(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <div v-for="(file, index) in imagesetFB1" :key="index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="getObjectURL(file)" alt="업로드된 이미지" style="max-width: 200px; max-height: 300px;" />
                        <button @click.stop="removeImageFB1(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <input ref="fileInputFB1" type="file" accept="image/*" style="display:none"
                        @change="handleFilesChangeFB1" multiple />
                    </div>
                  </td>
                  <!-- <td colspan="2" contenteditable="true" >

                  </td> -->



                  <td class="hcell" colspan="1">
                    Mục chú ý <br />
                    주의사항
                  </td>
                  <!-- <td colspan="3">
                    img
                  </td> -->
                  <td colspan="3">
                    <div class="drop-zone" @click="triggerFileSelect('fileInputFB2')" @drop.prevent="onDropFB2"
                      @dragover.prevent>
                      <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                      <div v-for="(img, index) in existingFB2" :key="'existing-' + index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="img.url" style="max-width:200px;" />

                        <button @click.stop="removeExistingImageFB2(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <div v-for="(file, index) in imagesetFB2" :key="index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="getObjectURL(file)" alt="업로드된 이미지" style="max-width: 200px; max-height: 300px;" />
                        <button @click.stop="removeImageFB2(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <input ref="fileInputFB2" type="file" accept="image/*" style="display:none"
                        @change="handleFilesChangeFB2" multiple />
                    </div>
                  </td>
                </tr>

                <tr>


                  <td class="hcell" colspan="1">
                    F/B#1
                    <br />
                    (Numering)

                  </td>
                  <td colspan="2">
                    <div class="drop-zone" @click="triggerFileSelect('fileInputFB3')" @drop.prevent="onDropFB3"
                      @dragover.prevent>
                      <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                      <div v-for="(img, index) in existingFB3" :key="'existing-' + index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="img.url" style="max-width:200px;" />

                        <button @click.stop="removeExistingImageFB3(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <div v-for="(file, index) in imagesetFB3" :key="index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="getObjectURL(file)" alt="업로드된 이미지" style="max-width: 200px; max-height: 300px;" />
                        <button @click.stop="removeImageFB3(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <input ref="fileInputFB3" type="file" accept="image/*" style="display:none"
                        @change="handleFilesChangeFB3" multiple />
                    </div>
                  </td>
                  <td class="hcell" colspan="1">
                    F/B#2
                    <br />
                    (SPL)
                  </td>
                  <td colspan="3">
                    <div style="display: flex;">
                      <div class="drop-zone" @click="triggerFileSelect('fileInputFB4')" @drop.prevent="onDropFB4"
                        @dragover.prevent>
                        <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                        <div v-for="(img, index) in existingFB4" :key="'existing-' + index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="img.url" style="max-width:200px;" />

                        <button @click.stop="removeExistingImageFB4(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                        <div v-for="(file, index) in imagesetFB4" :key="index"
                          style="position: relative; display: inline-block; margin: 10px;">
                          <img :src="getObjectURL(file)" alt="업로드된 이미지" style="max-width: 200px; max-height: 300px;" />
                          <button @click.stop="removeImageFB4(index)"
                            style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                            ❌
                          </button>
                        </div>
                        <input ref="fileInputFB4" type="file" accept="image/*" style="display:none"
                          @change="handleFilesChangeFB4" multiple />
                      </div>
                      <div style="width: 100%; border:1px solid black" contenteditable="true"
                        @input="e => formDataTemp.fb_2_spl = (e.target as HTMLElement).innerText">
                        {{ formData.fb_2_spl }}
                      </div>
                    </div>


                  </td>
                </tr>


                <tr>
                  <td class="hcell" colspan="1">
                    M/K
                  </td>
                  <td class="hcell" colspan="1">
                    Marking <br />
                    Hình phương hướng<br />
                    <span style="font-size: 8px;">
                      （photo size：3cm*4cm）
                    </span>

                  </td>
                  <td colspan="2">
                    <div class="drop-zone" @click="triggerFileSelect('fileInputMK1')" @drop.prevent="onDropMK1"
                      @dragover.prevent>
                      <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
                      <div v-for="(img, index) in existingMK1" :key="'existing-' + index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="img.url" style="max-width:200px;" />

                        <button @click.stop="removeExistingImageMK1(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <div v-for="(file, index) in imagesetMK1" :key="index"
                        style="position: relative; display: inline-block; margin: 10px;">
                        <img :src="getObjectURL(file)" alt="업로드된 이미지" style="max-width: 200px; max-height: 300px;" />
                        <button @click.stop="removeImageMK1(index)"
                          style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">
                          ❌
                        </button>
                      </div>
                      <input ref="fileInputMK1" type="file" accept="image/*" style="display:none"
                        @change="handleFilesChangeMK1" multiple />
                    </div>
                  </td>
                  <td class="hcell" colspan="1">
                    Mục chú ý <br />
                    주의사항
                  </td>
                  <td colspan="3" contenteditable="true"
                    @input="e => formDataTemp.mk_note = (e.target as HTMLElement).innerText">
                    {{ formData.mk_note }}
                  </td>
                </tr>

                <tr>
                  <td class="hcell" colspan="1">
                    P/D
                  </td>
                  <td class="hcell" colspan="1">
                    Dicing Line Size

                  </td>
                  <td colspan="2" style=" background-color: #f0f9ff;">
                    <el-select v-model="formData.pd_dicing_line_size" placeholder="선택" class="custom-select"
                      style=" height: 100%; ">
                      <el-option v-for="item in columnOptionsMap.pd_dicing_line_size.value" :key="item.value"
                        :label="item.label" :value="item.value" />
                    </el-select>
                  </td>

                  <td class="hcell" colspan="1">
                    Mục chú ý <br />
                    주의사항
                  </td>
                  <td colspan="3" contenteditable="true"
                    @input="e => formDataTemp.pd_note = (e.target as HTMLElement).innerText">
                    {{ formData.pd_note }}
                  </td>
                </tr>



                <tr>
                  <td class="hcell" rowspan="1" colspan="1">
                    E/L
                  </td>
                  <td class="hcell" colspan="1">
                    Cách liên kết JIG<br />
                    연결방식
                  </td>
                  <td colspan="2" contenteditable="true"
                    @input="e => formDataTemp.el_link_method = (e.target as HTMLElement).innerText">
                    {{ formData.el_link_method }}
                  </td>
                  <td class="hcell" colspan="1">
                    EVB Setup Port
                  </td>
                  <td colspan="3" contenteditable="true"
                    @input="e => formDataTemp.el_EVB_setup_port = (e.target as HTMLElement).innerText">
                    {{ formData.el_EVB_setup_port }}
                  </td>

                </tr>


                <tr>
                  <td class="hcell" rowspan="1" colspan="1">
                    Analysis FA
                  </td>
                  <td class="hcell" colspan="1">
                    Item /항목
                  </td>
                  <td colspan="6" contenteditable="true"
                    @input="e => formDataTemp.analysis_fa_item = (e.target as HTMLElement).innerText">
                    {{ formData.analysis_fa_item }}
                  </td>


                </tr>
                <tr>
                  <td class="hcell" rowspan="1" colspan="1">
                    Độ tin cậy <br />
                    신뢰성
                  </td>
                  <td class="hcell" colspan="1">
                    Item /항목
                  </td>
                  <td colspan="6" @input="e => formData.reliability_item = (e.target as HTMLElement).innerText">
                    <el-checkbox :label="'PV'" :true-label="'PV'" :false-label="''" v-model="formData.reliability_item">
                      PV
                    </el-checkbox>
                    <el-checkbox :label="'PRA'" :true-label="'PRA'" :false-label="''"
                      v-model="formData.reliability_item">
                      PRA
                    </el-checkbox>
                    <el-checkbox :label="'PCCB'" :true-label="'PCCB'" :false-label="''"
                      v-model="formData.reliability_item">
                      PCCB
                    </el-checkbox>
                    <el-checkbox :label="'Pre_Condition'" :true-label="'Pre_Condition'" :false-label="''"
                      v-model="formData.reliability_item">
                      Pre.Condition
                    </el-checkbox>
                    <el-checkbox :label="'LTS'" :true-label="'LTS'" :false-label="''"
                      v-model="formData.reliability_item">
                      LTS
                    </el-checkbox>
                    <el-checkbox :label="'HTS'" :true-label="'HTS'" :false-label="''"
                      v-model="formData.reliability_item">
                      HTS
                    </el-checkbox>
                    <el-checkbox :label="'HTHHS'" :true-label="'HTHHS'" :false-label="''"
                      v-model="formData.reliability_item">
                      HTHHS
                    </el-checkbox>
                    <el-checkbox :label="'uHAST'" :true-label="'uHAST'" :false-label="''"
                      v-model="formData.reliability_item">
                      uHAST
                    </el-checkbox>
                    <el-checkbox :label="'Dorp'" :true-label="'Dorp'" :false-label="''"
                      v-model="formData.reliability_item">
                      Dorp
                    </el-checkbox>

                  </td>


                </tr>
                <tr>
                  <td class="hcell">
                    기타<br />
                    Khác
                  </td>

                  <td colspan="2" class="hcell">
                    Did you check CER 0-2?
                  </td>
                  <td colspan="6">
                    <el-checkbox :label="'YES'" :true-label="'YES'" :false-label="''"
                      v-model="formData.others_cer_check">
                      YES
                    </el-checkbox>
                    <el-checkbox :label="'NO'" :true-label="'NO'" :false-label="''" v-model="formData.others_cer_check">
                      NO
                    </el-checkbox>
                  </td>
                </tr>

              </tbody>
            </table>
            <div>
              <span>
                이미지 엑셀 삽입 실사이즈
              </span>
            </div>

            <!-- 이미지 원사이즈 출력 -->
            <div v-for="(file, index) in imagesetFB1" :key="index"
              style="position: relative; display: inline-block; margin: 10px;">
              <div>FB 조립방향 {{ index + 1 }}</div>
              <img :src="getObjectURL(file)" alt="업로드된 이미지" />
            </div>
            <div v-for="(file, index) in imagesetFB2" :key="index"
              style="position: relative; display: inline-block; margin: 10px;">
              <div>F/B주의사항 {{ index + 1 }}</div>
              <img :src="getObjectURL(file)" alt="업로드된 이미지" />
            </div>
            <div v-for="(file, index) in imagesetFB3" :key="index"
              style="position: relative; display: inline-block; margin: 10px;">
              <div>FB#1 NUMBERING {{ index + 1 }}</div>
              <img :src="getObjectURL(file)" alt="업로드된 이미지" />
            </div>
            <div v-for="(file, index) in imagesetFB4" :key="index"
              style="position: relative; display: inline-block; margin: 10px;">
              <div>FB#2 SPL {{ index + 1 }}</div>
              <img :src="getObjectURL(file)" alt="업로드된 이미지" />
            </div>
            <div v-for="(file, index) in imagesetMK1" :key="index"
              style="position: relative; display: inline-block; margin: 10px;">
              <div>M/K Marking{{ index + 1 }}</div>
              <img :src="getObjectURL(file)" alt="업로드된 이미지" />
            </div>

            <div style="width: 100%; margin-top: 30px;">
              <el-button type="primary" style="width: 100%;height: 100px; font-weight: bold; font-size: 34px;"
                @click="handleTempSave">
                SUBMIT<el-icon class="el-icon--right">
                </el-icon>
              </el-button>
            </div>
 
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-form>


  <!-- </div> -->
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, reactive, Ref } from "vue";
import {
  sendApplicationData2,
  downloadSolderApplicationXlsx,
  loadApplicationData,
  getMeasurementLabel,
  updateStatusByUuid,
  updateMeasurement,
} from "./CspRequest";
import { useRoute } from "vue-router";
import inputText from "../../Common/InputText.vue";
import type {
  ApplicationData,
} from "../../../interface/cspRequestFormInterface";
import { handleGetDataByModelCode, dataValidation, handleSubmitForm, getColumnData, handleSubmitTempForm } from '../../../utils/cspRequestFormUtill'

import { cspRequestRules } from "./CspRequestRules";

const props = defineProps<{
  applicationData: ApplicationData;
  applicationType: string;
}>();
const rules = cspRequestRules;

const route = useRoute();

const formData = reactive<ApplicationData>({
  default_modelName: '',
  default_requireName: '',
  default_requireDate: '',
  default_requireAmount: '',
  default_pkgRequirement: '',
  default_productSize: '',
  default_purpose: '',

  system_erp_wafer: '',
  system_erp_pkg: '',
  system_erp_epoxy: '',

  system_mes_wafer: '',
  system_mes_pkg: '',
  system_mes_epoxy: '',

  wafer_chip_size: '',
  wafer_thickness: '',
  wafer_pad_type: '',
  wafer_send_quantity: '',
  wafer_mes_code: '',
  wafer_mark: '',
  wafer_lot_no: '',
  wafer_chip_qty: '',

  pkg_size: '',
  pkg_erp_code: '',
  pkg_meterial: '',
  pkg_note: '',

  epoxy_model: '',
  epoxy_thickness: '',

  bb_ballsize: '',

  bg_thickness: '',
  bg_afterthickness: '',

  dc_meterial: '',
  mk_note: "",

  pd_dicing_line_size: "",
  pd_note: "",

  el_link_method: "",
  el_EVB_setup_port: "",

  analysis_fa_item: "",

  reliability_item: "",
  others_cer_check: "",
  fb_2_spl: ""
})


const formDataTemp = reactive<ApplicationData>({
  default_modelName: '',
  default_requireName: '',
  default_requireDate: '',
  default_requireAmount: '',
  default_pkgRequirement: '',
  default_productSize: '',
  default_purpose: '',

  system_erp_wafer: '',
  system_erp_pkg: '',
  system_erp_epoxy: '',

  system_mes_wafer: '',
  system_mes_pkg: '',
  system_mes_epoxy: '',

  wafer_chip_size: '',
  wafer_thickness: '',
  wafer_pad_type: '',
  wafer_send_quantity: '',
  wafer_mes_code: '',
  wafer_mark: '',
  wafer_lot_no: '',
  wafer_chip_qty: '',

  pkg_size: '',
  pkg_erp_code: '',
  pkg_meterial: '',
  pkg_note: '',

  epoxy_model: '',
  epoxy_thickness: '',

  bb_ballsize: '',

  bg_thickness: '',
  bg_afterthickness: '',

  dc_meterial: '',
  mk_note: "",

  pd_dicing_line_size: "",
  pd_note: "",

  el_link_method: "",
  el_EVB_setup_port: "",

  analysis_fa_item: "",

  reliability_item: "",
  others_cer_check: "",
  fb_2_spl: ""
})

const resultReq = reactive({

  fbasecode: "",
  fpkgcode: "",
  fepoxycode: "",
  fmname: "",
  fpkgpartnumber: "",
  fepoxymodel: "",
  fchipsize: "",
  fwthickness: '',
  fwcop: '',
  fbasechipea: '',
  fassyname: '',
  fcnt: '',
  fbumpboll: "",
})

const loading = ref(true);
const application = ref<ApplicationData>();

const modelCell = ref<HTMLElement | null>(null);
const username = ref('');
const today = ref('');
const todayDate = new Date();

const fileInputFB1 = ref<HTMLInputElement | null>(null);
const fileInputFB2 = ref<HTMLInputElement | null>(null);
const fileInputFB3 = ref<HTMLInputElement | null>(null);
const fileInputFB4 = ref<HTMLInputElement | null>(null);
const fileInputMK1 = ref<HTMLInputElement | null>(null);
const existingFB1 = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const existingFB2 = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const existingFB3 = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const existingFB4 = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const existingMK1 = ref<{ url: string; file_index: string; cell_name: string }[]>([]);
const deleteImage = ref<{ url: string; file_index: string; cell_name: string }[]>([]);

const imagesetFB1 = ref<File[]>([]);
const imagesetFB2 = ref<File[]>([]);
const imagesetFB3 = ref<File[]>([]);
const imagesetFB4 = ref<File[]>([]);
const imagesetMK1 = ref<File[]>([]);

const selectedLots = ref<string[]>([]);

interface OptionItem {
  value: string
  label: string
}


const columnOptionsMap: Record<string, Ref<OptionItem[]>> = {
  pkg_meterial: ref([]),
  epoxy_model: ref([]),
  epoxy_thickness: ref([]),
  bg_thickness: ref([]),
  bg_afterthickness: ref([]),
  dc_meterial: ref([]),
  default_productSize: ref([]),
  pd_dicing_line_size: ref([]),
  wafer_pad_type: ref([])
}

// const columnOptionsMap = reactive({
//   pkg_meterial: ref([]),
//   epoxy_model: ref([]),
//   bg_thickness: ref([]),
//   bg_afterthickness: ref([]),
//   default_productSize: ref([]),
//   pd_dicing_line_size: ref([]),
// })

const imageUrl = ref<string | null>(null);

function handleFilesChangeFB1(e: Event) {
  onFilesChange(e, imagesetFB1);
}
function handleFilesChangeFB2(e: Event) {
  onFilesChange(e, imagesetFB2);
}
function handleFilesChangeFB3(e: Event) {
  onFilesChange(e, imagesetFB3);
}

function handleFilesChangeFB4(e: Event) {
  onFilesChange(e, imagesetFB4);
}

function handleFilesChangeMK1(e: Event) {
  onFilesChange(e, imagesetMK1);
}

function removeImageFB1(index: number) {
  imagesetFB1.value.splice(index, 1);
}
function removeImageFB2(index: number) {
  imagesetFB2.value.splice(index, 1);
} function removeImageFB3(index: number) {
  imagesetFB3.value.splice(index, 1);
} function removeImageFB4(index: number) {
  imagesetFB4.value.splice(index, 1);
} function removeImageMK1(index: number) {
  imagesetMK1.value.splice(index, 1);
}
function removeExistingImageFB1(index: number) {
  const target = existingFB1.value[index];  
  if (target) {
    deleteImage.value.push(target);         
    existingFB1.value.splice(index, 1);     
  }
}
function removeExistingImageFB2(index: number) {
  const target = existingFB2.value[index];  
  if (target) {
    deleteImage.value.push(target);         
    existingFB2.value.splice(index, 1);     
  }
}
function removeExistingImageFB3(index: number) {
  const target = existingFB3.value[index];  
  if (target) {
    deleteImage.value.push(target);         
    existingFB3.value.splice(index, 1);     
  }
}
function removeExistingImageFB4(index: number) {
  const target = existingFB4.value[index];  
  if (target) {
    deleteImage.value.push(target);         
    existingFB4.value.splice(index, 1);     
  }
}
function removeExistingImageMK1(index: number) {
  const target = existingMK1.value[index];  
  if (target) {
    deleteImage.value.push(target);         
    existingMK1.value.splice(index, 1);     
  }
}



function getObjectURL(file: File): string {
  return URL.createObjectURL(file)
}


// 파일 선택창 열기
function triggerFileSelect(target: 'fileInputFB1' | 'fileInputFB2' | 'fileInputFB3' | 'fileInputFB4' | 'fileInputMK1') {
  if (target === 'fileInputFB1') fileInputFB1.value?.click();
  if (target === 'fileInputFB2') fileInputFB2.value?.click();
  if (target === 'fileInputFB3') fileInputFB3.value?.click();
  if (target === 'fileInputFB4') fileInputFB4.value?.click();
  if (target === 'fileInputMK1') fileInputMK1.value?.click();
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


function handleSubmitButtton() {
  if (!dataValidation(formData)) {
    return;
  }
  console.log("formData----=====>", formData);
  mappingTemp()
  console.log(formData)
  handleSubmitForm(formData, imagesetFB1.value, imagesetFB2.value, imagesetFB3.value, imagesetFB4.value, imagesetMK1.value);
}

function handleTempSave() {
  if (formData.default_modelName === '') {
    alert('저장할 기종명이 존재하지 않습니다.')
    return;
  }
  mappingTemp()
  console.log("saving..")
  handleSubmitTempForm(formData, imagesetFB1.value, imagesetFB2.value, imagesetFB3.value, imagesetFB4.value, imagesetMK1.value, deleteImage.value);
}
function mappingTemp() {
  formData.default_requireAmount = formDataTemp.default_requireAmount
  formData.default_pkgRequirement = formDataTemp.default_pkgRequirement
  formData.wafer_mark = formDataTemp.wafer_mark
  formData.pkg_size = formDataTemp.pkg_size
  formData.pkg_note = formDataTemp.pkg_note
  formData.fb_2_spl = formDataTemp.fb_2_spl
  formData.mk_note = formDataTemp.mk_note
  formData.pd_note = formDataTemp.pd_note
  formData.el_link_method = formDataTemp.el_link_method
  formData.el_EVB_setup_port = formDataTemp.el_EVB_setup_port
  formData.analysis_fa_item = formDataTemp.analysis_fa_item
}


function onDropFB1(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (!files) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith("image/")) {

      imagesetFB1.value.push(file);

    } else {
      alert("이미지 파일만 업로드할 수 있습니다.");
    }
  }
}

function onDropFB2(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (!files) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith("image/")) {
      imagesetFB2.value.push(file);

    } else {
      alert("이미지 파일만 업로드할 수 있습니다.");
    }
  }
}
function onDropFB3(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (!files) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith("image/")) {
      imagesetFB3.value.push(file);
    } else {
      alert("이미지 파일만 업로드할 수 있습니다.");
    }
  }
}
function onDropFB4(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (!files) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith("image/")) {
      imagesetFB4.value.push(file);
    } else {
      alert("이미지 파일만 업로드할 수 있습니다.");
    }
  }
}
function onDropMK1(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (!files) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith("image/")) {
      imagesetMK1.value.push(file);
    } else {
      alert("이미지 파일만 업로드할 수 있습니다.");
    }
  }
}
const wafer_lot_no_opt = computed(() =>
  Array.from(
    new Set(
      formData.wafer_lot_no
        .split(',')
        .map(item => item.trim())
        .filter(item => item)
    )
  )
)

onMounted(async () => {
  const product_name = route.params.productName as string
  await handleEnter(product_name)

  const columnlist = await getColumnData();


  application.value = props.applicationData;
  username.value = localStorage.getItem('ms_username') || 'Guest';

  // 날짜 포맷 YYYY-MM-DD
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, '0');
  const date = String(todayDate.getDate()).padStart(2, '0');

  today.value = `${year}-${month}-${date}`;

  loading.value = false;
  // formData.default_requireName = username.value;
  formData.default_requireDate = today.value;


  type ColumnKey = keyof typeof columnOptionsMap;

  for (const key in columnOptionsMap) {
    const columnKey = key as ColumnKey;

    columnOptionsMap[columnKey].value = columnlist
      .filter(item => item.column_name === columnKey)
      .map(item => ({
        value: item.column_value,
        label: item.column_value
      }));
  }
});


async function handleEnter(value) {
  // const value = modelCell.value?.innerText.trim() || "";
  // const username = ref(localStorage.getItem('ms_username'));
  const req = await handleGetDataByModelCode(value);
  console.log(req.image_List);
  if (req.default_modelName === 'false') {
    alert(value + " NOT FOUND");
    return;
  }

  // 여기서 필요한 처리 수행 (예: 저장, API 호출 등)


  formData.default_modelName = req.default_modelName;
  formData.default_requireName = req.default_requireName;
  formData.default_requireDate = req.default_requireDate;
  formData.default_requireAmount = req.default_requireAmount;
  formData.default_pkgRequirement = req.default_pkgRequirement;
  formData.default_productSize = req.default_productSize;
  formData.default_purpose = req.default_purpose;

  formData.system_erp_wafer = req.system_erp_wafer;
  formData.system_erp_pkg = req.system_erp_pkg;
  formData.system_erp_epoxy = req.system_erp_epoxy;

  formData.system_mes_wafer = req.system_mes_wafer;
  formData.system_mes_pkg = req.system_mes_pkg;
  formData.system_mes_epoxy = req.system_mes_epoxy;

  formData.wafer_chip_size = req.wafer_chip_size;
  formData.wafer_thickness = req.wafer_thickness;
  formData.wafer_pad_type = req.wafer_pad_type;
  formData.wafer_send_quantity = req.wafer_send_quantity;
  formData.wafer_mes_code = req.wafer_mes_code;
  formData.wafer_mark = req.wafer_mark;
  formData.wafer_lot_no = req.wafer_lot_no;
  formData.wafer_chip_qty = req.wafer_chip_qty;

  formData.pkg_size = req.pkg_size;
  formData.pkg_erp_code = req.pkg_erp_code;
  formData.pkg_meterial = req.pkg_meterial;
  formData.pkg_note = req.pkg_note;

  formData.epoxy_model = req.epoxy_model;
  formData.epoxy_thickness = req.epoxy_thickness;

  formData.bb_ballsize = req.bb_ballsize;

  formData.bg_thickness = req.bg_thickness;
  formData.bg_afterthickness = req.bg_afterthickness;
  formData.dc_meterial = req.dc_meterial;
  formData.mk_note = req.mk_note;
  formData.pd_dicing_line_size = req.pd_dicing_line_size;
  formData.pd_note = req.pd_note;
  formData.el_link_method = req.el_link_method;
  formData.el_EVB_setup_port = req.el_EVB_setup_port;
  formData.analysis_fa_item = req.analysis_fa_item;
  formData.reliability_item = req.reliability_item;
  formData.others_cer_check = req.others_cer_check;
  formData.fb_2_spl = req.fb_2_spl;

  formData.default_modelName = req.default_modelName
  formData.default_purpose = req.default_purpose
  formData.default_requireName = req.default_requireName

  formData.wafer_lot_no = req.wafer_lot_no
  formData.system_erp_wafer = req.system_erp_wafer
  formData.system_erp_pkg = req.system_erp_pkg
  formData.system_erp_epoxy = req.system_erp_epoxy
  formData.system_mes_wafer = req.system_mes_wafer
  formData.system_mes_pkg = req.system_mes_pkg
  formData.system_mes_epoxy = req.system_mes_epoxy
  formData.wafer_mes_code = req.system_mes_wafer
  formData.pkg_erp_code = req.system_erp_pkg

  formData.wafer_chip_qty = req.wafer_chip_qty 
  formData.wafer_send_quantity = req.wafer_send_quantity
  formData.wafer_chip_size = req.wafer_chip_size
  formData.wafer_thickness = req.wafer_thickness
  formData.bb_ballsize = req.bb_ballsize
  formData.default_productSize = req.default_productSize

  formDataTemp.default_requireAmount= formData.default_requireAmount
  formDataTemp.default_pkgRequirement= formData.default_pkgRequirement
  formDataTemp.wafer_mark= formData.wafer_mark
  formDataTemp.pkg_size= formData.pkg_size
  formDataTemp.pkg_note= formData.pkg_note
  formDataTemp.fb_2_spl= formData.fb_2_spl
  formDataTemp.mk_note= formData.mk_note
  formDataTemp.pd_note= formData.pd_note
  formDataTemp.el_link_method= formData.el_link_method
  formDataTemp.el_EVB_setup_port= formData.el_EVB_setup_port
  formDataTemp.analysis_fa_item= formData.analysis_fa_item

  // image seting
  if (req.image_List && req.image_List.length > 0) {
    req.image_List.forEach((item) => {
      if (item.cell_name === 'FB1') {
        existingFB1.value.push(item);
      } else if (item.cell_name === 'FB2') {
        existingFB2.value.push(item);
      } else if (item.cell_name === 'FB3') {
        existingFB3.value.push(item);
      } else if (item.cell_name === 'FB4') {
        existingFB4.value.push(item);
      } else if (item.cell_name === 'MK1') {
        existingMK1.value.push(item);
      }
    });
  }


  // Object.assign(resultReq, req[0])
  // console.log(req[0]);
  // formData.system_erp_wafer = req[0].fbasecode
  // formData.system_erp_pkg = req[0].fpkgcode
  // formData.system_erp_epoxy = req[0].fepoxycode

  // formData.system_mes_wafer = req[0].fmname
  // formData.system_mes_pkg = req[0].fpkgpartnumber
  // formData.system_mes_epoxy = req[0].fepoxymodel


  // formData.wafer_chip_size = req[0].fchipsize
  // formData.wafer_thickness = req[0].fwcop + req[0].fwthickness
  // formData.wafer_pad_type = "-"
  // formData.wafer_chip_qty = req[0].fbasechipea
  // formData.wafer_mes_code = req[0].fbasecode
  // formData.wafer_mark = req[0].fassyname
  // formData.wafer_chip_qty = req[0].fchipsize + "*" + req[0].fcnt
  // formData.pkg_size = ''
  // formData.pkg_erp_code = req[0].fpkgcode
  // formData.bb_ballsize = ''
}

const selectedOption = ref('')
const othersCerOption = ref('')

const formDataa = reactive({
  notes: [] as Array<{ text: string }>,
});

function addNoteField() {
  formDataa.notes.push({ text: '' });
}

function onNoteTextChange(e: Event, index: number) {
  const target = e.target as HTMLElement;
  formDataa.notes[index].text = target.innerText;
}


</script>

<script lang="ts">
export default {};
</script>

<style scoped>
@import "../../../assets/style/cspRequest.css";
</style>




<!-- 
  API NOTE
    10.20.10.128

    "fbasecode": "WSG42AA50T00",
    "fpkgcode": "MG41W9A50CD",
    "fepoxycode": "0103W00C23N",


    "fmname": "TSG42AA5002C",
    "fpkgpartnumber": "A5-C",
    "fepoxypurpose": "230",

-->

<!-- 
  먼저 formDataTemp에 저장후 formData 로 이동 안그럼 content 모씀

-->
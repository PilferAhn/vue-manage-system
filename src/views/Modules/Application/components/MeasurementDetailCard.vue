<template>
      <el-card
        shadow="never"
        class="grid-card detail-slot-card"
        :class="{ 'drag-over-card': dragOverIndex === index }"
        @dragover.prevent="$emit('drag-over', index)"
        @drop.prevent="$emit('drop', index)"
      >
        <template #header>
          <div class="detail-card-header">
            <div class="detail-card-title">
              {{ `${index + 1}. ${slot.label}` }}
            </div>

            <div
              class="drag-handle"
              draggable="true"
              title="드래그하여 순서 변경"
              @dragstart="$emit('drag-start', slot.key)"
              @dragend="$emit('drag-end')"
            >
              ⠿
            </div>
          </div>
        </template>
          <el-form label-position="top">
            <!-- 1. Setup -->
            <template v-if="slot.key === 'setup'">
              <el-form-item label="Vendor">
                <el-radio-group v-model="measurementForms.setup.vendor">
                  <el-radio label="KEYSIGHT">Keysight</el-radio>
                  <el-radio label="ROHDE">Rohde</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Deembedding">
                <el-radio-group v-model="measurementForms.setup.deembedding">
                  <el-radio label="ALL">ALL</el-radio>
                  <el-radio label="ON">ON</el-radio>
                  <el-radio label="OFF">OFF</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Port Extension">
                <el-radio-group v-model="measurementForms.setup.portExtension">
                  <el-radio label="ALL">ALL</el-radio>
                  <el-radio label="ON">ON</el-radio>
                  <el-radio label="OFF">OFF</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="특이사항(SPL)">
                <el-input
                  v-model="measurementForms.setup.noteSpl"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>

              <el-form-item label="특이사항(측정)">
                <el-input
                  v-model="measurementForms.setup.noteMeasurement"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
              <LinksInput :form="measurementForms.setup" measurement-key="setup" />

              <el-form-item label="완료 요청일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 요청일"
                  v-model="measurementForms.setup.requestedDueDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="완료 예정일(측정자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 예정일"
                  v-model="measurementForms.setup.expectedDoneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="측정자">
                <el-input
                  v-model="measurementForms.setup.measurer"
                  placeholder="측정자 입력"
                />
              </el-form-item>

              <el-form-item label="결과 파일 링크">
                <el-input v-model="measurementForms.setup.resultFileLink" />
              </el-form-item>

              <el-form-item label="완료일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료일"
                  v-model="measurementForms.setup.doneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>
            </template>

            <!-- 2. NA -->
            <template v-else-if="slot.key === 'na'">
              <el-form-item label="Deembedding">
                <el-radio-group v-model="measurementForms.na.deembedding">
                  <el-radio label="ALL">ALL</el-radio>
                  <el-radio label="ON">ON</el-radio>
                  <el-radio label="OFF">OFF</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Port Extension">
                <el-radio-group v-model="measurementForms.na.portExtension">
                  <el-radio label="ALL">ALL</el-radio>
                  <el-radio label="ON">ON</el-radio>
                  <el-radio label="OFF">OFF</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Matching">
                <el-radio-group v-model="measurementForms.na.matching">
                  <el-radio label="ALL">ALL</el-radio>
                  <el-radio label="ON">ON</el-radio>
                  <el-radio label="OFF">OFF</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Mold">
                <el-radio-group v-model="measurementForms.na.mold">
                  <el-radio label="ALL">ALL</el-radio>
                  <el-radio label="NO_MOLD">No Mold</el-radio>
                  <el-radio label="MOLD">Mold</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Jig / Soldering">
                <el-radio-group v-model="measurementForms.na.jigSoldering">
                  <el-radio label="JIG">Jig</el-radio>
                  <el-radio label="SOLDERING">Soldering</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="EVB Tuning">
                <el-checkbox v-model="measurementForms.na.evbTuning">
                  사용
                </el-checkbox>
              </el-form-item>

              <el-form-item label="Appendix">
                <el-checkbox v-model="measurementForms.na.appendix">
                  사용
                </el-checkbox>
              </el-form-item>

              <el-form-item label="특이사항(SPL)">
                <el-input
                  v-model="measurementForms.na.noteSpl"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>

              <el-form-item label="특이사항(측정)">
                <el-input
                  v-model="measurementForms.na.noteMeasurement"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
              <LinksInput :form="measurementForms.na" measurement-key="na" />

              <el-form-item label="완료 요청일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 요청일"
                  v-model="measurementForms.na.requestedDueDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="완료 예정일(측정자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 예정일"
                  v-model="measurementForms.na.expectedDoneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="측정자">
                <el-input
                  v-model="measurementForms.na.measurer"
                  placeholder="측정자 입력"
                />
              </el-form-item>

              <el-form-item label="결과 파일 링크">
                <el-input v-model="measurementForms.na.resultFileLink" />
              </el-form-item>

              <el-form-item label="완료일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료일"
                  v-model="measurementForms.na.doneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>
            </template>

            <!-- 3. NF -->
            <template v-else-if="slot.key === 'nf'">
              <el-form-item label="Board Type">
                <el-radio-group v-model="measurementForms.nf.boardType">
                  <el-radio label="IDEAL_BOARD">Ideal Board</el-radio>
                  <el-radio label="REAL_BOARD">Real Board</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Mold">
                <el-radio-group v-model="measurementForms.nf.mold">
                  <el-radio label="ALL">ALL</el-radio>
                  <el-radio label="NO_MOLD">No Mold</el-radio>
                  <el-radio label="MOLD">Mold</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Appendix">
                <el-checkbox v-model="measurementForms.nf.appendix">
                  사용
                </el-checkbox>
              </el-form-item>

              <el-form-item label="특이사항(SPL)">
                <el-input
                  v-model="measurementForms.nf.noteSpl"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>

              <el-form-item label="특이사항(측정)">
                <el-input
                  v-model="measurementForms.nf.noteMeasurement"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
              <LinksInput :form="measurementForms.nf" measurement-key="nf" />

              <el-form-item label="완료 요청일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 요청일"
                  v-model="measurementForms.nf.requestedDueDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="완료 예정일(측정자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 예정일"
                  v-model="measurementForms.nf.expectedDoneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="측정자">
                <el-input
                  v-model="measurementForms.nf.measurer"
                  placeholder="측정자 입력"
                />
              </el-form-item>

              <el-form-item label="결과 파일 링크">
                <el-input v-model="measurementForms.nf.resultFileLink" />
              </el-form-item>

              <el-form-item label="완료일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료일"
                  v-model="measurementForms.nf.doneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>
            </template>

            <!-- 4. MWA -->
            <template v-else-if="slot.key === 'mwa'">
              <el-form-item label="Matching">
                <el-radio-group v-model="measurementForms.mwa.matching">
                  <el-radio label="ALL">ALL</el-radio>
                  <el-radio label="ON">ON</el-radio>
                  <el-radio label="OFF">OFF</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Loss">
                <el-radio-group v-model="measurementForms.mwa.loss">
                  <el-radio label="ALL">ALL</el-radio>
                  <el-radio label="ON">ON</el-radio>
                  <el-radio label="OFF">OFF</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="특이사항(SPL)">
                <el-input
                  v-model="measurementForms.mwa.noteSpl"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>

              <el-form-item label="특이사항(측정)">
                <el-input
                  v-model="measurementForms.mwa.noteMeasurement"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
              <LinksInput :form="measurementForms.mwa" measurement-key="mwa" />

              <el-form-item label="완료 요청일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 요청일"
                  v-model="measurementForms.mwa.requestedDueDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="완료 예정일(측정자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 예정일"
                  v-model="measurementForms.mwa.expectedDoneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="측정자">
                <el-input
                  v-model="measurementForms.mwa.measurer"
                  placeholder="측정자 입력"
                />
              </el-form-item>

              <el-form-item label="결과 파일 링크">
                <el-input v-model="measurementForms.mwa.resultFileLink" />
              </el-form-item>

              <el-form-item label="완료일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료일"
                  v-model="measurementForms.mwa.doneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>
            </template>

            <!-- 5. CA -->
            <template v-else-if="slot.key === 'ca'">
              <el-form-item label="Trace">
                <el-input v-model="measurementForms.ca.trace" />
              </el-form-item>

              <el-form-item label="Power">
                <el-input v-model="measurementForms.ca.power" />
              </el-form-item>

              <el-form-item label="Freq Start">
                <el-input v-model="measurementForms.ca.freqStart" />
              </el-form-item>

              <el-form-item label="Freq Stop">
                <el-input v-model="measurementForms.ca.freqStop" />
              </el-form-item>

              <el-form-item label="Average">
                <el-input v-model="measurementForms.ca.average" />
              </el-form-item>

              <el-form-item label="Point">
                <el-input v-model="measurementForms.ca.point" />
              </el-form-item>

              <el-form-item label="특이사항(SPL)">
                <el-input
                  v-model="measurementForms.ca.noteSpl"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>

              <el-form-item label="특이사항(측정)">
                <el-input
                  v-model="measurementForms.ca.noteMeasurement"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
              <LinksInput :form="measurementForms.ca" measurement-key="ca" />

              <el-form-item label="완료 요청일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 요청일"
                  v-model="measurementForms.ca.requestedDueDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="완료 예정일(측정자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 예정일"
                  v-model="measurementForms.ca.expectedDoneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="측정자">
                <el-input
                  v-model="measurementForms.ca.measurer"
                  placeholder="측정자 입력"
                />
              </el-form-item>

              <el-form-item label="결과 파일 링크">
                <el-input v-model="measurementForms.ca.resultFileLink" />
              </el-form-item>

              <el-form-item label="완료일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료일"
                  v-model="measurementForms.ca.doneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>
            </template>

            <!-- 6. TCF -->
            <template v-else-if="slot.key === 'tcf'">
              <el-form-item label="온도 순서">
                <el-input v-model="measurementForms.tcf.temperatureSequence" />
              </el-form-item>

              <el-form-item label="Matching">
                <el-radio-group v-model="measurementForms.tcf.matching">
                  <el-radio label="ALL">ALL</el-radio>
                  <el-radio label="ON">ON</el-radio>
                  <el-radio label="OFF">OFF</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Jig / Soldering">
                <el-radio-group v-model="measurementForms.tcf.jigSoldering">
                  <el-radio label="JIG">Jig</el-radio>
                  <el-radio label="SOLDERING">Soldering</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="특이사항(SPL)">
                <el-input
                  v-model="measurementForms.tcf.noteSpl"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>

              <el-form-item label="특이사항(측정)">
                <el-input
                  v-model="measurementForms.tcf.noteMeasurement"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
              <LinksInput :form="measurementForms.tcf" measurement-key="tcf" />

              <el-form-item label="완료 요청일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 요청일"
                  v-model="measurementForms.tcf.requestedDueDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="완료 예정일(측정자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 예정일"
                  v-model="measurementForms.tcf.expectedDoneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="측정자">
                <el-input
                  v-model="measurementForms.tcf.measurer"
                  placeholder="측정자 입력"
                />
              </el-form-item>

              <el-form-item label="결과 파일 링크">
                <el-input v-model="measurementForms.tcf.resultFileLink" />
              </el-form-item>

              <el-form-item label="완료일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료일"
                  v-model="measurementForms.tcf.doneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>
            </template>

            <!-- 7. 비선형 측정 -->
            <template v-else-if="slot.key === 'nonlinear'">
              <div class="nonlinear-type-button-row">
                <el-button
                  v-for="item in nonlinearOptions"
                  :key="item.key"
                  :type="
                    measurementForms.nonlinear.selectedTypes.includes(item.key)
                      ? 'primary'
                      : 'default'
                  "
                  @click="$emit('nonlinear-toggle', item.key)"
                >
                  {{ item.label }}
                </el-button>
              </div>

              <el-empty
                v-if="!measurementForms.nonlinear.selectedTypes.length"
                description="비선형 측정 세부 항목을 선택해주세요."
              />

              <div
                v-if="measurementForms.nonlinear.selectedTypes.includes('imd')"
                class="nonlinear-sub-section"
              >
                <div class="nonlinear-sub-title">IMD</div>

                <el-form-item label="측정 Band">
                  <el-input v-model="measurementForms.nonlinear.imdBand" />
                </el-form-item>

                <el-form-item label="Input Power">
                  <el-input v-model="measurementForms.nonlinear.imdInputPower" />
                </el-form-item>

                <el-form-item label="Fjam Power">
                  <el-input v-model="measurementForms.nonlinear.imdFjamPower" />
                </el-form-item>
              </div>

              <div
                v-if="measurementForms.nonlinear.selectedTypes.includes('p1db')"
                class="nonlinear-sub-section"
              >
                <div class="nonlinear-sub-title">P1dB</div>

                <el-form-item label="측정 Band">
                  <el-input v-model="measurementForms.nonlinear.p1dbBand" />
                </el-form-item>

                <el-form-item label="Gain_Bias Address">
                  <el-input v-model="measurementForms.nonlinear.p1dbGainBiasAddress" />
                </el-form-item>
              </div>

              <div
                v-if="measurementForms.nonlinear.selectedTypes.includes('iip3')"
                class="nonlinear-sub-section"
              >
                <div class="nonlinear-sub-title">IIP3</div>

                <el-form-item label="측정 Band">
                  <el-input v-model="measurementForms.nonlinear.iip3Band" />
                </el-form-item>

                <el-form-item label="Gain_Bias Address">
                  <el-input v-model="measurementForms.nonlinear.iip3GainBiasAddress" />
                </el-form-item>

                <el-form-item label="Fjam Power">
                  <el-input v-model="measurementForms.nonlinear.iip3FjamPower" />
                </el-form-item>
              </div>

              <div
                v-if="measurementForms.nonlinear.selectedTypes.includes('rse')"
                class="nonlinear-sub-section"
              >
                <div class="nonlinear-sub-title">RSE</div>

                <el-form-item label="RSE 주파수">
                  <el-input
                    v-model="measurementForms.nonlinear.rseFrequency"
                    placeholder="입력 레벨 변동 시"
                  />
                </el-form-item>
              </div>

              <div
                v-if="measurementForms.nonlinear.selectedTypes.includes('harmonic')"
                class="nonlinear-sub-section"
              >
                <div class="nonlinear-sub-title">Harmonic</div>

                <el-form-item label="측정 Band">
                  <el-input v-model="measurementForms.nonlinear.harmonicBand" />
                </el-form-item>

                <el-form-item label="Input Power">
                  <el-input v-model="measurementForms.nonlinear.harmonicInputPower" />
                </el-form-item>

                <el-form-item label="측정 고조파 차수">
                  <el-input v-model="measurementForms.nonlinear.harmonicOrder" />
                </el-form-item>

                <el-form-item label="측정 단위">
                  <el-radio-group v-model="measurementForms.nonlinear.harmonicUnit">
                    <el-radio label="dBc">dBc</el-radio>
                    <el-radio label="dBm">dBm</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>

              <el-form-item label="특이사항(SPL)">
                <el-input
                  v-model="measurementForms.nonlinear.noteSpl"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>

              <el-form-item label="특이사항(측정)">
                <el-input
                  v-model="measurementForms.nonlinear.noteMeasurement"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
              <LinksInput :form="measurementForms.nonlinear" measurement-key="nonlinear" />

              <el-form-item label="완료 요청일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 요청일"
                  v-model="measurementForms.nonlinear.requestedDueDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="완료 예정일(측정자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 예정일"
                  v-model="measurementForms.nonlinear.expectedDoneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="측정자">
                <el-input
                  v-model="measurementForms.nonlinear.measurer"
                  placeholder="측정자 입력"
                />
              </el-form-item>

              <el-form-item label="결과 파일 링크">
                <el-input
                  v-model="measurementForms.nonlinear.resultFileLink"
                />
              </el-form-item>

              <el-form-item label="완료일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료일"
                  v-model="measurementForms.nonlinear.doneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>
            </template>

            <!-- 8. Probe 측정 SPL -->
            <template v-else-if="slot.key === 'probeSpl'">
              <el-form-item label="샘플 종류">
                 <el-radio-group v-model="measurementForms.probeSpl.sampleType">
                  <el-radio label="NO_MOLD">No-Mold</el-radio>
                  <el-radio label="BTM_MOLD">BTM_MOLD</el-radio>
                  <el-radio label="MOLD_MIPI_READ">Mold MIPI Read</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="Freq Start [MHz]">
                <el-input v-model="measurementForms.probeSpl.freqStart" />
              </el-form-item>

              <el-form-item label="Freq Stop [MHz]">
                <el-input v-model="measurementForms.probeSpl.freqStop" />
              </el-form-item>

              <el-form-item label="Pitch">
                <el-radio-group v-model="measurementForms.probeSpl.pitch">
                  <el-radio label="450">450</el-radio>
                  <el-radio label="150">150</el-radio>
                  <el-radio label="1390">1390</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Step / Point (MAX : 20001)">
                <el-input v-model="measurementForms.probeSpl.stepPoint" />
              </el-form-item>
              
              <el-form-item label="Power / IFBW">
                <el-input
                  v-model="measurementForms.probeSpl.powerIfbw"
                  placeholder="예: 10 / 4"
                />
              </el-form-item>

              <el-form-item label="GS/GSG">
                <el-radio-group
                  v-model="measurementForms.probeSpl.gsType"
                >
                  <el-radio label="GS">
                    GS/SG
                  </el-radio>
                
                  <el-radio label="GSG">
                    GSG
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="특이사항(SPL)">
                <el-input
                  v-model="measurementForms.probeSpl.noteSpl"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>

              <el-form-item label="특이사항(측정)">
                <el-input
                  v-model="measurementForms.probeSpl.noteMeasurement"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
              <LinksInput :form="measurementForms.probeSpl" measurement-key="probeSpl" />

              <el-form-item label="완료 요청일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 요청일"
                  v-model="measurementForms.probeSpl.requestedDueDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="완료 예정일(측정자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 예정일"
                  v-model="measurementForms.probeSpl.expectedDoneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="측정자">
                <el-input
                  v-model="measurementForms.probeSpl.measurer"
                  placeholder="측정자 입력"
                />
              </el-form-item>

              <el-form-item label="결과 파일 링크">
                <el-input v-model="measurementForms.probeSpl.resultFileLink" />
              </el-form-item>

              <el-form-item label="완료일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료일"
                  v-model="measurementForms.probeSpl.doneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>
            </template>

            <!-- 9. Probe 측정 Deembedding -->
            <template v-else-if="slot.key === 'probeDeembedding'">
              <el-form-item label="EVB 정보">
                <el-input
                  v-model="measurementForms.probeDeembedding.evbInfo"
                />
              </el-form-item>

              <el-form-item label="Freq Start [MHz]">
                <el-input
                  v-model="measurementForms.probeDeembedding.freqStart"
                />
              </el-form-item>

              <el-form-item label="Freq Stop [MHz]">
                <el-input
                  v-model="measurementForms.probeDeembedding.freqStop"
                />
              </el-form-item>

              <el-form-item label="Pitch">
                <el-radio-group v-model="measurementForms.probeDeembedding.pitch">
                  <el-radio label="450">450</el-radio>
                  <el-radio label="150">150</el-radio>
                  <el-radio label="1390">1390</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Step / Point (MAX : 20001)">
                <el-input
                  v-model="measurementForms.probeDeembedding.stepPoint"
                />
              </el-form-item>
              
              <el-form-item label="Power / IFBW">
                <el-input
                  v-model="measurementForms.probeDeembedding.powerIfbw"
                  placeholder="예: 10 / 4"
                />
              </el-form-item>

              <el-form-item label="GS/GSG">
                <el-radio-group
                  v-model="measurementForms.probeDeembedding.gsType"
                >
                  <el-radio label="GS">
                    GS/SG
                  </el-radio>
                
                  <el-radio label="GSG">
                    GSG
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="특이사항(SPL)">
                <el-input
                  v-model="measurementForms.probeDeembedding.noteSpl"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>

              <el-form-item label="특이사항(측정)">
                <el-input
                  v-model="measurementForms.probeDeembedding.noteMeasurement"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
              <LinksInput :form="measurementForms.probeDeembedding" measurement-key="probeDeembedding" />

              <el-form-item label="완료 요청일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 요청일"
                  v-model="measurementForms.probeDeembedding.requestedDueDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="완료 예정일(측정자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 예정일"
                  v-model="measurementForms.probeDeembedding.expectedDoneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="측정자">
                <el-input
                  v-model="measurementForms.probeDeembedding.measurer"
                  placeholder="측정자 입력"
                />
              </el-form-item>

              <el-form-item label="결과 파일 링크">
                <el-input
                  v-model="
                    measurementForms.probeDeembedding.resultFileLink
                  "
                />
              </el-form-item>

              <el-form-item label="완료일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료일"
                  v-model="measurementForms.probeDeembedding.doneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>
            </template>

            <!-- 10. EVB 조립 -->
            <template v-else-if="slot.key === 'evbAssembly'">
    
              <el-form-item label="의뢰서 Link">
                <el-input
                  v-model="measurementForms.evbAssembly.requestLink"
                />
              </el-form-item>

              <el-form-item label="특이사항(SPL)">
                <el-input
                  v-model="measurementForms.evbAssembly.noteSpl"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>

              <el-form-item label="특이사항(측정)">
                <el-input
                  v-model="measurementForms.evbAssembly.noteMeasurement"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>

              <el-form-item label="완료 요청일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 요청일"
                  v-model="measurementForms.evbAssembly.requestedDueDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="완료 예정일(측정자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료 예정일"
                  v-model="measurementForms.evbAssembly.expectedDoneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>

              <el-form-item label="측정자">
                <el-input
                  v-model="measurementForms.evbAssembly.measurer"
                  placeholder="측정자 입력"
                />
              </el-form-item>

              <el-form-item label="결과 파일 링크">
                <el-input
                  v-model="measurementForms.evbAssembly.resultFileLink"
                />
              </el-form-item>

              <el-form-item label="완료일(의뢰자 작성)">
                <el-date-picker
                  type="date"
                  placeholder="완료일"
                  v-model="measurementForms.evbAssembly.doneDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="custom-date-picker"
                />
              </el-form-item>
            </template>
          </el-form>
      </el-card>
</template>


<script setup lang="ts">
import LinksInput from "./LinksInput.vue";

interface MeasurementOption {
  key: string;
  label: string;
}

defineProps<{
  slot: MeasurementOption;
  index: number;
  measurementForms: any;
  nonlinearOptions: Array<{ key: string; label: string }>;
  dragOverIndex: number | null;
}>();

defineEmits<{
  (e: "nonlinear-toggle", type: string): void;
  (e: "drag-start", key: string): void;
  (e: "drag-over", index: number): void;
  (e: "drop", index: number): void;
  (e: "drag-end"): void;
}>();
</script>

<style scoped>
.grid-card {
  border-radius: 12px;
  overflow: hidden;
}

.detail-slot-card {
  display: flex;
  flex-direction: column;
}

.detail-slot-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 12px;
}

.detail-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.detail-card-title {
  font-size: 15px;
  font-weight: 700;
}

.drag-handle {
  cursor: grab;
  user-select: none;
  font-size: 18px;
  color: #909399;
  padding: 2px 6px;
  border-radius: 6px;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-over-card {
  outline: 2px dashed #409eff;
  outline-offset: -4px;
}

.custom-date-picker {
  width: 100%;
}

.nonlinear-type-button-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.nonlinear-type-button-row :deep(.el-button) {
  margin-left: 0 !important;
}

.nonlinear-sub-section {
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
  background: #fafafa;
}

.nonlinear-sub-title {
  font-size: 14px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #ebeef5;
}

.mb-3 {
  margin-bottom: 12px;
}
</style>

<template>
  <div class="module-application-page" v-loading="loading">
    <div class="module-grid">
      <!-- 1번 칸: 기본 정보 -->
      <el-card shadow="never" class="grid-card base-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-left">
              <span class="card-title">
                {{
                  reuseMode
                    ? "Module 의뢰서 재사용"
                    : mode === "create"
                    ? "Module 의뢰서 생성"
                    : "Module 의뢰서 상세"
                }}
              </span>
            
              <span v-if="reuseMode" class="reuse-inline-text">
                재사용 모드입니다. 수정하세요.
              </span>
            </div>
          </div>
        </template>

        <el-form label-position="top">
          <el-form-item label="P/N">
            <el-input
              v-model="baseForm.pn"
              placeholder="P/N 입력"
              clearable
            />
          </el-form-item>

          <el-row :gutter="12">
            <el-col :span="12">
              <el-form-item label="의뢰자">
                <el-input
                  v-model="baseForm.requester"
                  placeholder="의뢰자 입력"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="개발자">
                <el-input
                  v-model="baseForm.developer"
                  placeholder="개발자 입력"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="측정 목적">
            <el-input
              v-model="baseForm.purpose"
              placeholder="측정 목적 입력"
              clearable
            />
          </el-form-item>

          <el-form-item class="inline-site-type-item">
            <div class="inline-site-type-row">
              <span class="inline-site-type-label">구분</span>
              <el-radio-group v-model="baseForm.siteType" class="inline-site-type-group">
                <el-radio label="HQ">본사</el-radio>
                <el-radio label="WHC">WHC</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-form>

        <div class="left-bottom-button-area">
          <el-button @click="goList">목록</el-button>

          <el-button
            v-if="mode === 'edit' && !reuseMode"
            type="success"
            @click="handleExcelDownload"
          >
            엑셀
          </el-button>

          <el-button
            v-if="mode === 'edit' && !reuseMode"
            type="warning"
            @click="handleReuse"
          >
            재사용
          </el-button>

          <el-button type="primary" @click="handleSave">
            {{ effectiveMode === "create" ? "생성" : "저장" }}
          </el-button>

          <el-button
            v-if="mode === 'edit' && !reuseMode"
            type="danger"
            @click="handleDelete"
          >
            삭제
          </el-button>
        </div>
      </el-card>

      <!-- 2번 칸: 측정 선택 -->
      <el-card shadow="never" class="grid-card selector-card">
        <template #header>
          <div class="card-title">측정 항목 선택</div>
        </template>

        <div v-if="isBaseInfoComplete" class="selector-scroll">
          <div class="measurement-checkbox-group">
            <el-card
              v-for="item in measurementOptions"
              :key="item.key"
              shadow="hover"
              class="measurement-option-card"
            >
              <el-checkbox
                :model-value="selectedMeasurements.includes(item.key)"
                @change="(checked) => handleMeasurementToggle(item.key, checked)"
              >
                {{ item.label }}
              </el-checkbox>
            </el-card>
          </div>
        </div>

        <el-empty
          v-else
          description="P/N, 의뢰자, 구분을 먼저 입력해주세요."
        />
      </el-card>

      <!-- 3~8번 칸 -->
      <el-card
        v-for="(slot, index) in cardSlots"
        :key="`slot-${index}`"
        shadow="never"
        class="grid-card detail-slot-card"
        :class="{ 'drag-over-card': dragOverIndex === index }"
        @dragover.prevent="handleDragOverByIndex(index)"
        @drop.prevent="handleDropByIndex(index)"
      >
        <template #header>
          <div class="detail-card-header">
            <div class="detail-card-title">
              {{ slot ? `${index + 1}. ${slot.label}` : `측정 카드 ${index + 1}` }}
            </div>

            <div
              v-if="slot"
              class="drag-handle"
              draggable="true"
              title="드래그하여 순서 변경"
              @dragstart="handleDragStart(slot.key)"
              @dragend="handleDragEnd"
            >
              ⠿
            </div>
          </div>
        </template>

        <template v-if="!isBaseInfoComplete">
          <el-empty description="기본 정보를 먼저 입력해주세요." />
        </template>

        <template v-else-if="slot">
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

              <el-form-item label="측정 Set up 링크">
                <el-input v-model="measurementForms.setup.fileLink" />
              </el-form-item>

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
                <el-checkbox v-model="measurementForms.na.evbTuning">사용</el-checkbox>
              </el-form-item>

              <el-form-item label="Appendix">
                <el-checkbox v-model="measurementForms.na.appendix">사용</el-checkbox>
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

              <el-form-item label="측정 Set up 링크">
                <el-input v-model="measurementForms.na.fileLink" />
              </el-form-item>

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
                <el-checkbox v-model="measurementForms.nf.appendix">사용</el-checkbox>
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

              <el-form-item label="측정 Set up 링크">
                <el-input v-model="measurementForms.nf.fileLink" />
              </el-form-item>

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

              <el-form-item label="측정 Set up 링크">
                <el-input v-model="measurementForms.mwa.fileLink" />
              </el-form-item>

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

              <el-form-item label="측정 Set up 링크">
                <el-input v-model="measurementForms.ca.fileLink" />
              </el-form-item>

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

              <el-form-item label="측정 Set up 링크">
                <el-input v-model="measurementForms.tcf.fileLink" />
              </el-form-item>

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
          </el-form>
        </template>

        <template v-else>
          <div class="empty-slot">
            <el-empty description="선택된 측정 항목 없음" />
          </div>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getModuleApplicationNewById,
  createModuleApplicationNew,
  updateModuleApplicationNew,
  deleteModuleApplicationNew,
  downloadModuleApplicationNewExcel
} from "../../../utils/module_group/application-utils";

type SiteType = "HQ" | "WHC";
type ModeType = "create" | "edit";
type NullableDate = string | null;

type VendorType = "" | "KEYSIGHT" | "ROHDE";
type OnOffType = "" | "ALL" | "ON" | "OFF";
type BoardType = "" | "IDEAL_BOARD" | "REAL_BOARD";
type MoldType = "" | "ALL" | "NO_MOLD" | "MOLD";
type JigSolderingType = "" | "JIG" | "SOLDERING";

const loginId = localStorage.getItem("ms_username") || "";

interface MeasurementOption {
  key: string;
  label: string;
}

interface ModuleApplicationDetail {
  applicationId?: string;
  pn: string;
  requester: string;
  developer: string;
  purpose: string;
  siteType: SiteType | "";
  status?: string;
  creator?: string | null;
  modifier?: string | null;
  createdDate?: string | null;
  modifiedDate?: string | null;
  measurements: Array<{
    type: string;
    data?: Record<string, any>;
  }>;
}

interface CommonMeasurementFields {
  noteSpl: string;
  noteMeasurement: string;
  fileLink: string;
  resultFileLink: string;
  measurer: string;
  requestedDueDate: NullableDate;
  expectedDoneDate: NullableDate;
  doneDate: NullableDate;
}

interface SetupForm extends CommonMeasurementFields {
  vendor: VendorType;
  deembedding: OnOffType;
  portExtension: OnOffType;
}

interface NaForm extends CommonMeasurementFields {
  deembedding: OnOffType;
  portExtension: OnOffType;
  matching: OnOffType;
  mold: MoldType;
  jigSoldering: JigSolderingType;
  evbTuning: boolean;
  appendix: boolean;
}

interface NfForm extends CommonMeasurementFields {
  boardType: BoardType;
  mold: MoldType;
  appendix: boolean;
}

interface MwaForm extends CommonMeasurementFields {
  matching: OnOffType;
  loss: OnOffType;
}

interface CaForm extends CommonMeasurementFields {
  trace: string;
  power: string;
  freqStart: string;
  freqStop: string;
  average: string;
  point: string;
}

interface TcfForm extends CommonMeasurementFields {
  temperatureSequence: string;
  matching: OnOffType;
  jigSoldering: JigSolderingType;
}

function createEmptyMeasurementForms() {
  return {
    setup: {
      vendor: "",
      deembedding: "",
      portExtension: "",
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
    } as SetupForm,

    na: {
      deembedding: "",
      portExtension: "",
      matching: "",
      mold: "",
      jigSoldering: "",
      evbTuning: false,
      appendix: false,
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
    } as NaForm,

    nf: {
      boardType: "",
      mold: "",
      appendix: false,
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
    } as NfForm,

    mwa: {
      matching: "",
      loss: "",
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
    } as MwaForm,

    ca: {
      trace: "",
      power: "",
      freqStart: "",
      freqStop: "",
      average: "",
      point: "",
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
    } as CaForm,

    tcf: {
      temperatureSequence: "",
      matching: "",
      jigSoldering: "",
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
    } as TcfForm,
  };
}

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const draggingKey = ref<string | null>(null);
const dragOverIndex = ref<number | null>(null);
const reuseMode = ref(false);

const mode = computed<ModeType>(() => {
  return route.params.id ? "edit" : "create";
});

const effectiveMode = computed<ModeType>(() => {
  if (reuseMode.value) return "create";
  return mode.value;
});

const applicationId = computed(() => {
  return String(route.params.id ?? "");
});

const baseForm = reactive({
  pn: "",
  requester: "",
  developer: "",
  purpose: "",
  siteType: "" as SiteType | "",
});

const measurementOptions: MeasurementOption[] = [
  { key: "setup", label: "Set up 검증" },
  { key: "na", label: "KeySight NA 측정" },
  { key: "nf", label: "KeySight NF 측정" },
  { key: "mwa", label: "Rohde MWA 측정" },
  { key: "ca", label: "Rohde CA 측정" },
  { key: "tcf", label: "Keysight TCF 측정" },
];

const selectedMeasurements = ref<string[]>([]);
const measurementForms = reactive(createEmptyMeasurementForms());

const isBaseInfoComplete = computed(() => {
  return (
    baseForm.pn.trim() !== "" &&
    baseForm.requester.trim() !== "" &&
    baseForm.siteType !== ""
  );
});

const selectedCards = computed(() => {
  return selectedMeasurements.value
    .map((key) => measurementOptions.find((item) => item.key === key) || null)
    .filter((item): item is MeasurementOption => item !== null);
});

const cardSlots = computed<(MeasurementOption | null)[]>(() => {
  return Array.from({ length: 6 }, (_, index) => selectedCards.value[index] ?? null);
});

function resetForm() {
  baseForm.pn = "";
  baseForm.requester = "";
  baseForm.developer = "";
  baseForm.purpose = "";
  baseForm.siteType = "";
  selectedMeasurements.value = [];
  Object.assign(measurementForms, createEmptyMeasurementForms());
  reuseMode.value = false;
}

function clearReuseProgressFields() {
  Object.keys(measurementForms).forEach((key) => {
    const form = measurementForms[key as keyof typeof measurementForms] as any;

    form.requestedDueDate = null;
    form.expectedDoneDate = null;
    form.doneDate = null;
    form.measurer = "";
    form.resultFileLink = "";
  });
}

async function handleReuse() {
  try {
    await ElMessageBox.confirm(
      "이 의뢰서를 재사용하시겠습니까?",
      "확인",
      {
        confirmButtonText: "예",
        cancelButtonText: "아니오",
        type: "warning",
      }
    );
  } catch (action) {
    return;
  }
  reuseMode.value = true;
  clearReuseProgressFields();
  ElMessage.warning("재사용 모드입니다. 수정 후 생성하면 새 의뢰서가 생성됩니다.");
}

function handleMeasurementToggle(key: string, checked: boolean | string | number) {
  const isChecked = !!checked;
  const current = [...selectedMeasurements.value];

  if (isChecked) {
    if (!current.includes(key)) {
      current.push(key);
    }
  } else {
    const index = current.indexOf(key);
    if (index > -1) {
      current.splice(index, 1);
    }
  }

  selectedMeasurements.value = current;

  console.log("[checkbox toggle] key:", key, "checked:", isChecked);
  console.log("[checkbox toggle] selectedMeasurements:", [...selectedMeasurements.value]);
}

function handleDragStart(key: string) {
  draggingKey.value = key;
  console.log("[drag start] draggingKey:", key);
  console.log("[drag start] current order:", [...selectedMeasurements.value]);
}

function handleDragOverByIndex(index: number) {
  if (dragOverIndex.value !== index) {
    dragOverIndex.value = index;
    console.log("[drag over] targetIndex:", index);
  }
}

function handleDropByIndex(targetIndex: number) {
  if (!draggingKey.value) {
    console.log("[drop ignored] draggingKey is null");
    dragOverIndex.value = null;
    return;
  }

  const current = [...selectedMeasurements.value];
  const fromIndex = current.indexOf(draggingKey.value);

  if (fromIndex === -1) {
    console.log("[drop failed] dragging key not found", draggingKey.value);
    draggingKey.value = null;
    dragOverIndex.value = null;
    return;
  }

  const [moved] = current.splice(fromIndex, 1);
  const insertIndex = Math.min(targetIndex, current.length);
  current.splice(insertIndex, 0, moved);

  console.log("[drop before] order:", [...selectedMeasurements.value]);
  console.log("[drop action] moved:", moved, "from:", fromIndex, "to:", insertIndex);

  selectedMeasurements.value = current;

  console.log("[drop after] order:", [...selectedMeasurements.value]);

  draggingKey.value = null;
  dragOverIndex.value = null;
}

function handleDragEnd() {
  console.log("[drag end] final order:", [...selectedMeasurements.value]);
  draggingKey.value = null;
  dragOverIndex.value = null;
}

function applyDetail(detail: ModuleApplicationDetail) {
  baseForm.pn = detail.pn ?? "";
  baseForm.requester = detail.requester ?? "";
  baseForm.developer = detail.developer ?? "";
  baseForm.purpose = detail.purpose ?? "";
  baseForm.siteType = detail.siteType ?? "";

  selectedMeasurements.value = detail.measurements.map((item) => item.type);
  console.log("[applyDetail] loaded measurement order:", [...selectedMeasurements.value]);

  detail.measurements.forEach((item) => {
    if (item.type === "setup") {
      measurementForms.setup.vendor = item.data?.vendor ?? "";
      measurementForms.setup.deembedding = item.data?.deembedding ?? "";
      measurementForms.setup.portExtension = item.data?.portExtension ?? "";
      measurementForms.setup.noteSpl = item.data?.noteSpl ?? "";
      measurementForms.setup.noteMeasurement = item.data?.noteMeasurement ?? "";
      measurementForms.setup.fileLink = item.data?.fileLink ?? "";
      measurementForms.setup.resultFileLink = item.data?.resultFileLink ?? "";
      measurementForms.setup.measurer = item.data?.measurer ?? "";
      measurementForms.setup.requestedDueDate = item.data?.requestedDueDate ?? null;
      measurementForms.setup.expectedDoneDate = item.data?.expectedDoneDate ?? null;
      measurementForms.setup.doneDate = item.data?.doneDate ?? null;
    }

    if (item.type === "na") {
      measurementForms.na.deembedding = item.data?.deembedding ?? "";
      measurementForms.na.portExtension = item.data?.portExtension ?? "";
      measurementForms.na.matching = item.data?.matching ?? "";
      measurementForms.na.mold = item.data?.mold ?? "";
      measurementForms.na.jigSoldering = item.data?.jigSoldering ?? "";
      measurementForms.na.evbTuning = !!item.data?.evbTuning;
      measurementForms.na.appendix = !!item.data?.appendix;
      measurementForms.na.noteSpl = item.data?.noteSpl ?? "";
      measurementForms.na.noteMeasurement = item.data?.noteMeasurement ?? "";
      measurementForms.na.fileLink = item.data?.fileLink ?? "";
      measurementForms.na.resultFileLink = item.data?.resultFileLink ?? "";
      measurementForms.na.measurer = item.data?.measurer ?? "";
      measurementForms.na.requestedDueDate = item.data?.requestedDueDate ?? null;
      measurementForms.na.expectedDoneDate = item.data?.expectedDoneDate ?? null;
      measurementForms.na.doneDate = item.data?.doneDate ?? null;
    }

    if (item.type === "nf") {
      measurementForms.nf.boardType = item.data?.boardType ?? "";
      measurementForms.nf.mold = item.data?.mold ?? "";
      measurementForms.nf.appendix = !!item.data?.appendix;
      measurementForms.nf.noteSpl = item.data?.noteSpl ?? "";
      measurementForms.nf.noteMeasurement = item.data?.noteMeasurement ?? "";
      measurementForms.nf.fileLink = item.data?.fileLink ?? "";
      measurementForms.nf.resultFileLink = item.data?.resultFileLink ?? "";
      measurementForms.nf.measurer = item.data?.measurer ?? "";
      measurementForms.nf.requestedDueDate = item.data?.requestedDueDate ?? null;
      measurementForms.nf.expectedDoneDate = item.data?.expectedDoneDate ?? null;
      measurementForms.nf.doneDate = item.data?.doneDate ?? null;
    }

    if (item.type === "mwa") {
      measurementForms.mwa.matching = item.data?.matching ?? "";
      measurementForms.mwa.loss = item.data?.loss ?? "";
      measurementForms.mwa.noteSpl = item.data?.noteSpl ?? "";
      measurementForms.mwa.noteMeasurement = item.data?.noteMeasurement ?? "";
      measurementForms.mwa.fileLink = item.data?.fileLink ?? "";
      measurementForms.mwa.resultFileLink = item.data?.resultFileLink ?? "";
      measurementForms.mwa.measurer = item.data?.measurer ?? "";
      measurementForms.mwa.requestedDueDate = item.data?.requestedDueDate ?? null;
      measurementForms.mwa.expectedDoneDate = item.data?.expectedDoneDate ?? null;
      measurementForms.mwa.doneDate = item.data?.doneDate ?? null;
    }

    if (item.type === "ca") {
      measurementForms.ca.trace = item.data?.trace ?? "";
      measurementForms.ca.power = item.data?.power ?? "";
      measurementForms.ca.freqStart = item.data?.freqStart ?? "";
      measurementForms.ca.freqStop = item.data?.freqStop ?? "";
      measurementForms.ca.average = item.data?.average ?? "";
      measurementForms.ca.point = item.data?.point ?? "";
      measurementForms.ca.noteSpl = item.data?.noteSpl ?? "";
      measurementForms.ca.noteMeasurement = item.data?.noteMeasurement ?? "";
      measurementForms.ca.fileLink = item.data?.fileLink ?? "";
      measurementForms.ca.resultFileLink = item.data?.resultFileLink ?? "";
      measurementForms.ca.measurer = item.data?.measurer ?? "";
      measurementForms.ca.requestedDueDate = item.data?.requestedDueDate ?? null;
      measurementForms.ca.expectedDoneDate = item.data?.expectedDoneDate ?? null;
      measurementForms.ca.doneDate = item.data?.doneDate ?? null;
    }

    if (item.type === "tcf") {
      measurementForms.tcf.temperatureSequence = item.data?.temperatureSequence ?? "";
      measurementForms.tcf.matching = item.data?.matching ?? "";
      measurementForms.tcf.jigSoldering = item.data?.jigSoldering ?? "";
      measurementForms.tcf.noteSpl = item.data?.noteSpl ?? "";
      measurementForms.tcf.noteMeasurement = item.data?.noteMeasurement ?? "";
      measurementForms.tcf.fileLink = item.data?.fileLink ?? "";
      measurementForms.tcf.resultFileLink = item.data?.resultFileLink ?? "";
      measurementForms.tcf.measurer = item.data?.measurer ?? "";
      measurementForms.tcf.requestedDueDate = item.data?.requestedDueDate ?? null;
      measurementForms.tcf.expectedDoneDate = item.data?.expectedDoneDate ?? null;
      measurementForms.tcf.doneDate = item.data?.doneDate ?? null;
    }
  });
}

async function fetchDetail() {
  loading.value = true;
  try {
    const detail = await getModuleApplicationNewById(applicationId.value);
    applyDetail(detail);
  } catch (error) {
    console.error(error);
    ElMessage.error("상세 데이터를 불러오지 못했습니다.");
  } finally {
    loading.value = false;
  }
}

function buildPayload() {
  const payload = {
    applicationId: effectiveMode.value === "create" ? "" : applicationId.value,
    pn: baseForm.pn,
    requester: baseForm.requester,
    developer: baseForm.developer,
    purpose: baseForm.purpose,
    siteType: baseForm.siteType,
    creator: loginId,
    modifier: loginId,
    measurements: selectedMeasurements.value.map((key) => ({
      type: key,
      data: measurementForms[key as keyof typeof measurementForms],
    })),
  };

  console.log("[buildPayload] measurement order:", payload.measurements.map((x) => x.type));
  console.log("[buildPayload] payload:", payload);

  return payload;
}

async function handleSave() {
  if (!selectedMeasurements.value.length) {
    ElMessage.warning("측정 항목을 최소 1개 이상 선택해주세요.");
    return;
  }

  try {
    await ElMessageBox.confirm(
      reuseMode.value
        ? "재사용하여 새 의뢰서를 생성하시겠습니까?"
        : effectiveMode.value === "create"
        ? "생성하시겠습니까?"
        : "수정 내용을 저장하시겠습니까?",
      "확인",
      {
        confirmButtonText: "예",
        cancelButtonText: "아니오",
        type: "warning",
      }
    );
  } catch (action) {
    return;
  }

  try {
    loading.value = true;
    const payload = buildPayload();

    if (effectiveMode.value === "create") {
      const res = await createModuleApplicationNew(payload);
      ElMessage.success(
        reuseMode.value
          ? "재사용 의뢰서가 생성되었습니다."
          : "신규 의뢰서가 생성되었습니다."
      );

      reuseMode.value = false;

      if (res?.application_id) {
        router.push(`/modules/application/${res.application_id}`);
      }
    } else {
      await updateModuleApplicationNew(payload);
      ElMessage.success("의뢰서가 수정되었습니다.");

      const detail = await getModuleApplicationNewById(applicationId.value);
      applyDetail(detail);
    }
  } catch (error: any) {
    console.error(error);
    ElMessage.error(
      error?.response?.data?.detail || error?.message || "저장 중 오류가 발생했습니다."
    );
  } finally {
    loading.value = false;
  }
}

async function handleDelete() {
  if (!applicationId.value) {
    ElMessage.error("삭제할 의뢰서 ID가 없습니다.");
    return;
  }

  try {
    await ElMessageBox.confirm(
      "삭제하시겠습니까?",
      "확인",
      {
        confirmButtonText: "예",
        cancelButtonText: "아니오",
        type: "warning",
      }
    );
  } catch (action) {
    return;
  }

  try {
    loading.value = true;
    await deleteModuleApplicationNew(applicationId.value);

    ElMessage.success("의뢰서가 삭제되었습니다.");
    router.push("/modules/application/list_new");
  } catch (error: any) {
    console.error(error);
    ElMessage.error(
      error?.response?.data?.detail || error?.message || "삭제 중 오류가 발생했습니다."
    );
  } finally {
    loading.value = false;
  }
}

async function handleExcelDownload() {
  if (!applicationId.value) {
    ElMessage.error("엑셀 출력할 의뢰서 ID가 없습니다.");
    return;
  }

  try {
    loading.value = true;
    await downloadModuleApplicationNewExcel(applicationId.value);
    ElMessage.success("엑셀 다운로드가 시작되었습니다.");
  } catch (error: any) {
    console.error(error);
    ElMessage.error(
      error?.response?.data?.detail || error?.message || "엑셀 다운로드 중 오류가 발생했습니다."
    );
  } finally {
    loading.value = false;
  }
}

function goList() {
  router.push("/modules/application/list_new");
}

onMounted(async () => {
  if (mode.value === "create") {
    resetForm();
    return;
  }

  await fetchDetail();
});
</script>

<style scoped>
.module-application-page {
  padding: 16px;
  height: calc(100vh - 60px);
  box-sizing: border-box;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, minmax(320px, 1fr));
  gap: 16px;
  height: 100%;
}

.grid-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.reuse-inline-text {
  font-size: 13px;
  color: #e6a23c;
  font-weight: 500;
}

.base-card,
.selector-card,
.detail-slot-card {
  display: flex;
  flex-direction: column;
}

:deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
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

.left-bottom-button-area {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.left-bottom-button-area :deep(.el-button) {
  margin-left: 0 !important;
  padding: 8px 16px;
}

.selector-scroll {
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
}

.measurement-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.measurement-option-card {
  cursor: pointer;
  border-radius: 10px;
}

.measurement-option-card:hover {
  transform: translateY(-1px);
}

.detail-slot-card :deep(.el-card__body) {
  overflow-y: auto;
  padding-bottom: 12px;
}

.drag-over-card {
  outline: 2px dashed #409eff;
  outline-offset: -4px;
}

.empty-slot {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-date-picker {
  width: 100%;
}

.inline-site-type-item {
  margin-bottom: 18px;
}

.inline-site-type-row {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 32px;
}

.inline-site-type-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  min-width: 32px;
}

.inline-site-type-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.inline-site-type-group :deep(.el-radio) {
  margin-right: 0;
}

@media (max-width: 1400px) {
  .module-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }
}
</style>
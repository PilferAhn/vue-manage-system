<template>
  <div class="module-application-page" v-loading="loading">
    <div class="module-grid">
      <!-- 1번 칸: 기본 정보 -->
      <BaseInfoCard
        :base-form="baseForm"
        :mode="mode"
        :effective-mode="effectiveMode"
        :reuse-mode="reuseMode"
        @list="goList"
        @excel="handleExcelDownload"
        @reuse="handleReuse"
        @save="handleSave"
        @delete="handleDelete"
      />

      <!-- 2번 칸: 샘플 정보 카드 -->
      <SampleInfoCard
        v-if="(isBaseInfoComplete || mode === 'edit') && baseForm.useSampleInfo"
        :sample-info="baseForm.sampleInfo"
      />
      
      <!-- 측정 선택 -->
      <MeasurementSelectorCard
        v-if="isBaseInfoComplete || mode === 'edit'"
        :measurement-options="measurementOptions"
        :selected-measurements="selectedMeasurements"
        @toggle="handleMeasurementToggle"
      />

      <MeasurementDetailCard
        v-for="(slot, index) in selectedCards"
        :key="slot.key"
        :slot="slot"
        :index="index"
        :measurement-forms="measurementForms"
        :nonlinear-options="nonlinearOptions"
        :drag-over-index="dragOverIndex"
        @nonlinear-toggle="handleNonlinearTypeToggle"
        @drag-start="handleDragStart"
        @drag-over="handleDragOverByIndex"
        @drop="handleDropByIndex"
        @drag-end="handleDragEnd"
      />
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
  downloadModuleApplicationNewExcel,
  type ModuleApplicationDetail,
  type NullableDate,
} from "../../../utils/module_group/application-utils";
import BaseInfoCard from "./components/BaseInfoCard.vue";
import SampleInfoCard from "./components/SampleInfoCard.vue";
import MeasurementSelectorCard from "./components/MeasurementSelectorCard.vue";
import MeasurementDetailCard from "./components/MeasurementDetailCard.vue";

type SiteType = "HQ" | "WHC";
type ModeType = "create" | "edit";

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

interface CommonMeasurementFields {
  noteSpl: string;
  noteMeasurement: string;
  fileLink: string;
  resultFileLink: string;
  measurer: string;
  requestedDueDate: NullableDate;
  expectedDoneDate: NullableDate;
  doneDate: NullableDate;
  links: Record<string, string>;
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

type NonlinearSubType = "imd" | "p1db" | "iip3" | "rse" | "harmonic";
type NonlinearType = "" | NonlinearSubType;

interface NonlinearForm extends CommonMeasurementFields {
  // selectedType은 기존 저장 데이터 호환용으로 유지하고, 화면에서는 selectedTypes를 사용합니다.
  selectedType: NonlinearType;
  selectedTypes: NonlinearSubType[];

  // IMD
  imdBand: string;
  imdInputPower: string;
  imdFjamPower: string;

  // P1dB
  p1dbBand: string;
  p1dbGainBiasAddress: string;

  // IIP3
  iip3Band: string;
  iip3GainBiasAddress: string;
  iip3FjamPower: string;

  // RSE
  rseFrequency: string;

  // Harmonic
  harmonicBand: string;
  harmonicInputPower: string;
  harmonicOrder: string;
  harmonicUnit: "" | "dBc" | "dBm";
}

interface ProbeSplForm extends CommonMeasurementFields {
  sampleType: string;
  freqStart: string;
  freqStop: string;
  stepPoint: string;
  powerIfbw: string;
  pitch: string;
  gsType: string;
}

interface ProbeDeembeddingForm extends CommonMeasurementFields {
  evbInfo: string;
  freqStart: string;
  freqStop: string;
  stepPoint: string;
  powerIfbw: string;
  pitch: string;
  gsType: string;
}

interface EvbAssemblyForm extends CommonMeasurementFields {
  requestLink: string;
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
      links: {},
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
      links: {},
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
      links: {},
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
      links: {},
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
      links: {},
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
      links: {},
    } as TcfForm,

    nonlinear: {
      selectedType: "",
      selectedTypes: [],

      imdBand: "",
      imdInputPower: "",
      imdFjamPower: "",

      p1dbBand: "",
      p1dbGainBiasAddress: "",

      iip3Band: "",
      iip3GainBiasAddress: "",
      iip3FjamPower: "",

      rseFrequency: "",

      harmonicBand: "",
      harmonicInputPower: "",
      harmonicOrder: "",
      harmonicUnit: "",

      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
      links: {},
    } as NonlinearForm,

    probeSpl: {
      sampleType: "",
      freqStart: "",
      freqStop: "",
      stepPoint: "",
      powerIfbw: "",
      pitch: "",

      gsType: "",
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
      links: {},
    } as ProbeSplForm,

    probeDeembedding: {
      evbInfo: "",
      freqStart: "",
      freqStop: "",
      stepPoint: "",
      powerIfbw: "",
      pitch: "",
      gsType: "",
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
      links: {},
    } as ProbeDeembeddingForm,

    evbAssembly: {
      requestLink: "",
      noteSpl: "",
      noteMeasurement: "",
      fileLink: "",
      resultFileLink: "",
      measurer: "",
      requestedDueDate: null,
      expectedDoneDate: null,
      doneDate: null,
      links: {},
    } as EvbAssemblyForm,
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
  useSampleInfo: false,
  sampleInfo:{
              sender: "",
              deliveredDate: null as NullableDate,
              note: "",
              sampleLink: "",
              }
});


const measurementOptions: MeasurementOption[] = [
  { key: "setup", label: "Set up 검증" },
  { key: "na", label: "KeySight NA 측정" },
  { key: "nf", label: "KeySight NF 측정" },
  { key: "mwa", label: "Rohde MWA 측정" },
  { key: "ca", label: "Rohde CA 측정" },
  { key: "tcf", label: "Keysight TCF 측정" },
  { key: "nonlinear", label: "비선형 측정" },
  { key: "probeSpl", label: "Probe 측정 SPL" },
  { key: "probeDeembedding", label: "Probe 측정 Deembedding" },
  { key: "evbAssembly", label: "EVB 조립" },
];

const nonlinearOptions: Array<{
  key: NonlinearSubType;
  label: string;
}> = [
  { key: "imd", label: "IMD" },
  { key: "p1db", label: "P1dB" },
  { key: "iip3", label: "IIP3" },
  { key: "rse", label: "RSE" },
  { key: "harmonic", label: "Harmonic" },
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

function resetForm() {
  baseForm.pn = "";
  baseForm.requester = "";
  baseForm.developer = "";
  baseForm.purpose = "";
  baseForm.siteType = "";
  selectedMeasurements.value = [];
  baseForm.useSampleInfo = false;
  baseForm.sampleInfo.sender ="";
  baseForm.sampleInfo.deliveredDate = null;
  baseForm.sampleInfo.note = "";
  baseForm.sampleInfo.sampleLink = "";
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
  ElMessage.warning(
    "재사용 모드입니다. 수정 후 생성하면 새 의뢰서가 생성됩니다."
  );
}

function handleMeasurementToggle(
  key: string,
  checked: boolean | string | number
) {
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
  console.log(
    "[checkbox toggle] selectedMeasurements:",
    [...selectedMeasurements.value]
  );
}

function handleNonlinearTypeToggle(type: NonlinearSubType) {
  const selectedTypes = measurementForms.nonlinear.selectedTypes;
  const index = selectedTypes.indexOf(type);

  if (index > -1) {
    selectedTypes.splice(index, 1);
  } else {
    selectedTypes.push(type);
  }

  // 기존 selectedType 필드를 사용하는 저장 데이터와의 호환을 위해 첫 번째 선택값을 같이 보관합니다.
  measurementForms.nonlinear.selectedType = selectedTypes[0] ?? "";

  console.log(
    "[nonlinear toggle] selectedTypes:",
    [...measurementForms.nonlinear.selectedTypes]
  );
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
  console.log(
    "[drop action] moved:",
    moved,
    "from:",
    fromIndex,
    "to:",
    insertIndex
  );

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

function normalizeLinks(data?: Record<string, any> | null): Record<string, string> {
  const source =
    data?.links && typeof data.links === "object"
      ? data.links
      : {};

  return Object.entries(source).reduce((acc, [key, value]) => {
    acc[key] = String(value ?? "");
    return acc;
  }, {} as Record<string, string>);
}

function applyDetail(detail: ModuleApplicationDetail) {
  baseForm.pn = detail.pn ?? "";
  baseForm.requester = detail.requester ?? "";
  baseForm.developer = detail.developer ?? "";
  baseForm.purpose = detail.purpose ?? "";
  baseForm.siteType = detail.siteType ?? "";
  baseForm.useSampleInfo = !!detail.useSampleInfo;
  baseForm.sampleInfo.sender = detail.sampleInfo?.sender ?? "";
  baseForm.sampleInfo.deliveredDate = detail.sampleInfo?.deliveredDate ?? null;
  baseForm.sampleInfo.note = detail.sampleInfo?.note ?? "";
  baseForm.sampleInfo.sampleLink = detail.sampleInfo?.sampleLink ?? "";

  selectedMeasurements.value = detail.measurements.map((item) => item.type);
  console.log(
    "[applyDetail] loaded measurement order:",
    [...selectedMeasurements.value]
  );

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
      measurementForms.setup.requestedDueDate =
        item.data?.requestedDueDate ?? null;
      measurementForms.setup.expectedDoneDate =
        item.data?.expectedDoneDate ?? null;
      measurementForms.setup.doneDate = item.data?.doneDate ?? null;
      measurementForms.setup.links = normalizeLinks(item.data);
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
      measurementForms.na.requestedDueDate =
        item.data?.requestedDueDate ?? null;
      measurementForms.na.expectedDoneDate =
        item.data?.expectedDoneDate ?? null;
      measurementForms.na.doneDate = item.data?.doneDate ?? null;
      measurementForms.na.links = normalizeLinks(item.data);
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
      measurementForms.nf.requestedDueDate =
        item.data?.requestedDueDate ?? null;
      measurementForms.nf.expectedDoneDate =
        item.data?.expectedDoneDate ?? null;
      measurementForms.nf.doneDate = item.data?.doneDate ?? null;
      measurementForms.nf.links = normalizeLinks(item.data);
    }

    if (item.type === "mwa") {
      measurementForms.mwa.matching = item.data?.matching ?? "";
      measurementForms.mwa.loss = item.data?.loss ?? "";
      measurementForms.mwa.noteSpl = item.data?.noteSpl ?? "";
      measurementForms.mwa.noteMeasurement = item.data?.noteMeasurement ?? "";
      measurementForms.mwa.fileLink = item.data?.fileLink ?? "";
      measurementForms.mwa.resultFileLink = item.data?.resultFileLink ?? "";
      measurementForms.mwa.measurer = item.data?.measurer ?? "";
      measurementForms.mwa.requestedDueDate =
        item.data?.requestedDueDate ?? null;
      measurementForms.mwa.expectedDoneDate =
        item.data?.expectedDoneDate ?? null;
      measurementForms.mwa.doneDate = item.data?.doneDate ?? null;
      measurementForms.mwa.links = normalizeLinks(item.data);
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
      measurementForms.ca.requestedDueDate =
        item.data?.requestedDueDate ?? null;
      measurementForms.ca.expectedDoneDate =
        item.data?.expectedDoneDate ?? null;
      measurementForms.ca.doneDate = item.data?.doneDate ?? null;
      measurementForms.ca.links = normalizeLinks(item.data);
    }

    if (item.type === "tcf") {
      measurementForms.tcf.temperatureSequence =
        item.data?.temperatureSequence ?? "";
      measurementForms.tcf.matching = item.data?.matching ?? "";
      measurementForms.tcf.jigSoldering = item.data?.jigSoldering ?? "";
      measurementForms.tcf.noteSpl = item.data?.noteSpl ?? "";
      measurementForms.tcf.noteMeasurement = item.data?.noteMeasurement ?? "";
      measurementForms.tcf.fileLink = item.data?.fileLink ?? "";
      measurementForms.tcf.resultFileLink = item.data?.resultFileLink ?? "";
      measurementForms.tcf.measurer = item.data?.measurer ?? "";
      measurementForms.tcf.requestedDueDate =
        item.data?.requestedDueDate ?? null;
      measurementForms.tcf.expectedDoneDate =
        item.data?.expectedDoneDate ?? null;
      measurementForms.tcf.doneDate = item.data?.doneDate ?? null;
      measurementForms.tcf.links = normalizeLinks(item.data);
    }

    if (item.type === "nonlinear") {
      const loadedSelectedTypes = Array.isArray(item.data?.selectedTypes)
        ? item.data.selectedTypes
        : item.data?.selectedType
        ? [item.data.selectedType]
        : [];

      measurementForms.nonlinear.selectedTypes = loadedSelectedTypes.filter(
        (type: string): type is NonlinearSubType =>
          nonlinearOptions.some((option) => option.key === type)
      );
      measurementForms.nonlinear.selectedType =
        measurementForms.nonlinear.selectedTypes[0] ?? "";

      measurementForms.nonlinear.imdBand = item.data?.imdBand ?? "";
      measurementForms.nonlinear.imdInputPower =
        item.data?.imdInputPower ?? "";
      measurementForms.nonlinear.imdFjamPower =
        item.data?.imdFjamPower ?? "";

      measurementForms.nonlinear.p1dbBand = item.data?.p1dbBand ?? "";
      measurementForms.nonlinear.p1dbGainBiasAddress =
        item.data?.p1dbGainBiasAddress ?? "";

      measurementForms.nonlinear.iip3Band = item.data?.iip3Band ?? "";
      measurementForms.nonlinear.iip3GainBiasAddress =
        item.data?.iip3GainBiasAddress ?? "";
      measurementForms.nonlinear.iip3FjamPower =
        item.data?.iip3FjamPower ?? "";

      measurementForms.nonlinear.rseFrequency =
        item.data?.rseFrequency ?? "";

      measurementForms.nonlinear.harmonicBand =
        item.data?.harmonicBand ?? "";
      measurementForms.nonlinear.harmonicInputPower =
        item.data?.harmonicInputPower ?? "";
      measurementForms.nonlinear.harmonicOrder =
        item.data?.harmonicOrder ?? "";
      measurementForms.nonlinear.harmonicUnit =
        item.data?.harmonicUnit ?? "";

      measurementForms.nonlinear.noteSpl = item.data?.noteSpl ?? "";
      measurementForms.nonlinear.noteMeasurement =
        item.data?.noteMeasurement ?? "";
      measurementForms.nonlinear.fileLink = item.data?.fileLink ?? "";
      measurementForms.nonlinear.resultFileLink =
        item.data?.resultFileLink ?? "";
      measurementForms.nonlinear.measurer = item.data?.measurer ?? "";
      measurementForms.nonlinear.requestedDueDate =
        item.data?.requestedDueDate ?? null;
      measurementForms.nonlinear.expectedDoneDate =
        item.data?.expectedDoneDate ?? null;
      measurementForms.nonlinear.doneDate = item.data?.doneDate ?? null;
      measurementForms.nonlinear.links = normalizeLinks(item.data);
    }

    if (item.type === "probeSpl") {
      measurementForms.probeSpl.sampleType = item.data?.sampleType ?? "";
      measurementForms.probeSpl.freqStart = item.data?.freqStart ?? "";
      measurementForms.probeSpl.powerIfbw = item.data?.powerIfbw ?? "";
      measurementForms.probeSpl.freqStop = item.data?.freqStop ?? "";
      measurementForms.probeSpl.pitch = item.data?.pitch ?? "";
      measurementForms.probeSpl.stepPoint = item.data?.stepPoint ?? "";
      measurementForms.probeSpl.gsType = item.data?.gsType ?? "";
      measurementForms.probeSpl.noteSpl = item.data?.noteSpl ?? "";
      measurementForms.probeSpl.noteMeasurement =
        item.data?.noteMeasurement ?? "";
      measurementForms.probeSpl.fileLink = item.data?.fileLink ?? "";
      measurementForms.probeSpl.resultFileLink =
        item.data?.resultFileLink ?? "";
      measurementForms.probeSpl.measurer = item.data?.measurer ?? "";
      measurementForms.probeSpl.requestedDueDate =
        item.data?.requestedDueDate ?? null;
      measurementForms.probeSpl.expectedDoneDate =
        item.data?.expectedDoneDate ?? null;
      measurementForms.probeSpl.doneDate = item.data?.doneDate ?? null;
      measurementForms.probeSpl.links = normalizeLinks(item.data);
    }

    if (item.type === "probeDeembedding") {
      measurementForms.probeDeembedding.evbInfo = item.data?.evbInfo ?? "";
      measurementForms.probeDeembedding.freqStart =
        item.data?.freqStart ?? "";
      measurementForms.probeDeembedding.powerIfbw =
        item.data?.powerIfbw ?? "";
      measurementForms.probeDeembedding.freqStop =
        item.data?.freqStop ?? "";
      measurementForms.probeDeembedding.pitch = item.data?.pitch ?? "";
      measurementForms.probeDeembedding.stepPoint =
        item.data?.stepPoint ?? "";
      measurementForms.probeDeembedding.gsType =
        item.data?.gsType ?? "";
      measurementForms.probeDeembedding.noteSpl =
        item.data?.noteSpl ?? "";
      measurementForms.probeDeembedding.noteMeasurement =
        item.data?.noteMeasurement ?? "";
      measurementForms.probeDeembedding.fileLink =
        item.data?.fileLink ?? "";
      measurementForms.probeDeembedding.resultFileLink =
        item.data?.resultFileLink ?? "";
      measurementForms.probeDeembedding.measurer =
        item.data?.measurer ?? "";
      measurementForms.probeDeembedding.requestedDueDate =
        item.data?.requestedDueDate ?? null;
      measurementForms.probeDeembedding.expectedDoneDate =
        item.data?.expectedDoneDate ?? null;
      measurementForms.probeDeembedding.doneDate =
        item.data?.doneDate ?? null;
      measurementForms.probeDeembedding.links = normalizeLinks(item.data);
    }

    if (item.type === "evbAssembly") {
      measurementForms.evbAssembly.requestLink =
        item.data?.requestLink ?? "";
      measurementForms.evbAssembly.noteSpl = item.data?.noteSpl ?? "";
      measurementForms.evbAssembly.noteMeasurement =
        item.data?.noteMeasurement ?? "";
      measurementForms.evbAssembly.fileLink = item.data?.fileLink ?? "";
      measurementForms.evbAssembly.resultFileLink =
        item.data?.resultFileLink ?? "";
      measurementForms.evbAssembly.measurer = item.data?.measurer ?? "";
      measurementForms.evbAssembly.requestedDueDate =
        item.data?.requestedDueDate ?? null;
      measurementForms.evbAssembly.expectedDoneDate =
        item.data?.expectedDoneDate ?? null;
      measurementForms.evbAssembly.doneDate = item.data?.doneDate ?? null;
      measurementForms.evbAssembly.links = normalizeLinks(item.data);
    }
  });
}

async function fetchDetail() {
  loading.value = true;
  try {
    const detail = await getModuleApplicationNewById(applicationId.value);
    console.log("[fetchDetail] mapped detail:", detail)
    applyDetail(detail);
  } catch (error) {
    console.error(error);
    ElMessage.error("상세 데이터를 불러오지 못했습니다.");
  } finally {
    loading.value = false;
  }
}

function buildMeasurementPayloadData(key: string) {
  const form = measurementForms[key as keyof typeof measurementForms] as any;
  const links = normalizeLinks(form);

  return {
    ...form,
    links,
    fileLink:
      form.fileLink ||
      Object.values(links).find((value) => String(value ?? "").trim() !== "") ||
      "",
  };
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
      data: buildMeasurementPayloadData(key),
    })),
    useSampleInfo: baseForm.useSampleInfo,
    sampleInfo: baseForm.useSampleInfo ? baseForm.sampleInfo : null,
  };

  console.log(
    "[buildPayload] measurement order:",
    payload.measurements.map((x) => x.type)
  );
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
      error?.response?.data?.detail ||
        error?.message ||
        "저장 중 오류가 발생했습니다."
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
    await ElMessageBox.confirm("삭제하시겠습니까?", "확인", {
      confirmButtonText: "예",
      cancelButtonText: "아니오",
      type: "warning",
    });
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
      error?.response?.data?.detail ||
        error?.message ||
        "삭제 중 오류가 발생했습니다."
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
      error?.response?.data?.detail ||
        error?.message ||
        "엑셀 다운로드 중 오류가 발생했습니다."
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

@media (max-width: 1400px) {
  .module-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }
}
</style>
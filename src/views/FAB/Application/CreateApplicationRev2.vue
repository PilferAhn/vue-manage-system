<template>
    <template v-if="isOnTime">
      <ApplicationTemplate v-if="showForm"
        :fab-application="fabApplication"
        applicationType="create"
        :options="sawTypes"
        :sawType="sawType"
      />
      <PreviousRevisionDialog
        :visible="revisionDialogVisible"
        :product-name="fabApplication.productName"
        :candidates="revisionGuard.candidates"
        :loading="isLoadingRevision"
        @load="loadPreviousRevision"
        @skip="revisionDialogVisible = false"
      />
    </template>
    <ApplicationUnavailableMessage v-else></ApplicationUnavailableMessage>
  </template>

  <script lang="ts" setup>
  import { reactive, onMounted, onBeforeUnmount, ref, watch, nextTick } from "vue";
  import { convertPep8ToCamelCase2 } from "../../../utils/key-converter";
  import ApplicationTemplate from "./ApplicationTemplate.vue";
  import PreviousRevisionDialog from "./PreviousRevisionDialog.vue";
  import { initBom } from "../../../utils/Fab/bom-utils";
  import {
    SawType,
    FabWafer,
    FabWaferRecommendation,
    PstType,
    HsType,
    PstLayer,
    TcType,
    IdtType,
    IdtMachine,
    Layer,
    band,
    Bom
  } from "./../../../interface/fab-application-rev2";
  import {
    initFabApplication,
    initFabApplication2,
    initFabApplication3,
    getBandList,
    canCreateFabRequest,
  } from "../../../utils/Fab/fab-application-utils";
  import {
    revisionGuard,
    resetRevisionGuard,
    parseRevision,
    fetchPreviousRevisionCandidates,
    fetchFabRequest,
    applyProcessSections,
    takeProcessSnapshot,
    refillPhotoFromMemory,
  } from "../../../utils/Fab/fab-revision-utils";
  import { defineSawTypeByWaferType } from "../../../utils/Fab/fab_application-wafer-utils";
  // import {generateMachineOptionsForEtching} from "../../../utils/Fab/fab-application-deposition.utils"
  import { OptionInterface } from "../../../interface/option";
  import { getUserId, getUserName } from "../../../utils/account-utils";
  import axios from "axios";
  import { ElMessage } from "element-plus";
import ApplicationUnavailableMessage from "./ApplicationUnavailableMessage.vue";
import { sendGetRequest, sendPostRequest } from "../../../utils/httpProtocol";

  const bom = initBom();
  const { fabApplication } = initFabApplication3(bom);
  const bandList = ref<band[]>([]);
  const sawTypes = reactive<SawType[]>([]);
  const sawType = reactive<SawType>({});
  const isOnTime = ref<boolean>(true)

  // 이전 차수 불러오기
  const showForm = ref(true);              // 폼을 다시 그리기 위해 잠시 내렸다 올림
  const revisionDialogVisible = ref(false);
  const isLoadingRevision = ref(false);

  resetRevisionGuard();
  onBeforeUnmount(() => resetRevisionGuard());

  onMounted(async () => {
    fabApplication.requester.userName = getUserName();
    fabApplication.requester.id = getUserId();
    fabApplication.requesterId = getUserId();
    try {
      const response = await axios.get(
        "/fab_monitoring_rev2/get_saw_types_list"
      );
      const rawData = response.data;
      Object.assign(sawTypes , convertPep8ToCamelCase2(rawData))
    } catch (error) {
      console.error("Error fetching saw types:", error);
    }
    console.log('sawTypes', sawTypes);
    isOnTime.value = false
    isOnTime.value = await canCreateFabRequest()

  });

  // P/N 12자리 입력이 끝나면(0.5초 멈춤) 이전 차수 기록 확인
  let productNameTimer: ReturnType<typeof setTimeout> | undefined;
  watch(
    () => fabApplication.productName,
    (newName) => {
      clearTimeout(productNameTimer);
      productNameTimer = setTimeout(() => checkPreviousRevisions((newName ?? "").trim()), 500);
    }
  );

  // photo.vue 가 Photo 목록을 새로 만들면(배열 교체) 불러온 설비/Reticle 로 빈칸을 다시 채움
  watch(
    () => fabApplication.photo?.photoProcesses,
    () => refillPhotoFromMemory(fabApplication)
  );

  async function checkPreviousRevisions(productName: string) {
    const cur = parseRevision(productName);
    if (!cur || productName === revisionGuard.productName) return;

    // 같은 기종·같은 차수에서 변형만 바꾼 경우(3A→3B): 후보가 같으므로 다시 묻지 않음
    const prev = parseRevision(revisionGuard.productName);
    if (prev && revisionGuard.loadedFrom && prev.base === cur.base && prev.order === cur.order) {
      revisionGuard.productName = productName;
      return;
    }

    try {
      const candidates = await fetchPreviousRevisionCandidates(productName);
      if ((fabApplication.productName ?? "").trim() !== productName) return; // 그 사이 다시 바뀜
      revisionGuard.productName = productName;
      revisionGuard.candidates = candidates;
      revisionGuard.loadedFrom = "";
      revisionGuard.baseline = null;
      revisionGuard.photoMemory = null;
      revisionDialogVisible.value = candidates.length > 0;
    } catch (e) {
      console.error("이전 차수 조회 실패:", e);
    }
  }

  async function loadPreviousRevision(sourceProductName: string) {
    isLoadingRevision.value = true;
    try {
      const source = await fetchFabRequest(sourceProductName);
      const sourceSawType = defineSawTypeByWaferType(source.wafer?.sawTypeId, sawTypes);
      if (!sourceSawType) {
        ElMessage.error(`${sourceProductName}의 웨이퍼 종류를 확인할 수 없어 불러오지 못했습니다.`);
        return;
      }

      // 폼이 떠 있는 상태로 값을 바꾸면 각 섹션의 watch 가 값을 초기화하므로
      // 폼을 내린 뒤 데이터를 채우고 다시 그린다 (LoadApplication2 와 같은 방식)
      showForm.value = false;
      await nextTick();

      applyProcessSections(fabApplication, source, sourceSawType);
      Object.keys(sawType).forEach((k) => delete (sawType as any)[k]);
      Object.assign(sawType, sourceSawType);

      showForm.value = true;
      // 마운트 시 즉시 실행되는 watch 들이 정리한 뒤의 상태를 기준값으로 저장
      await nextTick();
      await new Promise((r) => setTimeout(r, 0));
      await nextTick();

      revisionGuard.baseline = takeProcessSnapshot(fabApplication);
      revisionGuard.loadedFrom = sourceProductName;
      revisionDialogVisible.value = false;
      ElMessage.success(`${sourceProductName}의 공정 조건을 불러왔습니다.`);
    } catch (e) {
      console.error("이전 차수 불러오기 실패:", e);
      showForm.value = true;
      ElMessage.error("이전 차수 공정 조건을 불러오지 못했습니다.");
    } finally {
      isLoadingRevision.value = false;
    }
  }

  function checkxxx(){

  }
  </script>

  <style>
  /* 스타일 정의 */
  </style>

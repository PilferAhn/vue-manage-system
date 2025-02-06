import type { TcType, Layer } from "../../interface/fab-application-rev2";

export function getLayerOptions(tcId: number, tcTypes: TcType[]): Layer[] | undefined {
    return tcTypes.find(tcType => tcType.tcId === tcId)?.layers;
  }
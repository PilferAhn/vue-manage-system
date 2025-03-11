import type { PstType, Layer } from "../../interface/fab-application-rev2";

export function getPstLayerOptions(
  pstId: number,
  pstTypes: PstType[]
): Layer[] | undefined {
  return pstTypes.find((pstType) => pstType.pstId === pstId)?.layers;
}
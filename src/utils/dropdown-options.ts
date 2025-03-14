import type { OptionBooleanInterface, OptionInterface } from "../interface/option";

export const filterTypeOptions: OptionInterface[] = [
  { key: 1, label: "Single", value: "Single" },
  { key: 2, label: "Dual", value: "Dual" },
  { key: 3, label: "Dual Duplexer", value: "Dual Duplexer" },
  { key: 4, label: "Duplexer", value: "Duplexer" },
  { key: 5, label: "Triplexer", value: "Triplexer" },
  { key: 6, label: "Triple filter", value: "Triple filter" },
  { key: 7, label: "Quad plexer", value: "Quad plexer" },
  { key: 8, label: "Quad Filter", value: "Quad Filter" },
  { key: 9, label: "Hexaplexer", value: "Hexaplexer" },
  { key: 10, label: "Multi Band Filter", value: "Multi Band Filter(" },
];

// 전체 객체의 타입을 정의하는 인터페이스
export const applicationGroupOptions: OptionInterface[] = [
  { key: 1, label: "요소기술그룹", value: "요소기술그룹" },
  { key: 2, label: "차세대공법그룹", value: "차세대공법그룹" },
  { key: 3, label: "차세대SAW그룹 - TEG", value: "차세대SAW그룹 - TEG" },
  { key: 4, label: "상품화개발 - TEG", value: "상품화개발 - TEG" },
  {
    key: 5,
    label: "차세대SAW그룹 - 제품(Product)",
    value: "차세대SAW그룹 - CHIP",
  },
  {
    key: 6,
    label: "상품화개발 - 제품(Product)",
    value: "상품화개발 - CHIP",
  },
];


export const TrueAndFalseOptions : OptionBooleanInterface[] = [
  {
    key : 1 , label : "O", value : true
  }
  ,
  {
    key : 2, label : "X", value : false
  }
]
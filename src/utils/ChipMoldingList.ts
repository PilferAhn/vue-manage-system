  import { ref } from "vue";
  // Define the OptionItem interface with all properties as strings
  interface OptionItem {
    key: string;
    label: string;
    value: string;
  }

export const chipMoldingList : OptionItem[]= [
    {
        "key": "0102W0R82NM",
        "label": "0102W0R82NM - Au Wire 99%",
        "value": "Au Wire 99%"
    },
    {
        "key": "0102W0R84NC",
        "label": "0102W0R84NC - Au Wire 99.99%",
        "value": "Au Wire 99.99%"
    },
    {
        "key": "0103W00180T",
        "label": "0103W00180T - FILM MOLDING ; 90MM*90MM,180T, A2029",
        "value": "FILM MOLDING ; 90MM*90MM,180T, A2029"
    },
    {
        "key": "0103W00200T",
        "label": "0103W00200T - EPOXY",
        "value": "EPOXY"
    },
    {
        "key": "0103W00230T",
        "label": "0103W00230T - EPOXY",
        "value": "EPOXY"
    },
    {
        "key": "0103W00260T",
        "label": "0103W00260T - EPOXY NITTO",
        "value": "EPOXY NITTO"
    },
    {
        "key": "0103W00A029",
        "label": "0103W00A029 - FILM MOLDING ; 90MM*90MM, 260T, A2029",
        "value": "FILM MOLDING ; 90MM*90MM, 260T, A2029"
    },
    {
        "key": "0103W00A12N",
        "label": "0103W00A12N - FILM MOLDING; 90MM*90MM,120T,A2029",
        "value": "FILM MOLDING; 90MM*90MM,120T,A2029"
    },
    {
        "key": "0103W00A24N",
        "label": "0103W00A24N - FILM MOLDING; 90MM*90MM, 240T, A2042, 방열",
        "value": "FILM MOLDING; 90MM*90MM, 240T, A2042, 방열"
    },
    {
        "key": "0103W00A26T",
        "label": "0103W00A26T - FILM MOLDING; 90MM*90MM,260T,AS-550AB,",
        "value": "FILM MOLDING; 90MM*90MM,260T,AS-550AB,"
    },
    {
        "key": "0103W00B24N",
        "label": "0103W00B24N - FILM MOLDING; 90MM*90MM, 240T, A2053, 방열",
        "value": "FILM MOLDING; 90MM*90MM, 240T, A2053, 방열"
    },
    {
        "key": "0103W00B26S",
        "label": "0103W00B26S - Sanyu EPOXY",
        "value": "Sanyu EPOXY"
    },
    {
        "key": "0103W00B26T",
        "label": "0103W00B26T - FILM MOLDING; 90MM*90MM,260T, AS-650AB",
        "value": "FILM MOLDING; 90MM*90MM,260T, AS-650AB"
    },
    {
        "key": "0103W00C23N",
        "label": "0103W00C23N - FILM MOLDING; 90MM*90MM,230T, A2063",
        "value": "FILM MOLDING; 90MM*90MM,230T, A2063"
    },
    {
        "key": "0103W0A200T",
        "label": "0103W0A200T - EPOXY 2LAYER",
        "value": "EPOXY 2LAYER"
    },
    {
        "key": "0103W0A230T",
        "label": "0103W0A230T - FILM MOLDING ; 90MM*90MM,230T,  A2038 (2",
        "value": "FILM MOLDING ; 90MM*90MM,230T,  A2038 (2"
    },
    {
        "key": "0103WE0087L",
        "label": "0103WE0087L - LOCTITE WHITE EPOXY",
        "value": "LOCTITE WHITE EPOXY"
    },
    {
        "key": "0103WE220BH",
        "label": "0103WE220BH - LIQUID EPOXY(G2BA,G2B0)",
        "value": "LIQUID EPOXY(G2BA,G2B0)"
    },
    {
        "key": "0103WE220WH",
        "label": "0103WE220WH - LIQUID EPOXY(G2S0,G1M0,G1K0)",
        "value": "LIQUID EPOXY(G2S0,G1M0,G1K0)"
    },
    {
        "key": "0103WE5423P",
        "label": "0103WE5423P - LIQUID EPOXY(G1R0,R4M0,R5C0,R4MD)",
        "value": "LIQUID EPOXY(G1R0,R4M0,R5C0,R4MD)"
    },
    {
        "key": "0103WEB087L",
        "label": "0103WEB087L - LOCTITE BLACK EPOXY",
        "value": "LOCTITE BLACK EPOXY"
    }
]

// Molding data array with provided values
export const moldingData = ref([
    { epoxyCode: '0103W00A029', thickness: '260T', type: '일반(1 LAYER)', filmType: 'A2029', company: 'NAGASE' },
    { epoxyCode: '0103W0A230T', thickness: '230T', type: '일반(2 LAYER)', filmType: 'A2038', company: 'NAGASE' },
    { epoxyCode: '0103W00C23N', thickness: '230T', type: '일반(2 LAYER)', filmType: 'A2063', company: 'NAGASE' },
    { epoxyCode: '0103W00B24N', thickness: '240T', type: '방열(1 LAYER)', filmType: 'A2053(방열)', company: 'NAGASE' },
    { epoxyCode: '0103W00B26T', thickness: '260T', type: '일반(2 LAYER)', filmType: 'AS-650AB', company: 'NITTO' },
    { epoxyCode: '0103W00A12N', thickness: '120T', type: '박형(1 LAYER)', filmType: 'A2029', company: 'NAGASE' }
  ])
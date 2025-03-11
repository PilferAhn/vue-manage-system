import type { Photo, PhotoProcess } from "../../interface/fab-application-rev2";
import { ref } from "vue";

export function initPhoto(){

    const p = ref<PhotoProcess[]>([
        {
            processName: "IDT",
            machineName: "",
            reticleName: "",
            isMutable: true,
            order: 1,
          },
          {
            processName: "브릿지",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 8,
          },
          {
            processName: "PAD",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 12,
          },
          {
            processName: "SiO",
            machineName: "Nikon",
            reticleName: "",
            isMutable: false,
            order: 13,
          },
    ])

    const photo = ref<Photo>({})
    photo.value.photoProcesses = p.value

    return photo.value

}
import { ref, watch } from "vue";


export interface CER0FormType {

    applicationUuid: boolean;

    // 
    requesterId : boolean;
    requesterName : boolean;

    dateOfCreated : boolean;
    dateOfStart : boolean;
    dateOfWishToFinsih: boolean;
    dateOfCompleted:boolean ;

    modelName : boolean;
    version : boolean;

    m1Thick : boolean;
    layerStack : boolean;
    lotId : boolean;
    waferId : boolean;
    shot : boolean;
    note : boolean;

    assignTo : boolean;
    status : boolean;

  }

  export function initCER0FormType() {
    const form = ref<CER0FormType>({

        applicationUuid: false,

        
        requesterId : true,
        requesterName : true,

        dateOfCreated : true,
        dateOfStart : false,
        dateOfWishToFinsih: false,
        dateOfCompleted:  false,
    
        modelName : true,
        version : true,
    
        m1Thick : true,
        layerStack : true,
        lotId : true,
        waferId : true,
        shot : true,
        note : true,
    
        assignTo : true,
        status : true
    });
  
    return {
      form,
    };
  }
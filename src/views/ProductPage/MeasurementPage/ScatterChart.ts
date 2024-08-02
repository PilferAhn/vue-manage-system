const graphList = ["Input vs BW [Mhz]", "Input vs Output", "Input vs LF [MHz] @ -10dB", "Input vs RF [MHz] @ -10dB"]
interface scaleInfo {
    xMax : number, 
    xMin : number, 
    yMax : number, 
    yMin : number
}


interface DataPoint {
  x: number;
  y: number;
}

interface Dataset {
  label: string;
  data: DataPoint[];
  backgroundColor: string;
  borderColor: string;
}


export function getMinMax(dataset : Dataset[], chartTitle : string){

    

    let xMax : number = -Infinity
    let yMax : number = -Infinity
    let xMin : number = -Infinity
    let yMin : number = Infinity


    dataset.map((spl , index) => {

        const points = spl.data
        const xList = []
        const yList = []

        points.map((point) => {

            xList.push(point.x)
            yList.push(point.y)

        })

        let tempMinX = Math.min(...xList)        
        let tempMaxX = Math.max(...xList)

        let tempMinY = Math.min(...yList)
        let tempMaxY = Math.max(...yList)

        if(points.length >= 1 && chartTitle === "Input vs Output"){
            
            
            
            const startY = points[0].y
            
            if (tempMinY < startY){
                tempMinY = startY
            
            }

        }

        if (tempMaxX > xMax){
            xMax = tempMaxX
        }

        if (tempMinX > xMin){
            xMin = tempMinX
        }

        if (tempMaxY > yMax){
            yMax = tempMaxY
        }

        if (tempMinY < yMin){
            yMin = tempMinY
        }

    })

    if(chartTitle === "Input vs Output"){
        yMin = yMin - 0.5
        
    }
    else{
        yMin = yMin - 0.2//* 1.02
        yMax = yMax + 0.2//* 1.02
    }

    

    return {"xMax" : xMax.toFixed(2), "xMin" : xMin.toFixed(2), "yMax" : yMax.toFixed(2), "yMin" : yMin.toFixed(2)}
}
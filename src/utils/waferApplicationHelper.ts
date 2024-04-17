// Exporting the wafer size list for use in other files
export const waferSizeList: string[] = ["4 Inch (0.5CM) ", "4 Inch (1CM)", "6 Inch"];

// Types for the return object of the function
interface WaferInfo {
    shots: string[];
    disableShots: string[];
    size: number;
    status: string[];
}

// Function to get wafer information based on the size
export function getWaferInfoBySize(waferSize: string): WaferInfo {
    let disableShot: string[] = [];
    let size: number = 0;
    const shots: string[] = [];

    if (waferSize === "4 Inch (1CM)") {
        const tempDisableShot: string[] = [];
        size = 9;
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (x + 1 === 5 && y + 1 === 5) {
                    tempDisableShot.push(`${y + 1},${x + 1}`);
                } else if (x + 1 === 1 || y + 1 === 1 || x + 1 === 9 || y + 1 === 9) {
                    tempDisableShot.push(`${y + 1},${x + 1}`);
                }
            }
        }
        // tempDisableShot.push("2,2")
        // tempDisableShot.push("8,2")
        // tempDisableShot.push("2,8")
        // tempDisableShot.push("8,8")
        disableShot = tempDisableShot;
    } else {
        size = 13;
        disableShot = [
            "1,1", "2,1", "3,1", "4,1", "10,1", "11,1", "12,1", "13,1",
            "1,2", "2,2", "12,2", "13,2",
            "1,3", "13,3",
            "1,4", "13,4",
            "7,7",
            "1,10", "13,10",
            "1,11", "13,11",
            "1,12", "2,12", "12,12", "13,12",
            "1,13", "2,13", "3,13", "4,13", "10,13", "11,13", "12,13", "13,13",
        ];
    }

    // Generate all shots
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            shots.push(`${y + 1},${x + 1}`);
        }
    }

    // Initialize status array
    const status: string[] = new Array(shots.length).fill("deactivate");

    // Set status to 'disable' where necessary
    shots.forEach((shot, index) => {
        if (disableShot.includes(shot)) {
            status[index] = "disable";
        }
    });

    return {
        shots,
        disableShots: disableShot,
        size,
        status
    };
}

import { vehicleDNAData } from './data/vehicle-dna';
import { engineDNAData } from './data/engine-dna';
import { trimLevelsData } from './data/trim-levels';

let missingStrengths = 0;
let missingWeaknesses = 0;
let missingChronicIssues = 0;

let missingInfoVehicles = [];

for (const v of vehicleDNAData) {
    let missingStr = v.strengths && v.strengths.length === 0;
    let missingWeak = v.weaknesses && v.weaknesses.length === 0;
    let missingChronic = v.chronicIssues && v.chronicIssues.length === 0;
    
    if (missingStr || missingWeak || missingChronic) {
        missingInfoVehicles.push(v.brand + ' ' + v.model);
        if (missingStr) missingStrengths++;
        if (missingWeak) missingWeaknesses++;
        if (missingChronic) missingChronicIssues++;
    }
}

console.log('Total vehicles:', vehicleDNAData.length);
console.log('Missing Strengths:', missingStrengths);
console.log('Missing Weaknesses:', missingWeaknesses);
console.log('Missing Chronic Issues:', missingChronicIssues);
console.log('Vehicles missing any DNA data:', missingInfoVehicles.length);
if (missingInfoVehicles.length > 0) {
    console.log('Sample missing:', missingInfoVehicles.slice(0, 15));
}

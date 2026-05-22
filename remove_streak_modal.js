const fs = require('fs');

// 1. Remove DailyStreakModal from Navbar.tsx
let navbar = fs.readFileSync('components/Navbar.tsx', 'utf-8');
navbar = navbar.replace(/import DailyStreakModal from "@\/components\/DailyStreakModal";\r?\n/g, '');

const modalStart = navbar.indexOf('<DailyStreakModal');
if (modalStart !== -1) {
    const modalEnd = navbar.indexOf('/>', modalStart) + 2;
    navbar = navbar.substring(0, modalStart) + navbar.substring(modalEnd);
}
fs.writeFileSync('components/Navbar.tsx', navbar, 'utf-8');

// 2. Remove from GlobalEngagement.tsx
if (fs.existsSync('components/GlobalEngagement.tsx')) {
    let ge = fs.readFileSync('components/GlobalEngagement.tsx', 'utf-8');
    ge = ge.replace(/import DailyStreakModal from ".\/DailyStreakModal";\r?\n/g, '');
    
    const geModalStart = ge.indexOf('<DailyStreakModal');
    if (geModalStart !== -1) {
        const geModalEnd = ge.indexOf('/>', geModalStart) + 2;
        ge = ge.substring(0, geModalStart) + ge.substring(geModalEnd);
    }
    fs.writeFileSync('components/GlobalEngagement.tsx', ge, 'utf-8');
}

// 3. Delete DailyStreakModal.tsx
if (fs.existsSync('components/DailyStreakModal.tsx')) {
    fs.unlinkSync('components/DailyStreakModal.tsx');
}
console.log('DailyStreakModal removed entirely.');

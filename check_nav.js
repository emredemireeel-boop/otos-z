const fs = require('fs');

// Check Navbar notifications
const nav = fs.readFileSync('components/Navbar.tsx', 'utf8');
const notifLines = nav.split('\n').slice(33, 48);
notifLines.forEach((l, i) => console.log((34+i) + ': ' + l.substring(0, 100)));

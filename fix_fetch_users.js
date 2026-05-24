const fs = require('fs');
const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldFetchUsers = `    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = collection(db, 'users');
                const snap = await getDocs(usersRef);
                const userMap: Record<string, { photoURL: string | null }> = {};
                const allUsers = snap.docs.map(d => {
                    const data = d.data();
                    if (data.username) {
                        userMap[data.username] = { photoURL: data.photoURL || null };
                    }
                    return {
                        username: data.username || 'anonim',
                        role: data.role || 'caylak',
                        entryCount: data.entryCount || 0,
                    };
                });
                setGlobalUserMap(userMap);
                setPlatformStats(prev => ({ ...prev, totalUsers: allUsers.length }));
                // En aktif yazarlari sirala
                allUsers.sort((a, b) => (b.entryCount || 0) - (a.entryCount || 0));
                setTopUsers(allUsers.slice(0, 5));
            } catch (e) {
                console.error('Top users cekilemedi:', e);
            }
        };
        fetchUsers();
    }, []);`;

const newFetchUsers = `    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { getCountFromServer } = await import("firebase/firestore");
                const usersRef = collection(db, 'users');
                
                try {
                    const snapshot = await getCountFromServer(usersRef);
                    setPlatformStats(prev => ({ ...prev, totalUsers: snapshot.data().count }));
                } catch(e) { console.error('Count error', e); }

                const topUsersQuery = query(usersRef, orderBy('entryCount', 'desc'), limit(5));
                const snap = await getDocs(topUsersQuery);
                
                const topUsersList = snap.docs.map(d => {
                    const data = d.data();
                    return {
                        username: data.username || 'anonim',
                        role: data.role || 'caylak',
                        entryCount: data.entryCount || 0,
                        photoURL: data.photoURL || null
                    };
                });
                setTopUsers(topUsersList);
                
                const userMap: Record<string, { photoURL: string | null }> = {};
                topUsersList.forEach(u => {
                    userMap[u.username] = { photoURL: u.photoURL };
                });
                setGlobalUserMap(userMap);
                
            } catch (e) {
                console.error('Top users cekilemedi:', e);
            }
        };
        fetchUsers();
    }, []);`;

content = content.replace(oldFetchUsers, newFetchUsers);

fs.writeFileSync(path, content);
console.log("Fixed fetchUsers in page.tsx");

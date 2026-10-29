// Every SDK-bearing service is loaded only by an authenticated effect or action.
type Forum=typeof import('./forumService');
export async function createThread(...args:Parameters<Forum['createThread']>){return (await import('./forumService')).createThread(...args);}
export async function getThreadBySlug(...args:Parameters<Forum['getThreadBySlug']>){return (await import('./forumService')).getThreadBySlug(...args);}
export async function addEntry(...args:Parameters<Forum['addEntry']>){return (await import('./forumService')).addEntry(...args);}
export async function toggleLike(...args:Parameters<Forum['toggleLike']>){return (await import('./forumService')).toggleLike(...args);}
export async function incrementViews(...args:Parameters<Forum['incrementViews']>){return (await import('./forumService')).incrementViews(...args);}
export function subscribeToThreads(...args:Parameters<Forum['subscribeToThreads']>){
    let disposed=false,unsubscribe=()=>{};
    void import('./forumService').then(service=>{if(!disposed)unsubscribe=service.subscribeToThreads(...args);}).catch(error=>console.warn('Başlıklar güncellenemedi:',error));
    return ()=>{disposed=true;unsubscribe();};
}
export function subscribeToEntries(...args:Parameters<Forum['subscribeToEntries']>){
    let disposed=false,unsubscribe=()=>{};
    void import('./forumService').then(service=>{if(!disposed)unsubscribe=service.subscribeToEntries(...args);}).catch(error=>console.warn('Yanıtlar güncellenemedi:',error));
    return ()=>{disposed=true;unsubscribe();};
}
export async function clientDatabase(){const [sdk,{db}]=await Promise.all([import('firebase/firestore'),import('./firebase')]);return {...sdk,db};}
export async function startConversation(...args:Parameters<typeof import('./messageService').startConversation>){return (await import('./messageService')).startConversation(...args);}
export async function rateUser(...args:Parameters<typeof import('./userService').rateUser>){return (await import('./userService')).rateUser(...args);}
export async function getMyRatingForUser(...args:Parameters<typeof import('./userService').getMyRatingForUser>){return (await import('./userService')).getMyRatingForUser(...args);}

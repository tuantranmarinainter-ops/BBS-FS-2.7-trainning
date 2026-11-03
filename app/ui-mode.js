// UI preference is independent of projects and lesson progress.
export const UI_MODE_KEY='bbs-training:ui-mode:v1';
export const UI_MODES=Object.freeze(['current','bbs']);
export function normalizeUiMode(value){return UI_MODES.includes(value)?value:'current'}
export function readUiMode(storage){
 try{return normalizeUiMode(storage?.getItem(UI_MODE_KEY))}catch{return 'current'}
}
export function applyUiMode(doc,mode,storage){
 const next=normalizeUiMode(mode), select=doc.getElementById('ui-mode');
 doc.body.dataset.interface=next;
 if(select)select.value=next;
 try{storage?.setItem(UI_MODE_KEY,next)}catch{/* Session-only preference if storage is unavailable. */}
 return next;
}
export function initUiMode(doc,storage){
 const select=doc.getElementById('ui-mode');
 applyUiMode(doc,readUiMode(storage),storage);
 select?.addEventListener('change',()=>applyUiMode(doc,select.value,storage));
}

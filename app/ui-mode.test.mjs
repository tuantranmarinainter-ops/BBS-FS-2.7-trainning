import test from 'node:test';
import assert from 'node:assert/strict';
import { UI_MODE_KEY, normalizeUiMode, readUiMode, applyUiMode, initUiMode } from './ui-mode.js';
function setup(value=null){
 const data=new Map(value===null?[]:[[UI_MODE_KEY,value]]);
 const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 const select={value:'',addEventListener(type,fn){this.handler=fn}};
 const doc={body:{dataset:{}},getElementById:id=>id==='ui-mode'?select:null};
 return {storage,select,doc,data};
}
test('default and invalid preference use the existing interface',()=>{
 assert.equal(normalizeUiMode('other'),'current');
 for(const initial of [null,'bad']){const {storage,doc}=setup(initial);initUiMode(doc,storage);assert.equal(doc.body.dataset.interface,'current')}
});
test('switch persists and restores without touching project storage',()=>{
 const a=setup();a.data.set('project','keep');initUiMode(a.doc,a.storage);
 a.select.value='bbs';a.select.handler();assert.equal(a.doc.body.dataset.interface,'bbs');
 assert.equal(a.data.get(UI_MODE_KEY),'bbs');assert.equal(a.data.get('project'),'keep');
 const doc2={body:{dataset:{}},getElementById:()=>({value:''})};
 initUiMode(doc2,a.storage);assert.equal(doc2.body.dataset.interface,'bbs');
 a.select.value='current';a.select.handler();assert.equal(a.doc.body.dataset.interface,'current');
});
test('blocked storage falls back and switching still works',()=>{
 const {doc,select}=setup();const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 assert.equal(readUiMode(blocked),'current');initUiMode(doc,blocked);select.value='bbs';select.handler();
 assert.equal(doc.body.dataset.interface,'bbs');
});
test('missing selector is safe',()=>assert.equal(applyUiMode({body:{dataset:{}},getElementById:()=>null},'bbs',null),'bbs'));

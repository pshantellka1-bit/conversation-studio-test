import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
const password='example-test-password-456';
const port=18923;
const base='http://127.0.0.1:'+port;
const auth='Basic '+Buffer.from('tester:'+password).toString('base64');
const child=spawn(process.execPath,['server.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port),STUDIO_PASSWORD:password,OPENAI_API_KEY:''},stdio:'ignore'});
async function ready(){for(let i=0;i<40;i++){try{const r=await fetch(base+'/health',{headers:{authorization:auth}});if(r.ok)return}catch{}await new Promise(r=>setTimeout(r,100))}throw Error('Server did not become ready')}
test('protected mobile prototype and chapter-scoped API',async()=>{
 await ready();
 try{
  const unauthorized=await fetch(base+'/characters');
  assert.equal(unauthorized.status,401);
  const page=await fetch(base+'/characters',{headers:{authorization:auth}});
  assert.equal(page.status,200);
  const html=await page.text();
  assert.match(html,/Character Conversations/);
  assert.match(html,/Cinematic/);
  const response=await fetch(base+'/api/character-chat',{method:'POST',headers:{authorization:auth,'content-type':'application/json'},body:JSON.stringify({characterId:'mara',chapter:1,mode:'natural',persona:'character',question:'Tell me about the compass.'})});
  assert.equal(response.status,200);
  const data=await response.json();
  assert.equal(data.demo,true);
  assert.equal(data.name,'Mara Vale');
  assert.equal(data.reply.includes('missing sister'),false);
  const invalid=await fetch(base+'/api/character-chat',{method:'POST',headers:{authorization:auth,'content-type':'application/json'},body:JSON.stringify({characterId:'mara',chapter:99,mode:'natural',persona:'character',question:'Test'})});
  assert.equal(invalid.status,400);
 }finally{child.kill()}
});

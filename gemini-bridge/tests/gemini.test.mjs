import test from "node:test";
import assert from "node:assert/strict";
import {verifyConfig,makePrompt,writeScene} from "../src/gemini.mjs";
const env={GEMINI_API_KEY:"test-key-not-a-real-secret",GEMINI_MODEL:"gemini-3.6-flash"};
const args={sceneBrief:"Draft an extended first-person scene in a classroom, keeping the author's instructions.",canon:"Leave the scar origin unknown.",targetWords:1200};
test("fails closed without configuration",()=>assert.throws(()=>verifyConfig({}),/not connected/));
test("refuses unsupported models",()=>assert.throws(()=>verifyConfig({...env,GEMINI_MODEL:"unsupported"}),/blocked/));
test("passes canon forward",()=>assert.match(makePrompt(args),/scar origin unknown/));
test("returns verbatim model text",async()=>{
 let calls=0;
 const out=await writeScene(args,{env,fetchFn:async()=>{calls++;return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:"Sample from Gemini."}]},finishReason:"STOP"}]})};}});
 assert.equal(calls,1);assert.equal(out.scene,"Sample from Gemini.");assert.equal(out.complete,true);
});
test("quota denial does not trigger retries",async()=>{
 let calls=0;
 await assert.rejects(()=>writeScene(args,{env,fetchFn:async()=>{calls++;return {ok:false,status:429};}}),/quota exceeded/);
 assert.equal(calls,1);
});

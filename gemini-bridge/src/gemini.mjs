export const FREE_MODELS=Object.freeze(["gemini-3.6-flash","gemini-3.7-flash","gemini-3.8-flash","gemini-2.5-flash","gemini-2.5-flash-lite"]);
export class BridgeError extends Error { constructor(msg,code=400){ super(msg);this.status=code; } }
export function verifyConfig(env=process.env) {
  if(!env.GEMINI_API_KEY || env.GEMINI_API_KEY.length<12) throw new BridgeError("Gemini not connected: configure a free-tier key privately.",503);
  const model=env.GEMINI_MODEL||"gemini-3.6-flash";
  if(!FREE_MODELS.includes(model)) throw new BridgeError("Model blocked; no automatic paid fallback.",403);
  return {model,key:env.GEMINI_API_KEY};
}
export function makePrompt({sceneBrief,canon="",styleNotes="",targetWords=1300}) {
  if(typeof sceneBrief!=="string"||sceneBrief.trim().length<30||sceneBrief.length>30000) throw new BridgeError("Scene brief must be 30–30000 characters.");
  if(typeof canon!=="string"||canon.length>80000||typeof styleNotes!=="string"||styleNotes.length>12000) throw new BridgeError("Canon or style reference too long.");
  if(!Number.isInteger(targetWords)||targetWords<400||targetWords>2400) throw new BridgeError("Target words must be 400–2400.");
  return "SCENE BRIEF:\n"+sceneBrief.trim()+"\n\nTARGET WORDS: "+targetWords+
    (canon.trim()?"\n\nVERIFIED CANON — don't invent unresolved backstory:\n"+canon.trim():"")+
    (styleNotes.trim()?"\n\nSTYLE NOTES:\n"+styleNotes.trim():"");
}
const systemInstruction="Write a complete first-person fiction scene in the exact POV, tense and order requested. Dialogue must live inside first-person experience with selective observation, interiority, ongoing action, natural sustained speech and subtext. Avoid formulaic action beats, generic banter, and invented origins for withheld history. Respect verified canon. Write only the actual scene; it is not approved canon.";
export async function writeScene(args,{env=process.env,fetchFn=fetch}={}) {
  const {model,key}=verifyConfig(env);
  const prompt=makePrompt(args);
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),125000);
  try{
    const url="https://generativelanguage.googleapis.com/v1beta/models/"+encodeURIComponent(model)+":generateContent";
    const response=await fetchFn(url,{method:"POST",
      headers:{"Content-Type":"application/json","x-goog-api-key":key},
      body:JSON.stringify({systemInstruction:{parts:[{text:systemInstruction}]},
        contents:[{role:"user",parts:[{text:prompt}]}],
        generationConfig:{temperature:0.95,maxOutputTokens:10000}}),
      signal:controller.signal});
    if(!response.ok){
      if(response.status===429) throw new BridgeError("Gemini free-tier quota exceeded. No paid fallback attempted.",429);
      if([401,403].includes(response.status)) throw new BridgeError("Gemini key or access rejected.",403);
      if(response.status===404) throw new BridgeError("Model not accessible; no paid fallback attempted.",404);
      throw new BridgeError("Gemini HTTP error "+response.status,502);
    }
    const data=await response.json();
    const candidate=data?.candidates?.[0];
    const scene=candidate?.content?.parts?.filter(x=>typeof x.text==="string").map(x=>x.text).join("")||"";
    if(!scene.trim()) throw new BridgeError("Gemini returned no scene.",502);
    return {source:"Google Gemini API (unmodified model output)",model,scene,
      finishReason:candidate?.finishReason||"UNKNOWN",
      complete:candidate?.finishReason==="STOP",
      notice:"Draft only; verify canon before saving."};
  }catch(e){
    if(e instanceof BridgeError) throw e;
    if(e.name==="AbortError") throw new BridgeError("Google request timed out; no fallback.",504);
    throw new BridgeError("Gemini connection unavailable; no fallback.",502);
  }finally{clearTimeout(timeout);}
}

import http from "node:http";
import {timingSafeEqual} from "node:crypto";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StreamableHTTPServerTransport} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {z} from "zod";
import {writeScene,verifyConfig} from "./src/gemini.mjs";

const token=process.env.BRIDGE_ACCESS_TOKEN;
const port=Number(process.env.PORT||3000);
function authorized(req) {
  if(!token||token.length<24)return false;
  const a=Buffer.from(req.headers.authorization||"");
  const b=Buffer.from("Bearer "+token);
  return a.length===b.length && timingSafeEqual(a,b);
}
function send(res,status,data) {
  res.writeHead(status,{"Content-Type":"application/json; charset=utf-8",
  "Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});
  res.end(JSON.stringify(data));
}
function newMcp() {
  const mcp=new McpServer({name:"gemini-fiction-bridge",version:"0.1.0"});
  mcp.tool("gemini_write_scene",
    "Call the ACTUAL Google Gemini model and return its draft without alteration. Only when user explicitly requests Gemini.",
    {sceneBrief:z.string().min(30).max(30000),canon:z.string().max(80000).optional(),
     styleNotes:z.string().max(12000).optional(),targetWords:z.number().int().min(400).max(2400).optional()},
    async args=>{
      try{return {content:[{type:"text",text:JSON.stringify(await writeScene(args))}]};}
      catch(err){return {isError:true,content:[{type:"text",text:err.message||"Gemini request failed"}]};}
    });
  mcp.tool("gemini_bridge_status","Check bridge setup without sending novel text.",{},async()=>{
    try {
      const {model}=verifyConfig();
      return {content:[{type:"text",text:JSON.stringify({configured:true,model,
        warning:"Verify actual Free Tier in Google AI Studio; this API cannot check billing."})}]};
    }catch(err){
      return {content:[{type:"text",text:JSON.stringify({configured:false,reason:err.message})}]};
    }
  });
  return mcp;
}
async function route(req,res) {
  if(req.url==="/health"&&req.method==="GET")
    return send(res,200,{status:"online",connectedGeminiNotVerified:true});
  if(req.url!=="/mcp")return send(res,404,{error:"Not found"});
  if(!authorized(req)){
    res.setHeader("WWW-Authenticate","Bearer");
    return send(res,401,{error:"Authorized bridge connection required"});
  }
  if(!["GET","POST","DELETE"].includes(req.method))
    return send(res,405,{error:"Method not allowed"});
  if(Number(req.headers["content-length"]||0)>500000)
    return send(res,413,{error:"Payload too large"});
  const server=newMcp();
  const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined});
  try{await server.connect(transport);await transport.handleRequest(req,res);}
  catch(e){if(!res.headersSent)send(res,500,{error:"Bridge processing failed"});else if(!res.writableEnded)res.end();}
  finally{await server.close().catch(()=>{});}
}
http.createServer((req,res)=>{route(req,res).catch(()=>{
  if(!res.headersSent)send(res,500,{error:"Unexpected bridge failure"});
});}).listen(port,"0.0.0.0",()=>console.log("Gemini bridge MCP listening."));

import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,sep,extname} from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const port=Number(process.env.PORT || 8080);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.jpg':'image/jpeg','.png':'image/png'};
createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  const relative=pathname==='/'?'index.html':pathname.slice(1);
  const target=resolve(root,relative);
  if(!target.startsWith(root.endsWith(sep)?root:root+sep)||relative.split(/[\\/]/).some(p=>p.startsWith('.'))||!types[extname(target)]){res.writeHead(404).end();return;}
  const bytes=await readFile(target);
  res.writeHead(200,{'Content-Type':types[extname(target)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:bytes);
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Không tìm thấy tệp.');}
}).listen(port,'127.0.0.1',()=>console.log(`BBS FS Trainer: http://localhost:${port}`));

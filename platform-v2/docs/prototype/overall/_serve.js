/* 本地原型静态服务器：在当前目录执行 node _serve.js。 */
const fs=require('fs');
const http=require('http');
const path=require('path');

const root=__dirname;
const host=['127','0','0','1'].join('.');
const port=Number(process.env.PROTOTYPE_PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};

http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://'+host).pathname);}catch(e){res.writeHead(400);return res.end('bad request');}
  const relative=pathname.replace(/^\/+/, '')||'index.html';
  const file=path.resolve(root,relative);
  if(file.indexOf(root)!==0){res.writeHead(403);return res.end('forbidden');}
  fs.readFile(file,(error,data)=>{
    if(error){res.writeHead(404);return res.end('not found');}
    res.writeHead(200,{'content-type':types[path.extname(file).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});
    res.end(data);
  });
}).listen(port,host,()=>console.log('安全管理平台原型已启动：http://'+host+':'+port+'/'));

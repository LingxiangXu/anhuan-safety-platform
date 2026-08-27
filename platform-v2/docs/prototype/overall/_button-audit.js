/* 全按钮静态审计：检查按钮绑定、inline handler 全局暴露、跳转目标和抽屉显示契约。 */
const fs=require('fs'),path=require('path');
const root=__dirname;
/* 独立设计参考稿不属于整体原型导航与交互验收范围。 */
const excluded=new Set(['一点课程opl-培训台账原型.html','一线使用优化建议.html']);
const pages=fs.readdirSync(root).filter(x=>x.endsWith('.html')&&!excluded.has(x)).concat(['oa/index.html']);
const ignored=new Set(['location','document','window','this']);
let failed=0,totalButtons=0,totalHandlers=0;

function fail(page,message){failed++;console.log('✗ '+page+' · '+message);}
function uniq(xs){return [...new Set(xs)].sort();}

for(const page of pages){
  const full=path.join(root,page),html=fs.readFileSync(full,'utf8');
  const scripts=[...html.matchAll(/<script\s+src=["']([^"']+\.js)["']/g)].map(x=>path.resolve(path.dirname(full),x[1])).filter(x=>x.indexOf(root)===0&&fs.existsSync(x)).map(x=>fs.readFileSync(x,'utf8'));
  const raw=html+'\n'+scripts.join('\n');
  const buttons=[...html.matchAll(/<button\b[^>]*>/g)].map(x=>x[0]);
  totalButtons+=buttons.length;
  const calls=uniq([...html.matchAll(/onclick="\s*([A-Za-z_$][\w$]*)\s*\(/g)].map(x=>x[1]).filter(x=>!ignored.has(x)));
  const exports=new Set([...raw.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=/g)].map(x=>x[1]));
  totalHandlers+=calls.length;
  const missing=calls.filter(x=>!exports.has(x));
  if(missing.length)fail(page,'inline handler 未暴露到 window：'+missing.join(', '));

  const ids=uniq([...raw.matchAll(/<button\b[^>]*\bid="([A-Za-z0-9_-]+)"[^>]*>/g)].map(x=>x[1]));
  const assigned=new Set([...raw.matchAll(/getElementById\(["']([A-Za-z0-9_-]+)["']\)\.onclick/g)].map(x=>x[1]));
  for(const id of ids){
    const tag=buttons.find(x=>new RegExp('\\bid="'+id+'"').test(x))||'';
    if(!/onclick=/.test(tag)&&!assigned.has(id))fail(page,'按钮 #'+id+' 没有 onclick 或脚本绑定');
  }

  for(const tag of buttons){
    if(/onclick=|data-close|\bid=|\bm-photo\b|\bpermit-start-photo\b|\bpermit-process-photo\b|type="submit"/.test(tag))continue;
    fail(page,'发现无绑定按钮：'+tag.replace(/\s+/g,' ').slice(0,140));
  }

  const targets=uniq([
    ...[...html.matchAll(/location\.href\s*=\s*\\?["']([^'"\\]+\.html)/g)].map(x=>x[1]),
    ...[...html.matchAll(/(?:data-)?href=\\?["']([^'"\\]+\.html)/g)].map(x=>x[1])
  ]);
  for(const target of targets){if(!fs.existsSync(path.resolve(path.dirname(full),target)))fail(page,'跳转目标不存在：'+target);}
  if(!missing.length)console.log('✓ '+page+' · '+buttons.length+' 个按钮，'+calls.length+' 个 inline handler');
}

const ui=fs.readFileSync(path.join(root,'assets','ui.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets','app.css'),'utf8');
if(!/className="drawer show /.test(ui))fail('assets/ui.js','抽屉创建时未添加 show 状态');
if(!/\.drawer\.show\s*\{[^}]*display:flex/.test(css))fail('assets/app.css','缺少 drawer.show 可见样式');
for(const contract of [
  ['.nav-item','一级菜单'],['.nav-sub-item','左侧页签'],['.mobile-entry','移动现场入口'],['.rm-item','角色切换']
]){
  const selector=contract[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  if(!new RegExp('querySelectorAll\\("'+selector+'"\\)').test(ui))fail('assets/ui.js',contract[1]+'没有统一点击绑定');
}
const permits=fs.readFileSync(path.join(root,'work-permits.html'),'utf8');
if(!/查看归档档案[\s\S]{0,160}openPermit|openPermit[\s\S]{0,160}查看归档档案/.test(permits))fail('work-permits.html','查看归档档案没有关联详情抽屉');
if(!/window\.openPermit=openPermit/.test(permits))fail('work-permits.html','归档详情函数未暴露给按钮');

console.log('===== 全按钮静态审计：页面 '+pages.length+'，按钮 '+totalButtons+'，handler '+totalHandlers+'，失败 '+failed+' =====');
process.exit(failed?1:0);

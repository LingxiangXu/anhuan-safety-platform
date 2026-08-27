/* 风险管理与巡检管理主流程回归，覆盖本轮确认的业务规则。 */
const fs=require('fs'),path=require('path'),http=require('http'),puppeteer=require('puppeteer');
const root=__dirname;
function server(){return new Promise(resolve=>{const s=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost');const rel=decodeURIComponent(u.pathname).replace(/^\/+/, '')||'index.html';const file=path.resolve(root,rel);if(file.indexOf(root)!==0){res.writeHead(403);return res.end();}fs.readFile(file,(e,b)=>{if(e){res.writeHead(404);res.end();return;}const ext=path.extname(file);res.writeHead(200,{'content-type':ext==='.html'?'text/html; charset=utf-8':ext==='.js'?'text/javascript; charset=utf-8':ext==='.css'?'text/css; charset=utf-8':'application/octet-stream','cache-control':'no-store'});res.end(b);});});s.listen(0,'localhost',()=>resolve({s,base:'http://localhost:'+s.address().port+'/'}));});}
(async()=>{
  const srv=await server(),browser=await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-gpu']}),page=await browser.newPage();
  await page.setViewport({width:1440,height:900});const errors=[];let pass=0,fail=0;
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));const ok=n=>{pass++;console.log('✓ '+n);};const bad=(n,d)=>{fail++;console.log('✗ '+n+(d?' · '+d:''));};
  async function open(url){await page.goto(srv.base+url,{waitUntil:'load'});await sleep(120);}
  await open('index.html');await page.evaluate(()=>localStorage.clear());

  await open('risks.html?tab=tasks');
  if(/tab=ledger/.test(page.url())&&!await page.evaluate(()=>document.body.innerText.includes('辨识任务列表')))ok('风险辨识任务入口已移除，旧地址回到风险台账');else bad('风险辨识任务入口仍可见',page.url());
  await open('risks.html?tab=changes');
  if(/tab=changes/.test(page.url())&&await page.evaluate(()=>document.body.innerText.includes('变更与人工复评')))ok('风险变更/人工复评入口可访问');else bad('风险变更/人工复评入口');

  await open('risks.html?tab=ledger');
  const riskCheck=await page.evaluate(()=>{
    App.currentRole='team_leader';
    const h={id:'HZ-VERIFY-1',name:'验证危险源',accidentType:'机械伤害',L:3,E:3,C:15,D:135,level:{key:'common',name:'一般',method:'lec',L:3,E:3,C:15,D:135},assessmentStatus:'已完成',measures:[]};
    const d={id:'RV-VERIFY-1',version:'V1.0',status:'草稿',riskId:'R-VERIFY',riskName:'审核校验风险点',org:'造型作业区',location:'验证区域',responsibilityPost:'班组长',category:'作业活动风险',hazards:[h]};
    App.risks.unshift({id:'R-VERIFY',code:'RISK-VERIFY',name:d.riskName,org:d.org,location:d.location,responsibilityPost:'班组长',category:d.category,status:'草稿',version:'V1.0',level:'common',hazards:[h],draftVersion:d,versions:[]});App._emit();
    initiateApproval('R-VERIFY');const blocked=App.risk.byId('R-VERIFY').draftVersion.status==='草稿';
    h.measures.push({id:'M-VERIFY',type:'管理措施',name:'作业前确认防护装置'});App.risk.byId('R-VERIFY').draftVersion.hazards[0].measures=h.measures;initiateApproval('R-VERIFY');const submitted=App.risk.byId('R-VERIFY').draftVersion.status==='待作业区负责人审核';App.currentRole='section_manager';approveRisk('R-VERIFY');const safety=App.risk.byId('R-VERIFY').draftVersion.status==='待二级单位安全管理审核';App.currentRole='company_safety';approveRisk('R-VERIFY');const r=App.risk.byId('R-VERIFY');
    return {blocked,submitted,safety,published:r.status==='已发布'&&!r.draftVersion&&r.currentVersion==='V1.0',versioned:(r.versions||[]).length>0};
  });
  if(riskCheck.blocked&&riskCheck.submitted&&riskCheck.safety&&riskCheck.published&&riskCheck.versioned)ok('一般风险整体审核：缺措施阻断，补齐后依次两级审核生效');else bad('风险点整体审核',JSON.stringify(riskCheck));

  await open('inspection.html?tab=tasks');
  const taskInfo=await page.evaluate(()=>{App.currentRole='team_member';let t=(App.tasks||[]).find(x=>(x.items||[]).length>=2);if(!t)return null;t.status='已领取';t.claimant=App.currentUser();t.results=null;t.unqualified=0;t.hazardGeneratedIds=[];t.items.forEach(x=>{x.result='';x.description='';delete x.note;x.photoDone=false;});App._emit();return {id:t.id,code:t.code,user:App.currentUser()};});
  if(!taskInfo){bad('巡检测试任务','没有至少两个检查项的任务');}else{
    await page.reload({waitUntil:'load'});await sleep(100);
    const hasAssignee=await page.evaluate(info=>[...document.querySelectorAll('tr')].some(tr=>tr.innerText.includes(info.code)&&tr.innerText.includes(info.user)),taskInfo);
    if(hasAssignee&&!await page.$('.tabs'))ok('巡检任务显示具体执行人，重复顶部页签已移除');else bad('巡检任务人员或重复页签');
    await page.evaluate(code=>{const tr=[...document.querySelectorAll('tr')].find(x=>x.innerText.includes(code));tr.querySelector('button').click();},taskInfo.code);await sleep(80);
    const beforeLocation=await page.evaluate(id=>App.tasks.find(x=>x.id===id).status,taskInfo.id);
    await page.evaluate(()=>document.querySelector('.drawer [data-close]').click());
    if(beforeLocation==='已领取'&&await page.evaluate(id=>App.tasks.find(x=>x.id===id).status,taskInfo.id)==='已领取')ok('打开后取消不提前改变任务状态');else bad('取消执行仍改变状态',beforeLocation);
    await page.evaluate(code=>{const tr=[...document.querySelectorAll('tr')].find(x=>x.innerText.includes(code));tr.querySelector('button').click();},taskInfo.code);await sleep(60);
    await page.evaluate(()=>[...document.querySelectorAll('.drawer button')].find(b=>b.innerText.includes('获取现场位置')).click());await sleep(60);
    const running=await page.evaluate(id=>({status:App.tasks.find(x=>x.id===id).status,row:document.getElementById('taskBody').innerText}),taskInfo.id);
    if(running.status==='执行中'&&running.row.includes('执行中'))ok('位置确认后进入执行中，列表状态同步');else bad('执行状态同步',JSON.stringify(running));
    await page.evaluate(()=>{document.querySelectorAll('.res').forEach((sel,i)=>{sel.value='不合格';const input=document.querySelector('[data-description="'+sel.dataset.item+'"]');if(input)input.value='现场检查不符合要求 '+(i+1);});document.querySelectorAll('.photo-box').forEach(x=>x.click());document.getElementById('execOk').click();});await sleep(100);
    await page.evaluate(()=>document.getElementById('execHazard').click());await page.waitForNavigation({waitUntil:'load'});await sleep(100);
    const converted=await page.evaluate(code=>{const hs=App.hazards.filter(h=>h.sourceRef===code);return {count:hs.length,itemIds:[...new Set(hs.map(h=>h.sourceItemId))].length};},taskInfo.code);
    if(converted.count>=2&&converted.itemIds>=2)ok('两个不合格检查项分别生成两条隐患并保留检查项来源');else bad('多项不合格转隐患',JSON.stringify(converted));
  }

  await open('inspection.html?tab=plans');
  const noManualGeneration=await page.evaluate(()=>!/临时下发|手工生成任务|立即生成任务/.test(document.body.innerText)&&!('genSingleTask' in window));
  noManualGeneration?ok('巡检计划不提供临时下发或人工生成任务入口'):bad('巡检计划仍存在人工任务入口');

  if(errors.length){fail+=errors.length;console.log('运行期错误：',errors.slice(0,5));}
  await browser.close();srv.s.close();console.log('===== 风险/巡检回归：通过 '+pass+' / 失败 '+fail+' =====');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});

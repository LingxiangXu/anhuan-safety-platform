(function(global){
"use strict";
var STORAGE_KEY="tz_anquan_oa_center_v2";
var LISTENERS=[];
var pollTimer=null;

function now(){var d=new Date(),p=function(n){return String(n).padStart(2,"0");};return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes());}
function uid(prefix){return (prefix||"ID")+"-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,6);}
function clone(value){return JSON.parse(JSON.stringify(value));}
function emptyState(){return {version:2,instances:[],callbacks:[],updatedAt:now()};}
function read(){try{var value=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");if(value&&Array.isArray(value.instances)&&Array.isArray(value.callbacks))return value;}catch(e){}return emptyState();}
function write(state){state.updatedAt=now();localStorage.setItem(STORAGE_KEY,JSON.stringify(state));try{global.dispatchEvent(new CustomEvent("oa-bridge-change"));}catch(e){}}
function statusName(event){return ({returned:"驳回起草人",approved:"已批准",rejected:"已拒绝",revoked:"已撤销",terminated:"已终止"}[event]||event);}
function detailUrl(instanceId){return "oa/index.html?view=detail&instance="+encodeURIComponent(instanceId);}
function byInstance(instanceId){return read().instances.filter(function(x){return x.instanceId===instanceId;})[0]||null;}
function submit(payload){
  var state=read(),existing=state.instances.filter(function(x){return x.instanceId===payload.instanceId;})[0],submittedAt=payload.submittedAt||now();
  if(existing){
    Object.keys(payload).forEach(function(k){if(payload[k]!==undefined)existing[k]=clone(payload[k]);});
    existing.status="审批中";existing.updatedAt=submittedAt;existing.resubmitCount=(existing.resubmitCount||0)+1;existing.history=existing.history||[];
    existing.history.unshift({id:uid("OA-HIS"),action:"安全平台重新提交",at:submittedAt,by:payload.applicant||"安全管理平台",note:"沿用原 OA 实例继续审批"});
  }else{
    existing=Object.assign({status:"审批中",sourceSystem:"安全管理平台",createdAt:submittedAt,updatedAt:submittedAt,resubmitCount:0,history:[]},clone(payload));
    existing.history.unshift({id:uid("OA-HIS"),action:"收到审批申请",at:submittedAt,by:payload.applicant||"安全管理平台",note:"安全管理平台发起并推送审批材料"});
    state.instances.unshift(existing);
  }
  write(state);return clone(existing);
}
function decision(instanceId,event,note,payload,operator){
  var state=read(),instance=state.instances.filter(function(x){return x.instanceId===instanceId;})[0];if(!instance)return {ok:false,msg:"审批实例不存在"};
  if(instance.status!=="审批中")return {ok:false,msg:"当前实例不在审批中"};
  var status=statusName(event),at=now(),callback={id:uid("OA-CB"),instanceId:instanceId,businessType:instance.businessType,businessId:instance.businessId,event:event,status:status,note:note||status,payload:clone(payload||{}),at:at,delivered:false};
  instance.status=status;instance.updatedAt=at;instance.lastDecision={event:event,status:status,note:callback.note,operator:operator||"OA审批人",at:at,payload:callback.payload};instance.history=instance.history||[];
  instance.history.unshift({id:uid("OA-HIS"),action:status,at:at,by:operator||"OA审批人",note:callback.note});state.callbacks.push(callback);write(state);return {ok:true,instance:clone(instance),callback:clone(callback)};
}
function acknowledge(callbackId){var state=read(),item=state.callbacks.filter(function(x){return x.id===callbackId;})[0];if(!item)return false;item.delivered=true;item.deliveredAt=now();write(state);return true;}
function consume(handler){
  var state=read(),changed=false;
  state.callbacks.forEach(function(item){if(item.delivered)return;try{if(handler(clone(item))===true){item.delivered=true;item.deliveredAt=now();changed=true;}}catch(e){}});
  if(changed)write(state);return changed;
}
function bind(handler){
  if(typeof handler!=="function")return function(){};LISTENERS.push(handler);
  var run=function(){LISTENERS.slice().forEach(function(fn){consume(fn);});};
  if(!pollTimer){global.addEventListener("storage",run);global.addEventListener("oa-bridge-change",run);pollTimer=global.setInterval(run,700);}
  run();return function(){LISTENERS=LISTENERS.filter(function(x){return x!==handler;});};
}
function seed(){
  var state=read();if(state.instances.length)return;
  submit({instanceId:"OA-HSE-20260810-005",businessType:"supervision",businessId:"H-005",businessCode:"HZ-20260810-005",title:"有限空间警示隔离不到位",applicant:"集团监督检查人员（演示）",applicantOrg:"太重集团",targetOrg:"铸锻件分公司 / 造型作业区",priority:"较大",currentNode:"二级单位领导审批",safetyUrl:"../hazards.html?tab=ledger",summary:{location:"造型车间有限空间检修位",description:"监督检查发现有限空间作业区域警示隔离不到位。",source:"集团监督检查"},materials:["现场检查记录","现场证据照片"]});
}
function reset(){localStorage.removeItem(STORAGE_KEY);seed();}

global.OABridge={storageKey:STORAGE_KEY,read:read,write:write,submit:submit,decision:decision,acknowledge:acknowledge,consume:consume,bind:bind,byInstance:byInstance,detailUrl:detailUrl,statusName:statusName,seed:seed,reset:reset,now:now};
seed();
})(window);

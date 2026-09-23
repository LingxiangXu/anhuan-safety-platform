/* 隐患受理上报原型：上级直接分配，或提出意见交回原受理人。 */
(function(){
  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function close(){document.querySelectorAll('.modal,.mask,.drawer').forEach(function(n){n.remove();});}
  function finish(result){if(!result||!result.ok){App.toast(result&&result.msg||'操作失败','error');return;}close();if(document.getElementById('ledgerBody'))window.renderLedger();else location.href='hazards.html?tab=ledger';App.toast('已更新受理状态','success');}
  function button(label,action,id){return '<button class="btn btn-text" data-hazard-id="'+esc(id)+'" onclick="'+action+'(this.dataset.hazardId)">'+label+'</button>';}
  window.hazardAcceptanceButtons=function(h){
    if(h.status==='待上级受理'&&App.hazard.canAccept(h))return button('上级受理','handleHazardReport',h.id);
    return App.hazard.reportTarget(h)?button('上报','openHazardReport',h.id):'';
  };
  window.hazardAcceptanceSummary=function(h){
    var r=h.reportRequest,o=h.upperOpinion,owner=App.hazard.acceptanceOwner(h);
    var html='<div class="alert info">首次受理人：'+esc(h.firstAcceptor||'-')+'<br>当前受理人：'+esc(['待受理','待上级受理'].indexOf(h.status)>-1?owner.user:'-')+'<br>最终定级分配人 / 复核人：'+esc(h.finalAssigner||'待定级分配')+'</div>';
    if(r)html+='<div class="alert info">上报人：'+esc(r.fromUser)+'<br>上报原因：'+esc(r.reason)+'<br>需解决事项：'+esc(r.needs)+'</div>';
    if(o)html+='<div class="alert info">上级处理意见（'+esc(o.by)+'）：'+esc(o.note)+'<br>请原受理人依据意见完成定级分配。</div>';
    (h.rectificationHistory||[]).forEach(function(x,i){html+='<div class="section-head"><h3>第 '+(i+1)+' 次整改反馈</h3></div><p>'+esc(x.summary||x.completed)+'<br>整改后照片：'+(x.evidenceAfter?'已保留':'无')+'<br>复核意见：'+esc(x.reviewNote||'-')+'<br>复核人：'+esc(x.reviewedBy||'-')+'</p>';});
    return html;
  };
  window.openHazardReport=function(id){
    var h=App.hazard.byId(id),role=App.hazard.reportTarget(h),target=App.roleOf(role);if(!role||!target)return;
    close();UI.modal('<div class="alert info">'+esc(h.code)+' · '+esc(h.title)+'<br>位置：'+esc(h.location)+'<br>原资料自动带入；上报不改变隐患等级或期限。</div><div class="form-item"><label>上级受理人 *</label><select id="reportUser"><option value="'+esc(target.user)+'">'+esc(target.name+' · '+target.user)+'</option></select></div><div class="form-item"><label>上报原因 *</label><textarea id="reportReason"></textarea></div><div class="form-item"><label>需解决事项 *</label><textarea id="reportNeeds"></textarea></div>',{title:'隐患上报',footer:'<button class="btn btn-outline" data-close>取消</button><button class="btn btn-primary" id="reportSubmit">提交上报</button>'});
    document.getElementById('reportSubmit').onclick=function(){finish(App.hazard.report(id,document.getElementById('reportReason').value.trim(),document.getElementById('reportNeeds').value.trim(),document.getElementById('reportUser').value));};
  };
  window.handleHazardReport=function(id){
    var h=App.hazard.byId(id);if(!App.hazard.canAccept(h)||h.status!=='待上级受理')return;
    close();UI.modal(hazardAcceptanceSummary(h)+'<div class="form-item"><label>处理意见（交回时必填）</label><textarea id="reportOpinion"></textarea></div>',{title:'上级受理 · '+h.code,footer:'<button class="btn btn-outline" data-close>取消</button><button class="btn btn-outline" id="reportReturn">提出意见并交回</button><button class="btn btn-primary" id="reportAssign">直接定级分配</button>'});
    document.getElementById('reportReturn').onclick=function(){finish(App.hazard.returnWithOpinion(id,document.getElementById('reportOpinion').value.trim()));};
    document.getElementById('reportAssign').onclick=function(){var note=document.getElementById('reportOpinion').value;close();window.openAccept(id);document.getElementById('aOpinion').value=note;};
  };
})();

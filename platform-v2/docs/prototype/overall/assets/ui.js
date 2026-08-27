/* ============================================================
 * 安全管理平台原型 · 通用 UI 组件 ui.js
 * 依赖 store.js（window.App）
 * ============================================================ */
(function(){
"use strict";

var NAV=[
  {key:"workbench",name:"工作台",icon:"workbench",href:"workbench.html",subs:[]},
  {key:"dashboard",name:"管理驾驶舱",icon:"dashboard",href:"index.html?keep=1",subs:[]},
  {key:"goals",name:"目标职责",icon:"goal",href:"goals.html",subs:[
    {group:"机构和职责"},
    {key:"organizations",name:"组织机构维护"},{key:"people",name:"组织人员维护"},
    {key:"users",name:"用户信息维护"},{key:"roles",name:"角色管理"},{key:"scopes",name:"角色数据权限"},
    {group:"安全履职"},{key:"duties",name:"岗位安全职责清单"}
  ]},
  {key:"risks",name:"风险管理",icon:"risk",href:"risks.html",subs:[
    {key:"overview",name:"风险总览"},{key:"ledger",name:"风险台账"},
    {key:"map",name:"风险四色图"},{key:"notice",name:"风险告知"},{key:"changes",name:"变更复评"}
  ]},
  {key:"inspection",name:"巡检任务",icon:"inspection",href:"inspection.html",subs:[
    {key:"overview",name:"巡检总览"},{key:"items",name:"检查标准"},{key:"plans",name:"巡检计划"},{key:"tasks",name:"巡检任务"}
  ]},
  {key:"hazards",name:"隐患治理与督办",icon:"hazard",href:"hazards.html",subs:[
    {key:"overview",name:"隐患总览"},{key:"ledger",name:"隐患台账"},{key:"mine-rect",name:"待我整改"},
    {key:"mine-review",name:"待我复查",badge:1},{key:"professional",name:"专业检查台账"},{key:"supervision",name:"隐患督办",badge:1},{key:"stats",name:"统计分析"}
  ]},
  {key:"permits",name:"特殊作业管控",icon:"permit",href:"work-permits.html",subs:[
    {key:"ledger",name:"作业票台账"},{key:"review",name:"待我审核"},{key:"approve",name:"待我审批"},
    {key:"execute",name:"现场执行",badge:1},{key:"archived",name:"已归档"}
  ]},
  {key:"emergency",name:"应急管理",icon:"emergency",href:"emergency.html",subs:[
    {key:"plans",name:"应急预案台账"},{key:"search",name:"预案内容检索"}
  ]},
  {key:"training",name:"培训与证书",icon:"training",href:"training-certificates.html",subs:[
    {key:"records",name:"培训记录"},{key:"certificates",name:"证书管理"}
  ]},
  {key:"knowledge",name:"安全知识库",icon:"knowledge",href:"knowledge.html",subs:[
    {key:"laws",name:"法律法规"},{key:"systems",name:"安全制度"},{key:"search",name:"知识检索"}
  ]}
];

function iconSvg(name){
  var paths={workbench:'<path d="M4 5h16v15H4z"/><path d="M8 5V3h8v2M8 10h8M8 14h5"/>',dashboard:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',risk:'<path d="M4 20h16V8l-8-5-8 5v12Z"/><path d="M9 20v-6h6v6"/>',inspection:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',hazard:'<path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17h.01"/>',permit:'<path d="M7 3h10l3 5-3 13H7L4 8l3-5Z"/><path d="M9 9h6M9 13h6M9 17h4"/>',goal:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 7-7M15 5h4v4"/>',training:'<path d="M4 5h16v12H4z"/><path d="M8 21h8M12 17v4M7 9h6M7 13h10M16 5v4l2-1 2 1V5"/>',knowledge:'<path d="M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4Z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6Z"/>',emergency:'<path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z"/><path d="M12 8v8M8 12h8"/>',mobile:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 5h4M11 19h2"/>'};
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.dashboard)+'</svg>';
}

var UI={
  /* ---------- Toast ---------- */
  toast:function(msg,type){
    var wrap=document.getElementById("toast-wrap");
    if(!wrap){wrap=document.createElement("div");wrap.id="toast-wrap";document.body.appendChild(wrap);}
    var t=document.createElement("div");t.className="toast "+(type||"");
    t.textContent=(type==="success"?"成功：":(type==="error"?"错误：":type==="warn"?"提醒：":"提示："))+msg;
    wrap.appendChild(t);
    setTimeout(function(){t.style.opacity="0";t.style.transition="opacity .3s";setTimeout(function(){t.remove();},320);},2600);
  },

  /* ---------- 通用弹窗 ---------- */
  modal:function(html,opts){
    opts=opts||{};
    var m=document.createElement("div");m.className="modal show";
    m.innerHTML='<div class="modal-box '+(opts.size||"")+'"><div class="modal-h"><div class="t">'+(opts.title||"")+
      '</div><button class="close-x" data-close aria-label="关闭">✕</button></div><div class="modal-b">'+html+
      '</div>'+(opts.footer?'<div class="modal-f">'+opts.footer+"</div>":"")+"</div>";
    document.body.appendChild(m);
    var close=function(){m.remove();};
    m.querySelectorAll("[data-close]").forEach(function(btn){btn.onclick=close;});
    return {el:m,close:close};
  },

  /* ---------- 抽屉 ---------- */
  drawer:function(html,opts){
    opts=opts||{};
    var mask=document.createElement("div");mask.className="mask show";
    var d=document.createElement("div");d.className="drawer show "+(opts.wide?"wide":"");
    d.innerHTML='<div class="drawer-h"><div class="t">'+(opts.title||"")+
      '</div><button class="close-x" data-close aria-label="关闭">✕</button></div><div class="drawer-b">'+html+
      '</div>'+(opts.footer?'<div class="drawer-f">'+opts.footer+"</div>":"")+"</div>";
    document.body.appendChild(mask);document.body.appendChild(d);
    var close=function(){mask.remove();d.remove();};
    mask.onclick=close;d.querySelectorAll("[data-close]").forEach(function(btn){btn.onclick=close;});
    return {el:d,close:close};
  },

  /* ---------- 左侧导航树 + 顶栏 ---------- */
  renderShell:function(activeModule,activeSub){
    var top=document.querySelector(".topbar");
    top.innerHTML='<div class="brand"><img src="assets/logo.svg" alt="太重数智">安全管理平台</div>'+
      '<div class="right"><div class="org-chip"><span class="org-marker" aria-hidden="true"></span><span id="topOrg">'+App.currentOrg+"</span></div>"+
      '<div class="role-switch" id="roleSwitch"><span id="roleName">'+App.roleOf(App.currentRole).name+'</span><span class="caret"></span>'+
      '<div class="role-menu" id="roleMenu">'+
      '<div class="rm-title">切换演示角色（数据权限演示）</div>'+
      App.roles.map(function(r){return '<div class="rm-item'+(r.key===App.currentRole?" active":"")+'" data-role="'+r.key+'">'+r.name+'<div style="font-size:11px;color:#94A3B8;font-weight:400">'+r.user+' · '+r.desc+"</div></div>";}).join("")+
      "</div></div>"+
      '<button class="btn btn-outline btn-sm" type="button" onclick="App.resetDemo()" title="清除当前标签页中的演示操作并恢复初始数据">恢复初始数据</button>'+
      '<div class="user-info"><div class="avatar">'+App.currentUser().slice(0,1)+'</div><span id="userName">'+App.currentUser()+"</span></div></div>";

    var rs=document.getElementById("roleSwitch"),rm=document.getElementById("roleMenu");
    rs.onclick=function(e){e.stopPropagation();rm.classList.toggle("show");};
    document.addEventListener("click",function(){rm.classList.remove("show");});
    rm.querySelectorAll(".rm-item").forEach(function(it){
      it.onclick=function(){
        App.currentRole=it.getAttribute("data-role");
        try{
          sessionStorage.setItem("tz_anquan_role",App.currentRole);
          // 角色选择需要和演示状态一起持久化，避免刷新时被旧状态覆盖。
          if(App.persist)App.persist();
        }catch(e){}
        App.toast("已切换为「"+App.roleOf(App.currentRole).name+"」视角","success");
        location.reload();
      };
    });

    var nav=document.querySelector(".nav-tree");
    nav.innerHTML='<div class="nav-title">安全管理平台</div>'+NAV.map(function(m){
      var hasSubs=m.subs.length>0;
      var isActive=m.key===activeModule;
      var subBadge=m.subs.reduce(function(s,x){return s+(x.badge||0);},0);
      var itemHtml='<div class="nav-item'+(isActive?" active":"")+'" data-module="'+m.key+'" data-href="'+m.href+'">'+
        '<span class="ico">'+iconSvg(m.icon)+"</span><span>"+m.name+"</span>"+
        (subBadge>0?'<span class="badge">'+subBadge+"</span>":"")+
        (hasSubs?'<span class="arrow'+(isActive?" open":"")+'" aria-hidden="true"></span>':"")+"</div>";
      var subHtml="";
      if(hasSubs){
        subHtml='<div class="nav-sub'+(isActive?" open":"")+'">'+m.subs.map(function(s){
          if(s.group)return '<div class="nav-sub-label">'+s.group+'</div>';
          var href=m.href+"?tab="+s.key;
          var active=s.key===activeSub&&isActive;
          return '<div class="nav-sub-item'+(active?" active":"")+'" data-href="'+href+'">'+s.name+
            (s.badge?'<span class="badge">'+s.badge+"</span>":"")+"</div>";
        }).join("")+"</div>";
      }
      return itemHtml+subHtml;
    }).join("")+'<div class="nav-item mobile-entry" data-href="mobile.html"><span class="ico">'+iconSvg('mobile')+'</span><span>移动现场端</span><span class="badge b-blue">'+(App.mobile?App.mobile.unread():0)+'</span></div><div class="sidebar-foot">太重数智 · 安全管理平台<br>整体原型 v'+App.version+"<br>本地 mock · 全部可点击演示</div>";

    document.querySelectorAll(".nav-item").forEach(function(it){
      it.onclick=function(){
        var href=it.getAttribute("data-href");
        if(it.classList.contains("active")){
          var sub=it.parentNode.querySelector(".nav-sub");
          if(sub){sub.classList.toggle("open");it.querySelector(".arrow").classList.toggle("open");}
        }else{location.href=href;}
      };
    });
    document.querySelectorAll(".nav-sub-item").forEach(function(it){
      it.onclick=function(){location.href=it.getAttribute("data-href");};
    });
    document.querySelectorAll(".mobile-entry").forEach(function(it){it.onclick=function(){location.href=it.getAttribute("data-href");};});
  },

  /* ---------- 面包屑标题 ---------- */
  pageHeader:function(crumbs,title,actionsHtml){
    var ph=document.querySelector(".page-header");
    var c=crumbs.map(function(c,i){return '<span>'+(i>0?'<span class="sep">/</span>':"")+"<b>"+c+"</b></span>";}).join("");
    ph.innerHTML='<span class="crumb">'+c+'</span><span class="page-title">'+title+"</span>"+
      '<div class="page-actions">'+(actionsHtml||"")+"</div>";
  },

  /* ---------- 空状态 ---------- */
  empty:function(msg){return '<div class="tbl-empty">'+(msg||"暂无数据")+"</div>";},

  /* ---------- 指标徽标 ---------- */
  tagOf:function(levelKey){
    var map={major:'<span class="tag tag-major">重大</span>',big:'<span class="tag tag-big">较大</span>',
      common:'<span class="tag tag-common">一般</span>',low:'<span class="tag tag-low">低</span>'};
    return map[levelKey]||"";
  }
};

/* ---------- 手写 SVG 图表 ---------- */
UI.chart={
  line:function(data,opts){
    opts=opts||{};
    var w=opts.width||520,h=opts.height||170,padL=34,padB=24,padT=14,padR=10;
    var max=opts.max||Math.max.apply(null,data.map(function(d){return Math.max.apply(null,d.values);}))*1.15;
    var iw=w-padL-padR,ih=h-padT-padB;
    var colors=opts.colors||["#0075E6","#00AA1C"];
    var labels=opts.labels||data.map(function(){return "";});
    var n=data[0]?data[0].values.length:0;
    function px(i){return padL+iw*(n<=1?0.5:i/(n-1));}
    function py(v){return padT+ih*(1-v/max);}
    var html='<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+" "+h+'" style="display:block">';
    for(var g=0;g<=4;g++){var gy=padT+ih*g/4;html+='<line x1="'+padL+'" y1="'+gy+'" x2="'+(w-padR)+'" y2="'+gy+'" stroke="#E2E8F0" stroke-width="0.5"/>';
      html+='<text x="'+(padL-6)+'" y="'+(gy+4)+'" text-anchor="end" font-size="10" fill="#94A3B8">'+Math.round(max*(1-g/4))+"</text>";}
    data.forEach(function(series,si){
      var pts=series.values.map(function(v,i){return px(i)+","+py(v);}).join(" ");
      html+='<polyline points="'+pts+'" fill="none" stroke="'+colors[si%colors.length]+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
      series.values.forEach(function(v,i){
        html+='<circle cx="'+px(i)+'" cy="'+py(v)+'" r="3" fill="#fff" stroke="'+colors[si%colors.length]+'" stroke-width="2"/>';
      });
    });
    if(labels.length>0)labels.forEach(function(l,i){html+='<text x="'+px(i)+'" y="'+(h-6)+'" text-anchor="middle" font-size="10" fill="#94A3B8">'+l+"</text>";});
    html+="</svg>";
    return html;
  },
  bar:function(data,opts){
    opts=opts||{};
    var w=opts.width||520,h=opts.height||170,padL=34,padB=24,padT=14,padR=10;
    var max=opts.max||Math.max.apply(null,data.map(function(d){return d.value;}))*1.15;
    var iw=w-padL-padR,ih=h-padT-padB;
    var n=data.length,bw=Math.min(44,iw/n*0.55);
    var html='<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+" "+h+'" style="display:block">';
    for(var g=0;g<=4;g++){var gy=padT+ih*g/4;html+='<line x1="'+padL+'" y1="'+gy+'" x2="'+(w-padR)+'" y2="'+gy+'" stroke="#E2E8F0" stroke-width="0.5"/>';
      html+='<text x="'+(padL-6)+'" y="'+(gy+4)+'" text-anchor="end" font-size="10" fill="#94A3B8">'+Math.round(max*(1-g/4))+"</text>";}
    data.forEach(function(d,i){
      var bh=Math.max(2,ih*d.value/max);
      var bx=padL+iw*(i+0.5)/n-bw/2,by=padT+ih-bh;
      html+='<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="3" fill="'+(d.color||"#0075E6")+'"/>';
      html+='<text x="'+(bx+bw/2)+'" y="'+(by-5)+'" text-anchor="middle" font-size="11" font-weight="500" fill="#334155">'+d.value+"</text>";
      html+='<text x="'+(bx+bw/2)+'" y="'+(h-7)+'" text-anchor="middle" font-size="10" fill="#94A3B8">'+d.label+"</text>";
    });
    html+="</svg>";
    return html;
  },
  hbar:function(data,opts){
    opts=opts||{};
    var w=opts.width||520,h=24*data.length+16,padL=120,padR=44;
    var max=opts.max||Math.max.apply(null,data.map(function(d){return d.value;}))*1.1;
    var iw=w-padL-padR;
    var html='<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+" "+h+'" style="display:block">';
    data.forEach(function(d,i){
      var y=i*24+8,bw=Math.max(3,iw*d.value/max);
      html+='<text x="'+(padL-10)+'" y="'+(y+14)+'" text-anchor="end" font-size="12" fill="#475569">'+d.label+"</text>";
      html+='<rect x="'+padL+'" y="'+y+'" width="'+bw+'" height="16" rx="4" fill="'+(d.color||"#0075E6")+'"/>';
      html+='<text x="'+(padL+bw+6)+'" y="'+(y+14)+'" font-size="11" fill="#64748B">'+d.value+(d.suffix||"")+"</text>";
    });
    html+="</svg>";
    return html;
  },
  donut:function(data,opts){
    opts=opts||{};
    var size=opts.size||150,r=size/2-8,cx=size/2,cy=size/2,sw=20;
    var total=data.reduce(function(s,d){return s+d.value;},0)||1;
    var html='<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+" "+size+'" style="display:block">';
    var a0=-Math.PI/2;
    data.forEach(function(d){
      var ang=d.value/total*Math.PI*2;
      var large=d.value/total>0.5?1:0;
      var x1=cx+r*Math.cos(a0),y1=cy+r*Math.sin(a0);
      var x2=cx+r*Math.cos(a0+ang),y2=cy+r*Math.sin(a0+ang);
      html+='<path d="M'+x1.toFixed(1)+" "+y1.toFixed(1)+" A"+r+" "+r+" 0 "+large+" 1 "+x2.toFixed(1)+" "+y2.toFixed(1)+'" fill="none" stroke="'+(d.color||"#0075E6")+'" stroke-width="'+sw+'"/>';
      a0+=ang;
    });
    html+='<text x="'+cx+'" y="'+(cy-2)+'" text-anchor="middle" font-size="20" font-weight="700" fill="#0F172A">'+total+"</text>";
    html+='<text x="'+cx+'" y="'+(cy+16)+'" text-anchor="middle" font-size="10" fill="#94A3B8">'+(opts.centerLabel||"总数")+"</text></svg>";
    return html;
  },
  legend:function(items){return '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:10px">'+items.map(function(i){return '<span style="font-size:12px;color:#64748B;display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:'+i.color+'"></span>'+i.name+(i.value!==undefined?' <b style="color:#334155">'+i.value+"</b>":"")+"</span>";}).join("")+"</div>";}
};

/* ---------- 通用事件：App.toast 全局监听 ---------- */
window.addEventListener("app-toast",function(e){UI.toast(e.detail.msg,e.detail.type);});

/* ---------- 键盘可达性：让以 div 实现的既有点击入口可通过 Enter / Space 操作 ---------- */
function enhanceInteractive(root){
  var nodes=[];if(root&&root.matches&&root.matches('div[onclick],.nav-item[data-href],.nav-sub-item[data-href],.mobile-entry[data-href],.clickable'))nodes.push(root);
  if(root&&root.querySelectorAll)nodes=nodes.concat([].slice.call(root.querySelectorAll('div[onclick],.nav-item[data-href],.nav-sub-item[data-href],.mobile-entry[data-href],.clickable')));
  nodes.forEach(function(node){if(node.dataset.keyboardReady)return;node.dataset.keyboardReady="1";node.setAttribute("role","button");node.setAttribute("tabindex","0");if(!node.getAttribute("aria-label"))node.setAttribute("aria-label",(node.getAttribute("title")||node.textContent||"打开").trim().replace(/\s+/g," ").slice(0,80));node.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();node.click();}});});
}
enhanceInteractive(document.body);
new MutationObserver(function(records){records.forEach(function(record){record.addedNodes.forEach(function(node){if(node.nodeType===1)enhanceInteractive(node);});});}).observe(document.body,{childList:true,subtree:true});

window.UI=UI;
})();

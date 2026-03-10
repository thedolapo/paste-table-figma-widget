"use strict";(()=>{var R=`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      padding: 24px;
      margin: 0;
      background: #111827;
      color: #fff;
    }
    .section {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .section:last-of-type { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    h2 {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      margin: 0 0 4px 0;
    }
    .section-desc {
      font-size: 14px;
      color: #9ca3af;
      margin: 0 0 20px 0;
    }
    label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      margin-bottom: 8px;
    }
    #paste-area {
      width: 100%;
      min-height: 120px;
      margin: 0 0 16px 0;
      padding: 12px;
      font-size: 14px;
      line-height: 1.5;
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid transparent;
      border-radius: 6px;
      outline: 1px solid rgba(255, 255, 255, 0.1);
      outline-offset: -1px;
      resize: vertical;
      transition: outline-color 0.15s, outline-width 0.15s;
    }
    #paste-area::placeholder { color: #6b7280; }
    #paste-area:focus {
      outline: 2px solid #6366f1;
      outline-offset: -2px;
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
    button {
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      transition: background 0.15s;
    }
    #paste-create-btn {
      background: #6366f1;
      color: #fff;
    }
    #paste-create-btn:hover { background: #4f46e5; }
    #paste-create-btn:focus-visible {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
    }
    #error {
      font-size: 14px;
      color: #f87171;
      margin: 12px 0 0 0;
      min-height: 1.2em;
    }
    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 12px;
      color: #9ca3af;
    }
    .footer a {
      color: #818cf8;
      text-decoration: none;
    }
    .footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="section">
    <h2>Paste table data</h2>
    <p class="section-desc">Paste HTML, Markdown, TSV, CSV, or plain text. Data will be parsed into a table.</p>
    <label for="paste-area">Table data</label>
    <textarea id="paste-area" placeholder="Paste here (Ctrl/Cmd+V)\u2026" autofocus></textarea>
    <p id="error"></p>
    <div class="actions">
      <button type="button" id="paste-create-btn">Paste and create table</button>
    </div>
  </div>
  <p class="footer">
    Created by Habib Ayoade \xB7
    <a id="coffee-link" href="https://buymeacoffee.com/ayoadehabib" target="_blank" rel="noopener noreferrer">Buy Coffee</a>
  </p>
  <script>
    function send(type, payload) {
      parent.postMessage({ pluginMessage: { type, payload } }, '*');
    }
    function showError(msg) {
      document.getElementById('error').textContent = msg || '';
    }
    var pasteArea = document.getElementById('paste-area');
    var emptyMsg = 'Paste your table data into the box above (Ctrl/Cmd+V), then click the button.';
    document.getElementById('paste-create-btn').onclick = function() {
      showError('');
      var fromTextarea = pasteArea.value.trim();
      if (fromTextarea) {
        send('import', fromTextarea);
        return;
      }
      if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(function(text) {
          var value = (text && text.trim()) ? text.trim() : pasteArea.value.trim();
          if (value) send('import', value); else showError(emptyMsg);
        }).catch(function() {
          showError(emptyMsg);
        });
      } else {
        showError(emptyMsg);
      }
    };
    window.onmessage = function(e) {
      var msg = e.data && e.data.pluginMessage;
      if (msg && msg.type === 'error') showError(msg.message || 'Error');
      if (msg && msg.type === 'close') showError('');
    };
  <\/script>
</body>
</html>
`;function E(t){let e=t.trim();if(!e)return null;if(/<\s*table[\s>]/i.test(e))return"html";let r=/^\s*\|.+\|/.test(e),o=new RegExp("^\\s*\\|[\\s-:]+\\|","m").test(e);return r&&o?"markdown":_(e)?"tsv":V(e)?"csv":$(e)?"plain":null}function _(t){let e=t.split(/\r?\n/).filter(o=>o.trim().length>0);if(e.length<1)return!1;let r=(e[0].match(/\t/g)||[]).length;return r===0?!1:e.every(o=>(o.match(/\t/g)||[]).length===r)}function V(t){let e=t.split(/\r?\n/).filter(o=>o.trim().length>0);if(e.length<1)return!1;let r=M(e[0]);if(r<1)return!1;for(let o=1;o<e.length;o++)if(M(e[o])!==r)return!1;return!0}function M(t){let e=0,r=!1;for(let o=0;o<t.length;o++){let a=t[o];a==='"'?r=!r:!r&&a===","&&e++}return e+1}function $(t){let e=t.split(/\r?\n/).filter(o=>o.trim().length>0);if(e.length<1)return!1;let r=D(e[0]).length;return r<1?!1:e.every(o=>D(o).length===r)}function D(t){let e=t.trim();if(e==="")return[];let r=e.split(/\t+/);if(r.length>1)return r.map(a=>a.trim());let o=e.split(/\s{2,}/);return o.length>1?o.map(a=>a.trim()):[e]}function l(t,e){let r=t.length,o=t.length>0?t[0].cells.length:0;return{rows:t,columnCount:o,rowCount:r,hasHeaderRow:e}}function A(t){let e=t.trim(),r=e.match(/<table[^>]*>([\s\S]*?)<\/table>/i),o=r?r[1]:e,a=/<tr[^>]*>([\s\S]*?)<\/tr>/gi,n=[],g,f=!1;for(;(g=a.exec(o))!==null;){let b=g[1],i=[],x=/<th[^>]*>([\s\S]*?)<\/th>/gi,v=/<td[^>]*>([\s\S]*?)<\/td>/gi,h,m,c=[],p=[];for(;(h=x.exec(b))!==null;)c.push(S(h[1]).trim());for(x.lastIndex=0;(m=v.exec(b))!==null;)p.push(S(m[1]).trim());c.length>0&&(f=n.length===0,c.forEach(u=>i.push({value:u}))),p.length>0&&p.forEach(u=>i.push({value:u})),i.length>0&&n.push({cells:i})}return l(n,f)}function S(t){return t.replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"')}function P(t){let e=t.split(/\r?\n/).map(n=>n.trim()).filter(n=>n.length>0),r=[],o=!1,a=!1;for(let n=0;n<e.length;n++){if(a){a=!1;continue}let g=e[n];if(!g.startsWith("|"))continue;let f=X(g);if(f.length===0)continue;if(f.every(i=>/^[\s\-:]+$/.test(i))){r.length>0&&(o=!0);continue}r.push({cells:f.map(i=>({value:i.trim()}))})}return l(r,o)}function X(t){return t.replace(/^\|/,"").replace(/\|$/,"").split("|").map(r=>r.trim())}function F(t){let e=t.split(/\r?\n/).filter(o=>o.length>0||o.includes("	")),r=[];for(let o of e){let a=o.split(/\t/).map(n=>({value:n.trim()}));a.length>0&&r.push({cells:a})}return l(r,!1)}function L(t){let e=[],r=Q(t);for(let o of r){let a=q(o).map(n=>({value:n}));a.length>0&&e.push({cells:a})}return l(e,!1)}function Q(t){let e=[],r="",o=!1;for(let a=0;a<t.length;a++){let n=t[a];n==='"'?(o=!o,r+=n):n===`
`&&!o?(e.push(r),r=""):n!=="\r"&&(r+=n)}return r.length>0&&e.push(r),e}function q(t){let e=[],r="",o=!1;for(let a=0;a<t.length;a++){let n=t[a];n==='"'?(o=!o,r+=n):n===","&&!o?(e.push(I(r)),r=""):r+=n}return e.push(I(r)),e}function I(t){let e=t.trim();return e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1).replace(/""/g,'"').trim():e}function W(t){let e=t.split(/\r?\n/).filter(o=>o.trim().length>0),r=[];for(let o of e){let a=j(o).map(n=>({value:n}));a.length>0&&r.push({cells:a})}return l(r,!1)}function j(t){let e=t.trim();if(e==="")return[];let r=e.split(/\t+/).map(a=>a.trim());if(r.length>1)return r;let o=e.split(/\s{2,}/).map(a=>a.trim());return o.length>1?o:[e]}function z(t){let e=t.trim();if(!e)return{ok:!1,reason:"Input is empty."};let r=E(e);if(!r)return{ok:!1,reason:"Could not detect a supported table format. Try HTML, Markdown, TSV, or CSV."};try{let o;switch(r){case"html":o=A(e);break;case"markdown":o=P(e);break;case"tsv":o=F(e);break;case"csv":o=L(e);break;case"plain":o=W(e);break;default:return{ok:!1,reason:"Unsupported format."}}return{ok:!0,data:o}}catch(o){return{ok:!1,reason:o instanceof Error?o.message:"Parse failed."}}}function H(t){if(!t.rows||t.rows.length===0)return{ok:!1,reason:"Table must have at least one row."};if(t.rowCount>50)return{ok:!1,reason:"Table has too many rows. Maximum is 50 rows."};if(t.columnCount>12)return{ok:!1,reason:"Table has too many columns. Maximum is 12 columns."};if(t.columnCount<1)return{ok:!1,reason:"Table must have at least one column."};let e=t.columnCount;for(let r=0;r<t.rows.length;r++){let o=t.rows[r],a=o.cells?o.cells.length:0;if(a!==e)return{ok:!1,reason:`Row ${r+1} has ${a} columns; expected ${e}. All rows must have the same number of columns.`}}return{ok:!0}}var{widget:O}=figma,{useSyncedState:N,useEffect:G,waitForTask:Y,AutoLayout:d,Text:T,Input:Z}=O,k=null,s=null;function J(){let t=figma.currentPage.selection;if(!t||t.length===0)return null;let e=t[0];return e?e.id:null}function U(t){let e=figma.widgetId;if(!e){figma.ui.postMessage({type:"error",message:"Insert a Paste Table widget from the Widgets menu first, then run Import or Create new table."}),s&&(s(),s=null);return}figma.loadAllPagesAsync().then(()=>{let r=figma.root.findWidgetNodesByWidgetId(e);if(r.length===0){figma.ui.postMessage({type:"error",message:"Insert a Paste Table widget from the Widgets menu first, then run Import or Create new table."}),s&&(s(),s=null);return}let a=r[0].cloneWidget({tableData:t});a.x=figma.viewport.center.x-a.width/2,a.y=figma.viewport.center.y-a.height/2,figma.currentPage.appendChild(a),figma.viewport.scrollAndZoomIntoView([a]),figma.currentPage.selection=[a],figma.notify("Table created"),figma.ui.close(),s&&(s(),s=null)})}function K(t){let e=typeof t.payload=="string"?t.payload.trim():"";if(t.type!=="import"&&t.type!=="create")return;let r=z(e);if(!r.ok){figma.ui.postMessage({type:"error",message:r.reason});return}let o=H(r.data);if(!o.ok){figma.ui.postMessage({type:"error",message:o.reason});return}let a=r.data;t.type==="import"&&k?figma.getNodeByIdAsync(k).then(n=>{n&&n.type==="WIDGET"&&n.widgetId===figma.widgetId?(n.setWidgetSyncedState({tableData:a}),figma.notify("Table updated"),figma.ui.close(),s&&(s(),s=null)):U(a)}):U(a)}function ee(){let[t,e]=N("tableData",null),[r,o]=N("pasteUiAutoOpened",!1);function a(){return k=J(),figma.showUI(R,{width:420,height:380,title:"Paste Table"}),figma.ui.onmessage=K,new Promise(m=>{s=m})}if(G(()=>{!t&&!r&&(o(!0),Y(a()))}),!t)return figma.widget.h(d,{direction:"vertical",padding:16,fill:"#F5F5F5",cornerRadius:8,spacing:8},figma.widget.h(d,{direction:"vertical",padding:12,fill:"#EBEBEB",cornerRadius:6,spacing:4,stroke:"#D0D0D0",strokeWidth:1,onClick:a},figma.widget.h(T,{fontSize:12,fill:"#666"},"Paste table data in the plugin window"),figma.widget.h(T,{fontSize:11,fill:"#999"},"Table data will appear here after you paste and create.")),figma.widget.h(T,{fontSize:11,fill:"#0066cc",onClick:a},"Open paste UI"));let n=128,g=40,f=55,b="#F4F4F4",i="#E0E0E0",x=600;function v(m,c,p){if(!t)return;let u=t.rows.map((w,y)=>y===m?{cells:w.cells.map((C,B)=>B===c?{value:p}:C)}:w);e({rows:u,columnCount:t.columnCount,rowCount:t.rowCount,hasHeaderRow:t.hasHeaderRow})}let h=8;return figma.widget.h(d,{direction:"vertical",padding:0,fill:"#FFF",cornerRadius:8,stroke:i,spacing:0},figma.widget.h(d,{direction:"horizontal",padding:8,fill:"#F8F8F8"},figma.widget.h(T,{fontSize:11,fill:"#666",onClick:a},"Replace data")),t.rows.map((m,c)=>{let p=t.hasHeaderRow&&c===0,u=p?g:f;return figma.widget.h(d,{key:c,direction:"horizontal",padding:0,height:u,verticalAlignItems:"center",fill:p?b:"#FFF",spacing:0},m.cells.map((w,y)=>p?figma.widget.h(d,{key:y,width:n,height:u,verticalAlignItems:"center",padding:h,stroke:i,strokeWidth:1},figma.widget.h(T,{fontSize:12,fontWeight:x,fill:"#333"},w.value||" ")):figma.widget.h(d,{key:y,width:n,height:u,verticalAlignItems:"center",padding:h,stroke:i,strokeWidth:1},figma.widget.h(Z,{value:w.value,onTextEditEnd:C=>v(c,y,C.characters),width:n-h*2,inputBehavior:"wrap",fontSize:12,fill:"#333"}))))}))}O.register(ee);})();

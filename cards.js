'use strict';
document.title='可编辑卡片工作台 V1.2';
document.querySelector('header h1').textContent='可编辑卡片工作台 V1.2';
document.querySelector('header a').textContent='使用说明';
document.querySelector('header a').href='README.md';
const $=id=>document.getElementById(id);
const specs={
 recruitment:{name:'招聘',fields:[['title','标题'],['role','岗位'],['location','地点'],['salary','薪资'],['requirements','要求'],['contact','联系方式'],['note','备注']],demo:{title:'青禾工作室 · 招募伙伴',role:'活动协作助理（虚构岗位）',location:'示例城市 · 示范区',salary:'薪资面议（虚构示例）',requirements:'细心核对活动资料\n愿意与团队沟通\n能够按约定时间完成工作',contact:'演示联系人小林 · 无真实联系方式',note:'虚构招聘演示，请替换并核实内容后再使用。'}},
 notice:{name:'通知',fields:[['title','标题'],['body','通知正文'],['note','备注']],demo:{title:'周末读书会 · 场地调整',body:'活动改在示例书屋二楼举行。\n请提前核对到场路线，携带自己的笔记本。\n如无法参加，请提前告知组织者。',note:'虚构通知 · 日期和地点需自行填写确认'}},
 steps:{name:'步骤',fields:[['title','标题'],['body','步骤（每行一步）'],['note','备注']],demo:{title:'把想法整理成一张卡片',body:'确定这张卡片只讲一个问题\n写出读者需要知道的内容\n检查标题、数字与标点\n预览后导出并重新打开检查',note:'演示步骤 · 按实际情况调整'}},
 knowledge:{name:'知识卡片',fields:[['title','标题'],['body','正文'],['note','备注']],demo:{title:'摘录观点，也要保留前提',body:'先问这句话在回答什么问题。\n再看判断成立需要哪些条件。\n最后检查，缩短文字后有没有改变原意。',note:'虚构编辑示例 · 不代表客户成果'}},
 compare:{name:'对比说明',fields:[['title','标题'],['leftTitle','左侧标题'],['left','左侧说明'],['rightTitle','右侧标题'],['right','右侧说明'],['note','备注']],demo:{title:'两种安排 · 各有侧重',leftTitle:'安排 A',left:'先讨论目标\n适合方向尚未明确时\n需要参与者共同确认',rightTitle:'安排 B',right:'先核对执行清单\n适合目标已经确定时\n需要负责人明确分工',note:'虚构对比，不构成普遍建议'}},
 case:{name:'项目案例',fields:[['title','标题'],['background','背景'],['action','做法'],['result','结果／待验证项'],['note','备注']],demo:{title:'示例资料整理项目',background:'虚构团队希望把零散笔记整理成可读材料。',action:'先归类问题，再保留来源，最后统一表达。',result:'仅展示交付形式；没有真实客户或成效数据。',note:'原创虚构演示 · 非真实客户案例'}}
};
let kind='recruitment',values={...specs[kind].demo},dirty=false,renderValid=false,revision=0,importSequence=0;
const configIds=['ratio','titleSize','bodySize','lineHeight','background','ink','accent'];
const defaults={ratio:'1440',titleSize:'64',bodySize:'34',lineHeight:'1.55',background:'#ffffff',ink:'#183e53',accent:'#177da2'};
const canvas=$('preview'),ctx=canvas.getContext('2d');
const contrastNote=document.createElement('p');contrastNote.id='contrastNote';contrastNote.className='notice';contrastNote.setAttribute('role','status');contrastNote.setAttribute('aria-live','polite');$('accent').closest('.row').after(contrastNote);
function updateContrast(c){const pairs=[['正文',c.ink],['强调文字',c.accent]];contrastNote.textContent=pairs.map(([label,color])=>{const r=CardContrast.ratio(color,c.background);return label+' / 背景 '+r.toFixed(3)+':1：'+(CardContrast.meetsReference(r)?'达到4.5参考值':'低于4.5参考值，建议调整');}).join('；')+'。比值仅显示三位小数，判定使用未舍入值。仅检查所选纯色，不代表完整无障碍合规；最终显示尺寸和字体需人工检查。不会自动改色或阻止导出。';}
Object.entries(specs).forEach(([k,v])=>{const o=document.createElement('option');o.value=k;o.textContent=v.name;$('template').append(o);});
function consent(){return !dirty||confirm('当前编辑尚未保存为可编辑稿，继续会替换或清空它。是否继续？');}
function fields(){ $('fields').replaceChildren();for(const [key,label] of specs[kind].fields){const l=document.createElement('label');l.htmlFor='f_'+key;l.textContent=label;const input=document.createElement(key==='title'||key.endsWith('Title')?'input':'textarea');input.id='f_'+key;input.value=values[key]||'';input.addEventListener('input',()=>{values[key]=input.value;dirty=true;revision++;render();});$('fields').append(l,input);}}
function cfg(){const c=Object.fromEntries(configIds.map(k=>[k,$(k).value]));c.titleSize=Number(c.titleSize);c.bodySize=Number(c.bodySize);c.lineHeight=Number(c.lineHeight);return c;}
function font(size,bold=false){ctx.font=(bold?'700 ':'400 ')+size+'px "Microsoft YaHei","PingFang SC",sans-serif';}
function wrap(text,width,size,bold=false){font(size,bold);let lines=[];for(const paragraph of String(text).split('\n')){let current='';const segments=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter('zh',{granularity:'grapheme'}).segment(paragraph)].map(s=>s.segment):Array.from(paragraph);for(const char of segments){if(current&&ctx.measureText(current+char).width>width){lines.push(current);current=char;}else current+=char;}lines.push(current);}return lines;}
function render(){
 const c=cfg();updateContrast(c);renderValid=false;$('export').disabled=true;
 for(const [key,label] of specs[kind].fields){const limit=key==='title'?600:10000;if((values[key]||'').length>limit){status(label+'超过'+limit+'字符；输入已保留但暂停预览和导出，请精简后继续。',true);return;}}
 if(!Number.isFinite(c.titleSize)||c.titleSize<32||c.titleSize>100||!Number.isFinite(c.bodySize)||c.bodySize<22||c.bodySize>60||!Number.isFinite(c.lineHeight)||c.lineHeight<1.15||c.lineHeight>2.2){status('字号或行距超出允许范围，请调整后继续。',true);return;}
 const ops=[];let y=160;
 const block=(text,x,width,size,bold=false,color=c.ink,start=y)=>{if(!text)return start;const lines=wrap(text,width,size,bold);lines.forEach((line,i)=>ops.push({text:line,x,y:start+i*size*c.lineHeight,size,bold,color}));return start+lines.length*size*c.lineHeight;};
 y=block(values.title,72,936,c.titleSize,true,c.ink)+42;
 if(kind==='compare'){
  let left=block(values.leftTitle,72,438,c.bodySize+4,true,c.accent)+18;
  left=block(values.left,72,438,c.bodySize,false,c.ink,left);
  let right=block(values.rightTitle,570,438,c.bodySize+4,true,c.accent)+18;
  right=block(values.right,570,438,c.bodySize,false,c.ink,right);
  y=Math.max(left,right)+38;
 }else{
  for(const [key,label] of specs[kind].fields){if(['title','note'].includes(key)||!values[key])continue;
   if(key!=='body'){y=block(label,72,936,24,true,c.accent)+12;}
   const text=kind==='steps'?values[key].split('\n').map((s,i)=>s?(i+1)+'. '+s:'').join('\n'):values[key];
   y=block(text,72,936,c.bodySize)+28;
  }
 }
 if(values.note)y=block(values.note,72,936,26,false,c.ink,y+20)+10;
 const needed=Math.ceil(y+100),height=c.ratio==='auto'?Math.min(6000,Math.max(1440,needed)):Number(c.ratio);
 canvas.width=1080;canvas.height=height;ctx.fillStyle=c.background;ctx.fillRect(0,0,1080,height);
 ctx.fillStyle=c.accent;ctx.fillRect(72,65,70,9);font(23,true);ctx.fillText(specs[kind].name+' /',165,84);
 ctx.textBaseline='top';
 for(const op of ops){font(op.size,op.bold);ctx.fillStyle=op.color;ctx.fillText(op.text,op.x,op.y);}
 ctx.fillStyle=c.accent;ctx.fillRect(72,height-48,936,2);
 $('dimensions').textContent='1080 × '+height+' px';
 if(needed>height){status('内容溢出：当前需要约 '+needed+' px 高度。请选择自动高度、减小字号或精简内容；导出已停止。',true);return;}
 renderValid=true;$('export').disabled=false;status('内容已完整排入画布。'+(dirty?' 当前有未保存的编辑。':' 示例已载入。'));
}
function status(text,error=false){$('status').textContent=text;$('status').className='notice'+(error?' error':'');}
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);}
configIds.forEach(id=>$(id).addEventListener('input',()=>{dirty=true;revision++;render();}));
$('template').addEventListener('change',()=>{const next=$('template').value;if(!consent()){$('template').value=kind;return;}kind=next;values={...specs[kind].demo};dirty=false;revision++;fields();render();});
$('clear').onclick=()=>{if(!confirm('清空当前模板全部文字？未保存的内容会丢失。'))return;values={};dirty=true;revision++;fields();render();};
$('reset').onclick=()=>{if(!consent())return;values={...specs[kind].demo};configIds.forEach(k=>$(k).value=defaults[k]);dirty=false;revision++;fields();render();};
$('export').onclick=()=>{render();if(!renderValid)return;canvas.toBlob(blob=>{if(blob)download(blob,'card-'+kind+'.png');else status('导出失败，请缩短内容后重试。',true);},'image/png');};
$('save').onclick=()=>{const content=JSON.stringify({version:1,template:kind,values,config:cfg()},null,2);download(new Blob([content],{type:'application/json'}),'card-draft.json');dirty=false;status('已请求下载可编辑稿，请确认文件已保存。');};
$('load').onclick=()=>$('draftFile').click();
$('draftFile').onchange=async()=>{const file=$('draftFile').files[0];$('draftFile').value='';if(!file)return;const sequence=++importSequence,before=revision;$('load').disabled=true;
 try{if(!/\.json$/i.test(file.name)||file.size>128*1024)throw Error('仅支持不超过128KB的JSON编辑稿。');const data=JSON.parse(await file.text());if(data.version!==1||typeof data.template!=='string'||!Object.hasOwn(specs,data.template)||!data.values||typeof data.values!=='object'||Array.isArray(data.values)||!data.config||typeof data.config!=='object'||Array.isArray(data.config))throw Error('不是支持的V1编辑稿。');
 const nextValues={};for(const [key] of specs[data.template].fields){if(typeof data.values[key]!=='string'&&data.values[key]!==undefined)throw Error('文字字段格式不正确。');nextValues[key]=data.values[key]||'';if(nextValues[key].length>(key==='title'?600:10000))throw Error('文字超过字段长度限制。');}
 const c=data.config;if(!['1440','1920','auto'].includes(String(c.ratio))||![c.titleSize,c.bodySize,c.lineHeight].every(n=>typeof n==='number'&&Number.isFinite(n))||c.titleSize<32||c.titleSize>100||c.bodySize<22||c.bodySize>60||c.lineHeight<1.15||c.lineHeight>2.2||!['background','ink','accent'].every(k=>/^#[0-9a-f]{6}$/i.test(c[k])))throw Error('排版参数不正确。');
 if(sequence!==importSequence)return;
 if(revision!==before)throw Error('读取期间当前内容已改变，请重新打开编辑稿；当前编辑已保留。');
 if(!consent())return;kind=data.template;values=nextValues;$('template').value=kind;configIds.forEach(k=>$(k).value=c[k]);dirty=false;revision++;fields();render();
 }catch(e){if(sequence===importSequence)status('无法打开编辑稿：'+e.message,true);}
 finally{if(sequence===importSequence)$('load').disabled=false;}
};
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
fields();render();

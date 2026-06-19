javascript:(function(){

if(document.getElementById("glassStudio"))return;

const PROFILE="YOUR_CATBOX_IMAGE";
const ORIGINAL="GLASS_ORIGINAL_PAGE";
const DRAFT="GLASS_DRAFT_HTML";

if(!sessionStorage.getItem(ORIGINAL)){
sessionStorage.setItem(ORIGINAL,document.documentElement.outerHTML);
}

const css=`
#glassStudio{
position:fixed;
inset:0;
z-index:2147483647;
display:flex;
align-items:center;
justify-content:center;
background:rgba(0,0,0,.15);
backdrop-filter:blur(20px);
font-family:-apple-system,BlinkMacSystemFont,sans-serif;
}

#glassCard{
position:relative;
width:min(92vw,760px);
height:min(88vh,780px);
border-radius:34px;
overflow:hidden;
background:rgba(255,255,255,.12);
backdrop-filter:blur(40px) saturate(180%);
border:1px solid rgba(255,255,255,.25);
box-shadow:
0 20px 80px rgba(0,0,0,.35),
inset 0 1px rgba(255,255,255,.25);
display:flex;
flex-direction:column;
color:#fff;
animation:open .25s ease;
}

#glassCard:before{
content:"";
position:absolute;
inset:0;
background:
linear-gradient(
130deg,
rgba(255,255,255,.25),
transparent 40%
);
pointer-events:none;
}

@keyframes open{
from{
opacity:0;
transform:scale(.95) translateY(15px);
}
to{
opacity:1;
transform:none;
}
}

#bar{
height:3px;
width:0%;
background:#fff;
transition:.4s;
}

#top{
padding:18px;
display:flex;
justify-content:space-between;
align-items:center;
cursor:move;
}

#profile{
display:flex;
align-items:center;
gap:12px;
}

#profile img{
width:58px;
height:58px;
border-radius:50%;
object-fit:cover;
border:2px solid rgba(255,255,255,.3);
}

#title{
font-size:18px;
font-weight:700;
}

#sub{
font-size:12px;
opacity:.7;
}

#content{
padding:15px;
display:flex;
flex-direction:column;
gap:12px;
flex:1;
}

#htmlBox{
flex:1;
resize:none;
border:none;
outline:none;
border-radius:22px;
padding:18px;
background:rgba(255,255,255,.08);
color:#fff;
font-size:14px;
}

#htmlBox::placeholder{
color:rgba(255,255,255,.5);
}

#actions{
display:flex;
gap:10px;
}

.btn{
flex:1;
height:52px;
border:none;
border-radius:18px;
cursor:pointer;
background:rgba(255,255,255,.12);
color:white;
display:flex;
justify-content:center;
align-items:center;
gap:10px;
font-weight:600;
}

.btn svg{
width:18px;
height:18px;
fill:white;
}

#loader{
position:fixed;
inset:0;
display:none;
align-items:center;
justify-content:center;
flex-direction:column;
background:rgba(0,0,0,.2);
backdrop-filter:blur(30px);
z-index:2147483647;
color:white;
}

.spin{
width:48px;
height:48px;
border:4px solid rgba(255,255,255,.15);
border-top-color:white;
border-radius:50%;
animation:spin .8s linear infinite;
}

@keyframes spin{
to{transform:rotate(360deg)}
}

.toast{
position:fixed;
left:50%;
bottom:30px;
transform:translateX(-50%);
padding:12px 20px;
border-radius:18px;
background:rgba(255,255,255,.12);
backdrop-filter:blur(25px);
color:white;
z-index:2147483647;
}
`;

const style=document.createElement("style");
style.textContent=css;
document.head.appendChild(style);

const ui=document.createElement("div");
ui.id="glassStudio";

ui.innerHTML=`
<div id="glassCard">

<div id="bar"></div>

<div id="top">

<div id="profile">
<img src="${PROFILE}">
<div>
<div id="title">Glass HTML Studio</div>
<div id="sub">Professional Editor</div>
</div>
</div>

</div>

<div id="content">

<textarea id="htmlBox" placeholder="Paste HTML here..."></textarea>

<div id="actions">

<button class="btn" id="exec">

<svg viewBox="0 0 24 24">
<path d="M8 5v14l11-7z"/>
</svg>

Execute
</button>

<button class="btn" id="restore">

<svg viewBox="0 0 24 24">
<path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6a6 6 0 0 1-5.6-4H4.2A8 8 0 0 0 12 21a8 8 0 0 0 0-16z"/>
</svg>

Restore
</button>

<button class="btn" id="close">

<svg viewBox="0 0 24 24">
<path d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/>
</svg>

Close
</button>

</div>

</div>

</div>

<div id="loader">
<div class="spin"></div>
<div style="margin-top:12px;font-weight:600">
Executing...
</div>
</div>
`;

document.body.appendChild(ui);

const box=document.getElementById("htmlBox");
box.value=localStorage.getItem(DRAFT)||"";

box.addEventListener("input",()=>{
localStorage.setItem(DRAFT,box.value);
});

function toast(msg){
const t=document.createElement("div");
t.className="toast";
t.textContent=msg;
document.body.appendChild(t);
setTimeout(()=>t.remove(),2000);
}

document.getElementById("close").onclick=()=>{
ui.remove();
};

document.getElementById("restore").onclick=()=>{
const original=sessionStorage.getItem(ORIGINAL);
if(original){
document.open();
document.write(original);
document.close();
}
};

document.getElementById("exec").onclick=()=>{

const html=box.value.trim();
if(!html){
toast("HTML kosong");
return;
}

localStorage.setItem(DRAFT,html);

document.getElementById("loader").style.display="flex";

document.getElementById("bar").style.width="100%";

setTimeout(()=>{

document.open();
document.write(html);
document.close();

},1200);
};

let drag=false,x=0,y=0;

const card=document.getElementById("glassCard");
const top=document.getElementById("top");

top.onmousedown=e=>{
drag=true;
const r=card.getBoundingClientRect();
x=e.clientX-r.left;
y=e.clientY-r.top;
card.style.position="fixed";
};

document.onmousemove=e=>{
if(!drag)return;
card.style.left=(e.clientX-x)+"px";
card.style.top=(e.clientY-y)+"px";
};

document.onmouseup=()=>drag=false;

toast("Glass Studio Ready");

})();

/* STAR BACKGROUND */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for(let i=0;i<200;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:Math.random()*2
});
}

function drawStars(){
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.fillStyle="white";
stars.forEach(s=>{
ctx.beginPath();
ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
ctx.fill();
});
requestAnimationFrame(drawStars);
}
drawStars();

/* NAVBAR SCROLL EFFECT */
window.addEventListener("scroll",()=>{
const nav=document.getElementById("navbar");
nav.classList.toggle("scrolled",window.scrollY>50);
});

/* PRICING TOGGLE */
document.getElementById("priceToggle").addEventListener("change",function(){
document.querySelectorAll(".price").forEach(price=>{
if(this.checked){
price.innerText="$"+price.dataset.year;
}else{
price.innerText="$"+price.dataset.month;
}
});
});

/* TESTIMONIAL SLIDER */
let index=0;
const testimonials=document.querySelectorAll(".testimonial");
setInterval(()=>{
testimonials[index].classList.remove("active");
index=(index+1)%testimonials.length;
testimonials[index].classList.add("active");
},3000);

/* SCROLL FADE UP */
const observer=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("show");
}
});
});
document.querySelectorAll(".fade-up").forEach(el=>{
observer.observe(el);
});

/* LEGAL MODAL FUNCTIONS */
function openLegal(id){
document.getElementById(id).style.display="flex";
document.body.style.overflow="hidden";
}

function closeLegal(id){
document.getElementById(id).style.display="none";
document.body.style.overflow="auto";
}

window.onclick=function(e){
document.querySelectorAll(".legal-modal").forEach(modal=>{
if(e.target===modal){
modal.style.display="none";
document.body.style.overflow="auto";
}
});
};
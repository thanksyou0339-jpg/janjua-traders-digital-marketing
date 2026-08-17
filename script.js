function openOrder(platform){
  document.getElementById("platform").value=platform;
  document.getElementById("orderForm").scrollIntoView({behavior:"smooth"});
  document.getElementById("productName").focus();
}
function shareFacebook(platform){
  const pageUrl=window.location.href;
  const text=encodeURIComponent(`Janjua Traders Digital Marketing Platform - ${platform}`);
  const shareUrl=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${text}`;
  window.open(shareUrl,"_blank","noopener,noreferrer");
}
document.getElementById("orderForm").addEventListener("submit",function(event){
  event.preventDefault();
  const platform=document.getElementById("platform").value;
  const name=document.getElementById("customerName").value.trim();
  const phone=document.getElementById("customerPhone").value.trim();
  const product=document.getElementById("productName").value.trim();
  const link=document.getElementById("productLink").value.trim();
  const message=document.getElementById("message").value.trim();
  console.log({platform,customerName:name,customerPhone:phone,product,productLink:link,message,createdAt:new Date().toISOString()});
  const result=document.getElementById("result");
  result.classList.remove("hidden");
  result.innerHTML=`<strong>Request تیار ہے۔</strong><br>Platform: ${escapeHtml(platform)}<br>Customer: ${escapeHtml(name)}<br>Product: ${escapeHtml(product)}<br><br>اگلے مرحلے میں approved platform API/backend یہاں لگایا جا سکتا ہے۔`;
});
function escapeHtml(value){return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));}

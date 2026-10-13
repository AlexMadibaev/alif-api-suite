const crypto = require('node:crypto');
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hmac=(message,secret)=>crypto.createHmac('sha256',secret).update(message).digest('hex');
module.exports=async(req,res)=>{
  if(req.method!=='POST')return res.status(405).setHeader('Allow','POST').end('Method Not Allowed');
  const key=process.env.ALIF_TEST_KEY,password=process.env.ALIF_TEST_PASSWORD;
  if(!key||!password)return res.status(503).setHeader('Content-Type','text/plain; charset=utf-8').end('Сначала задайте ALIF_TEST_KEY и ALIF_TEST_PASSWORD в Vercel');
  const body=typeof req.body==='string'?Object.fromEntries(new URLSearchParams(req.body)):req.body||{};
  const amountInput=String(body.amount??'').trim().replace(',','.');
  const amountNumber=Number(amountInput);
  const amount=Number.isFinite(amountNumber)?amountNumber.toFixed(2):'';
  const phoneInput=String(body.phone??'').replace(/[\s()+-]/g,'');
  const phone=/^\d{9}$/.test(phoneInput)?'992'+phoneInput:phoneInput;
  const gate=String(body.gate||'');
  if(!/^\d{1,6}(?:\.\d{1,2})?$/.test(amountInput)||!Number.isFinite(amountNumber)||amountNumber<0.01||amountNumber>999999.99||!/^992\d{9}$/.test(phone)||!['km','salom'].includes(gate)){
    return res.status(400).setHeader('Content-Type','text/plain; charset=utf-8').end('Некорректные данные формы');
  }
  const host=req.headers['x-forwarded-host']||req.headers.host;
  if(typeof host!=='string'||!/^[a-z0-9.-]+(?::\d{1,5})?$/i.test(host))return res.status(400).end('Invalid host');
  const orderId='T'+Date.now()+crypto.randomBytes(3).toString('hex').toUpperCase();
  const base='https://'+host,callbackUrl=base+'/api/callback',returnUrl=base+'/return.html?orderId='+encodeURIComponent(orderId);
  const token=hmac(key+orderId+amount+callbackUrl,hmac(password,key));
  const fields={key,token,orderId,gate,amount,callbackUrl,returnUrl,phone,info:'Sandbox test '+orderId};
  const inputs=Object.entries(fields).map(([k,v])=>`<input type="hidden" name="${escapeHtml(k)}" value="${escapeHtml(v)}">`).join('');
  res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-store');
  return res.status(200).end(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Переход в Alif Sandbox</title></head><body><p>Отправка заказа ${escapeHtml(orderId)} в Alif Sandbox…</p><form id="alif" method="post" action="https://test-web.alif.tj/">${inputs}<button type="submit">Продолжить вручную</button></form><script>document.getElementById('alif').submit()</script></body></html>`);
};
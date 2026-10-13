const crypto = require('node:crypto');
const hmac=(message,secret)=>crypto.createHmac('sha256',secret).update(message).digest('hex');
module.exports=(req,res)=>{
  if(req.method!=='POST')return res.status(405).send('Method Not Allowed');
  const key=process.env.ALIF_TEST_KEY, password=process.env.ALIF_TEST_PASSWORD;
  if(!key||!password)return res.status(503).send('Sandbox credentials not configured');
  const d=typeof req.body==='object'?req.body:null;
  if(!d||['orderId','status','transactionId','token'].some(k=>typeof d[k]!=='string'))return res.status(400).send('Invalid callback');
  const expected=hmac(d.orderId+d.status+d.transactionId,hmac(password,key));
  if(!/^[0-9a-f]{64}$/i.test(d.token)||!crypto.timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(d.token,'hex')))return res.status(403).send('Invalid signature');
  console.log('[ALIF SANDBOX callback]',{orderId:d.orderId,status:d.status,transactionId:d.transactionId});
  return res.status(200).send('OK');
};
// Safe non-transactional local request preview. No calls to undocumented APIs.
const allowed = ['payments','marketplace','tokenization','subscription'];
module.exports=async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const body=req.body||{},moduleName=body.module;
  if(!allowed.includes(moduleName))return res.status(400).json({error:'Unknown module'});
  const amount=Number(body.amount);
  if(!Number.isFinite(amount)||amount<=0||amount>999999)return res.status(400).json({error:'Amount must be >0 and <=999999'});
  const scenario=String(body.scenario||'').slice(0,80);
  const id=`TEST-${Date.now().toString(36).toUpperCase()}`;
  return res.status(200).json({mode:'preview',sent:false,module:moduleName,scenario,orderId:id,amount:amount.toFixed(2),currency:'TJS',requiredBeforeLive:['Official endpoint and HTTP method','Request JSON schema','Authentication/signature rules','Sandbox credentials','Webhook verification specification'],message:'Request preview generated locally. No request was sent to Alif.'});
};
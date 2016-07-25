# WXPay
nodejs实现微信支付API 
# 安装
  npm install
  
# 例子
### 用co, 你可以先安装co
  npm install co
### 代码
<pre>
<code>
let pay = require("./index");
let WXPay = pay.provider("WXPay");

co(function *(){
  let wxpay = new WXPay({
    appid:'',
    mch_id: '',
    partner_key: ''
  });
  let rlt = yield wxpay.createUnifiedOrder({
    body: '扫码支付测试',
    out_trade_no: pay.util.generateID(),
    total_fee: 1,
    spbill_create_ip: '127.0.0.1',
    notify_url: 'http://wxpay_notify_url',
    trade_type: 'NATIVE',
    product_id: '1234567890'
  });
});
</code>
</pre>
# 方法
- createUnifiedOrder 创建定单
- queryOrder 查询定单
- closeOrder 取消定单
- refund 退款

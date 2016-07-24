"user strict";

class PayFactory{
    static instance(pay){
        switch(pay){
            case "WXPay":
                return require("./providers/wxpay");
            default:
                return require("./abstractclass/pay");
        }
    }
}
module.exports = PayFactory;
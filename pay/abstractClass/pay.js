"use strict";

class Pay{
    createUnifiedOrder(opt){
        throw Error("createUnifiedOrder 没有实现");
    }

    queryOrder(query){
        throw Error("queryOrder 没有实现");
    }

    closeOrder(order){
        throw Error("closeOrder 没有实现");
    }

    refund(order){
        throw Error("refund 没有实现");
    }
}
module.exports = Pay;
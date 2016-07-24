"use strict";

let util = require('../helper/util');
let request = require('request');
let md5 = require('MD5');
let Pay = require("../abstractclass/pay");

class WXPay extends Pay{
	constructor (options){
		super();
		this.config = {
 			appid:'wx22e15e572e680692',
        	mch_id: '1283287301',
        	partner_key: '879d85f3b27a479ab82ad11a9fdb00a1'
		};
		util.mix(this.config,options);
		this.payConfig = {appid:this.config.appid,mch_id:this.config.mch_id};
	}

	sign(param){
		var querystring = Object.keys(param).filter(function(key){
			return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key)<0;
		}).sort().map(function(key){
			return key + '=' + param[key];
		}).join("&") + "&key=" + this.config.partner_key;

		return md5(querystring).toUpperCase();
	}

	createUnifiedOrder(opts){
		let ctx = this;
		opts.nonce_str = opts.nonce_str || util.generateNonceString();
		util.mix(opts, ctx.payConfig);
		opts.sign = ctx.sign(opts);

		return function(fn){
				request({
				url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
				method: 'POST',
				body: util.buildXML(opts),
				agentOptions: {
					pfx: ctx.config.pfx,
					passphrase: ctx.config.mch_id
				}
			}, function(err, response, body){
				if(err)
					throw new Error(err);
				util.parseXML(body, fn);
			});
		};
	}
	*getBrandWCPayRequestParams(order){
		order.trade_type = "JSAPI";
		var ctx = this;
		
		let rlt = yield ctx.createUnifiedOrder(order);
		var reqparam = {
			appId: ctx.config.appid,
			timeStamp: Math.floor(Date.now()/1000)+"",
			nonceStr: rlt.nonce_str,
			package: "prepay_id="+rlt.prepay_id,
			signType: "MD5"
		};
		reqparam.paySign = ctx.sign(reqparam);
		return reqparam;
	}
	createMerchantPrepayUrl(){
		param.time_stamp = param.time_stamp || Math.floor(Date.now()/1000);
		param.nonce_str = param.nonce_str || util.generateNonceString();
		util.mix(param, this.payConfig);
		param.sign = this.sign(param);

		var query = Object.keys(param).filter(function(key){
			return ['sign', 'mch_id', 'product_id', 'appid', 'time_stamp', 'nonce_str'].indexOf(key)>=0;
		}).map(function(key){
			return key + "=" + encodeURIComponent(param[key]);
		}).join('&');

		return "weixin://wxpay/bizpayurl?" + query;
	}
	queryOrder(query){
		if (!(query.transaction_id || query.out_trade_no)) { 
			fn(null, { return_code: 'FAIL', return_msg:'缺少参数' });
		}
		var ctx = this;
		query.nonce_str = query.nonce_str || util.generateNonceString();
		util.mix(query, ctx.payConfig);
		query.sign = ctx.sign(query);

		return function(fn) {
			request({
				url: "https://api.mch.weixin.qq.com/pay/orderquery",
				method: "POST",
				body: util.buildXML({xml: query})
			}, function(err, res, body){
				if(err)
					throw new Error(err);
				util.parseXML(body, fn);
			});
		}
	}
	closeOrder(order){
		if (!order.out_trade_no) {
			fn(null, { return_code:"FAIL", return_msg:"缺少参数" });
		}
		var ctx = this;
		order.nonce_str = order.nonce_str || util.generateNonceString();
		util.mix(order, ctx.payConfig);
		order.sign = ctx.sign(order);

		return function(fn) {
			request({
				url: "https://api.mch.weixin.qq.com/pay/closeorder",
				method: "POST",
				body: util.buildXML({xml:order})
			}, function(err, res, body){
				if(err)
					throw new Error(err);
				util.parseXML(body, fn);
			});
		};
	}
	refund(order){
		if (!(order.transaction_id || order.out_refund_no)) { 
			fn(null, { return_code: 'FAIL', return_msg:'缺少参数' });
		}
		var ctx = this;
		order.nonce_str = order.nonce_str || util.generateNonceString();
		util.mix(order, ctx.payConfig);
		order.sign = ctx.sign(order);

		return function(fn){
			request({
				url: "https://api.mch.weixin.qq.com/secapi/pay/refund",
				method: "POST",
				body: util.buildXML({xml: order}),
				agentOptions: {
					pfx: ctx.config.pfx,
					passphrase: ctx.config.mch_id
				}
			}, function(err, response, body){
				if(err)
					throw new Error(err);
				util.parseXML(body, fn);
			});
		};
	}
}
module.exports = WXPay;

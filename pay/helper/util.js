"use strict";

let xml2js = require('xml2js');
let dateFormat = require("dateformat");

class util{
	static buildXML(json){
		var builder = new xml2js.Builder();
		return builder.buildObject(json);
	}

	static parseXML(xml, fn){
		var parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false });
		parser.parseString(xml, fn||function(err, result){
			throw Error("回调函数为空！");
		});
	}
	static mix(){
		var root = arguments[0];
		if (arguments.length==1) { return root; }
		for (var i=1; i<arguments.length; i++) {
			for(var k in arguments[i]) {
				root[k] = arguments[i][k];
			}
		}
		return root;
	}
	static generateNonceString(){
		return Math.random().toString(36).substr(2, 15);
	}

	static dateConverter(date,f){
		return dateFormat(date, f);
	}

	static generateID(){
		let cur = new Date();
		return this.dateConverter(cur,"yyyymmddHHMMss") + Math.random().toString().substr(2, 11);
	}

	static generateQRData(content,extension){
		let qr = require("qr-image");
		return qr.imageSync(content, { type: extension });
	}
	static generateQR(res,content,extension){
		let qr = require("qr-image");
		var code = qr.image(content, { type: extension });
        code.pipe(res);
	}
}
module.exports = util;
"use strict";

let fs = require("fs");
let path = require("path");

class SystemHelper{
    static IsMatchHelperOrService( currClass,endWiths )
    {
        if(typeof( currClass ) !== "function")
            return false;
        let status = 0;
        for(let str of endWiths){
            if(currClass.name.endsWith( str ))
                status ++;
        }
        if(status>0)
            return true;
    }

    static mix(root,...args){
		if (args.length==0) { return root; }
		for (var i=0; i<args.length; i++) {
			for(var k in args[i]) {
				root[k] = args[i][k];
			}
		}
		return root;
	}

    static AddHelperAndService( dirPath,endWiths )
    {
        let files = fs.readdirSync( dirPath );
        for( let i = 0 ; i < files.length ; i++ )
        {
            let filePath = path.join( dirPath , files[i] );
            let stats = fs.statSync( filePath );
            if( !stats.isDirectory() )
            {
                global._currentSite = typeof(global._currentSite) === "undefined"? {config:{}} : global._currentSite;
                let curr = require( filePath );
                if( this.IsMatchHelperOrService(curr,endWiths)  )
                {
                    let nameSpace = typeof( curr.getNameSpace ) === "function"? curr.getNameSpace():curr.name;
                    global._currentSite[nameSpace] = curr;
                }
                else if(path.basename(filePath, ".js").toLowerCase()==="siteconfig")
                {
                    this.mix(global._currentSite.config,curr);
                }
            }
            else
            {
                this.AddHelperAndService( filePath,endWiths );
            }
        }
    }
}
module.exports = SystemHelper;
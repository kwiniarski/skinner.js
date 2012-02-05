(function(){
	
	var plugins = {
		"lower": function(){return String(this).toLowerCase();},
		"upper": function(){return String(this).toUpperCase();},
		"default": function(d){return (this.toString().search(/^\[object(.+?)?\]$/i)!=-1)?d:this;},
		"replace": function(e,r){return String(this).replace(e,r);}
	};
	
	function removeQuotes (a) {
		var i = a.length;
		while(i--) {
			a[i] = a[i].replace(/^(\u0022|\u0027|&#3(4|9);)|(\u0022|\u0027|&#3(4|9);)$/g,'');
		}
		return a;
	}
	function escapeQuotes (v) {
		return v.replace(/\\"/g,'&#34;').replace(/\\'/g,'&#39;');
	}
	function hasQuotes (v, q) {
		var i;
		return ((i = v.indexOf(q))!=-1) ? {s:i, e:v.indexOf(q, i+1)} : false;
	}
	function indexOfQuotes (v) {
		var s=hasQuotes(v,"'");
		var d=hasQuotes(v,'"');
		return (s&&d)?((s.s<d.s)?s:d):((s)?s:((d)?d:{s:-1,e:-1}));
	}
	function split (v, s) {

		if(v.indexOf(s)>0) {
			var q,i=0,a=[];
			v = escapeQuotes(v); // replace escaped quotes with entities
			while (i>=0) {
				i = v.indexOf(s, i); // set carret position
				q = indexOfQuotes(v); // get info about quotes
				if (i>0 && (i>q.e || q.s<0 || i<q.s)) { // compare carret with quotes
					a.push(v.substr(0, i));
					v = v.substr(i+1);
					i = 0;
				} else if (i<0) { // this will add rest to the array and end the while loop
					a.push(v);
				} else { // move caret position to the last quote position
					i=q.e;   
				}    
			}
			return a;
		}
		return [v];
	}
	
	function parse (params) {
		params = Array.prototype.slice.call(params);
		var c, a, v = params[0], o = params.slice(1);
		while (o.length) {
			c = split(o.shift(),":");
			if(c[0] in plugins){
				a = removeQuotes(c.slice(1));
				v = plugins[c[0]].apply(v, a);
			}
		}
		return v;		
	}
	
	if(this.skinner) {
		this.skinner.splitter = split;
		this.skinner.modifier = parse;
		this.skinner.registerPlugin = function(name, fn){
			plugins[name] = fn;
		};
	} else {
		throw new Error('skinner.js must be loaded before modifiers');
	}
}());
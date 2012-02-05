(function(){
	var cache = {},
		whitespace = /^\s*|\r|\n|\t|\s*$/g,
		quotes = /"/g,
		map = [
			[/\{if\s+(.+?)\}/g,function(s,n){return '";if('+n.replace('@','i.')+'){_+="'}],
			[/\{else\}/g,'";}else{_+="'],
			[/\{else\s+(.+?)\}/g,'";}else if($1){_+="'],
			[/\{\/if\}/g,'";}_+="'],
			[/\{foreach\s+(.+?)\s+as\s+(\$\w+)\}/g,'";_this.e($1,function($2,i){_+="'],
			[/\{\/foreach\}/g,'";});_+="'],
			[/\{(\$.+?)\}/g,function(s,n){
				if(self.splitter){
					n = self.splitter(n,'|');
					return (n.length==1) ? '"+'+n[0]+'+"' : '"+_this.r('+n[0]+',"'+n.slice(1).join('","')+'")+"';
				} else {
					return '"+'+n+'+"';
				}
			}],
			[/\{@([a-z]+)\}/g,'"+i.$1+"'],
			[/\{\*\s+.+?\s+\*\}/g,''],
			[/\{assign\s+var=(\$\w+)\s+value=(.+?)\}/g,function(s,n,m){return '";var '+n+'='+m.replace('@','i.')+';_+="'}]
		];
	
	
	function getTemplate (id) {
		var tpl = document.getElementById(id).text;
		return (tpl) ? tpl.replace(whitespace, '').replace(quotes, '\\$&') : false;
	}

	function parseTemplate (tpl) {
		var i = map.length;
		while(i--) {
			tpl = tpl.replace(map[i][0], map[i][1]);
		}
		return makeTemplate('var _this=this,_="";_+="'+tpl+'";return _;');		
	}
	
	function makeTemplate (fnbody) {
		console.log(fnbody);
		try {
			return new Function('$tpl', '"use strict";'+fnbody);
		} catch (error) {
			throw new Error('Template compilation error: ' + error.message);
		}
	}

	function makeDOMObject (html) {
		var i, l, tmp, dom = document.createDocumentFragment();
		(tmp = document.createElement('div')).innerHTML = html;
		for(i = 0, l = tmp.childNodes.length; i < l; i++){
			// Clone nodes to remove parentElement
			dom.appendChild(tmp.childNodes.item(i).cloneNode(true));
		}
		return dom.childNodes;
	}
	
	
	
	var self = this.skinner = {
		/**
		 * Compile HTML template to tpl function
		 * @param {String} id Compiled template ID
		 * @param {String} [template]
		 */
		compile: function(id, template) {
			template = template || getTemplate(id);
			cache[id] = parseTemplate(template);
		},
		/**
		 * Fetch HTML string or DOM object
		 * @param {String} id Compiled template ID
		 * @param {Mixed} data Object or Array
		 * @param {Mixed} [dom] Callback\Wrapper for HTML string
		 */
		fetch: function(id, data, dom) {
			return this.render(((cache[id]) ? cache[id] : parseTemplate(getTemplate(id))), data, dom);
		},
		render: function(template, data, dom) {
			try {
				var html = ((typeof template === 'function') ? template : parseTemplate(template)).call(tpl,data);
				return (dom) ? ((typeof dom === 'function') ? dom(html) : makeDOMObject(html)) : html;
			} catch(error) {
				throw new Error('Template render error: ' + error.message);
			}
		}
	};
	

	var tpl = {
		r: function(){return (self.modifier||function(v){return v;})(arguments);},
		i: function(k,i,t){return{key:k,index:i,total:t,number:i+1,last:i+1==t,first:i==0};},
		e: function(d,c){var t,k,i=0;if(d.length){t=d.length;while(i<t){c(d[i],this.i(k,i,t));i++;}}else{t=this.t(d);for(k in d){if(d.hasOwnProperty(k)){c(d[k],this.i(k,i,t));i++;}}}},
		t: function(o){var n=0;for(var k in o){if(o.hasOwnProperty(k)){n++;}}return n;}
	};	
	
}());


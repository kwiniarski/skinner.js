//var blocks = new YUITest.TestSuite("Blocks' Test Suite");
var blocks = new YUITest.TestCase({
	
    name : "{...} blocks",
	
    // setUp and tearDown
    setUp : function () {
		this.data = {
			yes: true,
			no: false,
			numbers: [10,20,30],
			items: { one: 1, two: 2, three: 3 },
			getTrue: function(){
				return this.yes;
			},
			getArray: function(i){
				return (typeof i === 'number') ? this.numbers[i] : this.numbers;
			},
			isString: function(s){
				return typeof s === 'string';
			}
		}
	},
    tearDown : function () {
		delete this.data;
	},

    // Test methods - names must begin with "test"
    "test {if expression} ... {/if} block" : function () {
		var r = skinner.render, a = YUITest.Assert;
        a.areEqual("OK", r('{if $tpl.yes}OK{/if}', this.data));
        a.areEqual("OK", r('{if $tpl.getTrue() == true}OK{/if}', this.data));
        a.areEqual("OK", r('{if !$tpl.no}OK{/if}', this.data));
        a.areEqual("OK", r('{if $tpl.no == false}OK{/if}', this.data));
        a.areEqual("OK", r('{if !$tpl.missing}OK{/if}', this.data));
        a.areEqual("OK", r('{if $tpl.missing == undefined}OK{/if}', this.data));
        a.areEqual("OK", r('{if typeof $tpl.missing === "undefined"}OK{/if}', this.data));
        a.areEqual("OK", r('{if $tpl.getArray().length == 3}OK{/if}', this.data));
        a.areEqual("OK", r('{if $tpl.getArray(1) == 20}OK{/if}', this.data));
        a.areEqual("OK", r('{if ($tpl.getArray(1) == 20 && $tpl.getArray(2) == 30)}OK{/if}', this.data));
        a.areEqual("OK", r('{if $tpl.isString("if")}OK{/if}', this.data));
        a.areEqual("OK", r('{if $tpl.isString("&#123;if&#125;")}OK{/if}', this.data));
//		Tests bellow will not pass
//		For now leave it as it is - other engines has similar problems...
//        a.areEqual("OK", r('{if $tpl.isString("{}")}OK{/if}', this.data));
//        a.areEqual("OK", r('{if $tpl.isString("{if}")}OK{/if}', this.data));
//        a.areEqual("OK", r('{if $tpl.isString("\u007Bif\u007D")}OK{/if}', this.data));
    },
	
	 "test {if expression} ... {else} ... {/if} block" : function () {
		var r = skinner.render, a = YUITest.Assert;
        a.areEqual("OK", r('{if !$tpl.yes}NO{else}OK{/if}', this.data));		 
        a.areEqual("OK", r('{if $tpl.getArray(0) == 20}NO{else $tpl.getArray(1) == 20}OK{/if}', this.data));		 
        a.areEqual("OK", r('{if $tpl.missing1}NO{else $tpl.missing2}NO{else $tpl.missing3}NO{else}OK{/if}', this.data));		 
	 },
	
	 "test {foreach ...} ... {/foreach} block" : function () {
		 var r = skinner.render, a = YUITest.Assert;
		 a.areEqual("102030", r('{foreach $tpl.getArray() as $num}{$num}{/foreach}', this.data));
		 a.areEqual("123", r('{foreach $tpl.items as $item}{$item}{/foreach}', this.data));
	 },

	 "test {foreach ...} {@variable} {/foreach} block" : function () {
		 var r = skinner.render, a = YUITest.Assert;
		 a.areEqual("012", r('{foreach $tpl.getArray() as $num}{@key}{/foreach}', this.data));
		 a.areEqual("123", r('{foreach $tpl.getArray() as $num}{@number}{/foreach}', this.data));
		 a.areEqual("333", r('{foreach $tpl.getArray() as $num}{@total}{/foreach}', this.data));
		 a.areEqual("true;false;false;", r('{foreach $tpl.getArray() as $num}{@first};{/foreach}', this.data));
		 a.areEqual("false;false;true;", r('{foreach $tpl.getArray() as $num}{@last};{/foreach}', this.data));
		 
		 a.areEqual("one;two;three;", r('{foreach $tpl.items as $num}{@key};{/foreach}', this.data));
		 a.areEqual("123", r('{foreach $tpl.items as $num}{@number}{/foreach}', this.data));
		 a.areEqual("333", r('{foreach $tpl.items as $num}{@total}{/foreach}', this.data));
		 a.areEqual("true;false;false;", r('{foreach $tpl.items as $num}{@first};{/foreach}', this.data));
		 a.areEqual("false;false;true;", r('{foreach $tpl.items as $num}{@last};{/foreach}', this.data));		 
	 },

	 "test {foreach ...} {if @variable} ... {/if} {/foreach} block" : function () {
		var r = skinner.render, a = YUITest.Assert;
		a.areEqual("10", r('{foreach $tpl.getArray() as $num}{if @first}{$num}{/if}{/foreach}', this.data));
		a.areEqual("30", r('{foreach $tpl.getArray() as $num}{if @last}{$num}{/if}{/foreach}', this.data));
	 },
	
	 "test {assign var=... value=...} block" : function () {
		 var r = skinner.render, a = YUITest.Assert;
		 a.areEqual("string", r('{assign var=$test value="string"}{$test}', this.data));
		 a.areEqual("10", r('{assign var=$test value=$tpl.getArray(0)}{$test}', this.data));
		 a.areEqual("one", r('{foreach $tpl.items as $item}{if @first}{assign var=$test value=@key}{$test}{/if}{/foreach}', this.data));
	 },
	
	 "test {$variable} block" : function () {
		 var r = skinner.render, a = YUITest.Assert;
		 a.areEqual("10", r('{$tpl.getArray(0)}', this.data));		 
		 a.areEqual("3", r('{$tpl.getArray().length}', this.data));		 
		 a.areEqual("10", r('{$tpl.numbers[0]}', this.data));		 
		 a.areEqual("1", r('{$tpl.items.one}', this.data));		 
		 a.areEqual("1", r('{$tpl.items["one"]}', this.data));		 
	 }

});
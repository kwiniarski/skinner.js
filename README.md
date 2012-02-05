# skinner.js - Simple & fast template engine for JavaScript

JavaScript template engines are becomming more and more popular. There is
already huge list of template engines out there. So why another one?

**Small**

Many of those template engines deliver us plenty of functionality which we 
will never use. This makes the whole library only bigger in size. If you 
are building advanced and complicated JavaScript application, in addition you 
probably already have included some of those: jQuery, jQuery UI, Backbone, 
Modernizer, etc. Adding more and more not only makes your JS files bigger 
for download, but also unnecessarly consumes browser's JavaScript memory.

**Fast**

When rendering large amount of data you have to be sure that your engine is 
fast enough. Precompiling templates is not all. Probably every engine does 
compilation, but depending how it was done (how compiled template looks like) 
the time of rendering may differ. Below I'm including some tests run with 
Benchmark.js under Chrome 16. All used engines make compiled templates, 
although rendering speed is totaly different.

	jQuery.tmpl x 946 ops/sec ±5.60% (51 runs sampled)
	SkinnerJS x 183,412 ops/sec ±0.78% (61 runs sampled)
	doT x 277,667 ops/sec ±3.99% (56 runs sampled)

**Simple**

Template language syntax is similar to the one of the best know templating
systems - Smarty for PHP. This makes it easy to learn or even migrate from
PHP to JavaScript. When your templates are edited by people from the outside 
of IT department, it's important to have templates which are easy to understand.

**What to choose?**

It depends on your needs. Each template engine is a mixture of speed, size,
possibilities, extendibility and something what I would call usability (is it 
easy to learn for others, how it integrates with your code editor and other 
tools). My observations about the last point are that smaller and faster 
engines tend to be more complicated in their syntax. Those with "pretty" syntax 
are little slower and bigger.
**SkinnerJS is designed to meet the golden mean principle**.

## Features

* It is designed to be **small and fast** (precompiling templates is not enough);
* PHP's Smarty syntax, so you can take an adventage of the editors with 
**Smartys's syntax highlighting**;
* **Extendable** with additional blocks and modifiers;
* Does not use `with {...}` and `eval()`, as seen in other engines;

### Supported blocks

* `{if expression} ... {else [expression]} ... {/if}`
* `{foreach $collection as $item} ... {/foreach}`
* `{assign var=$name value='data'}`
* `{$variable[|modifiers]}` with possibility to register your own modifiers
* `{@key}, {@number}, {@last}, {@first}, {@total}`
* possibility to register your own blocks

### Issues & known limitations

* Advanced expressions in variables are limited and used incorrectly will throw
*Template render error*;
* All root properties/methods can be accessed only by `$tpl` variable;
* All variables created in template must be preceeded by `$` sign (in `{foreach 
... as $...}` and `{assign var=$... value=...}`);
* All `{@...}` variables are accessable only inside loop which created them (if 
you have loop inside another loop, you can acces `{@...}` only from loop you are 
currently in);

## Example

### Data

	var albums = [
		{ "title": "My album", "composer": "Myself", "year": 2000, "single": true },
		{ "title": "Your album", "composer": "You", "year": 2001 }
	];

### Template

	<script type="text/x-tpl" id="albums-template">
		{foreach $tpl.albums as $album}
			<li class="album">
				<small>{@number} of {@total}</small><br/>
				<strong>{$album.title|upper}</strong>
				{if $album.single}(single){/if}<br/>
				by {$album.composer}
			</li>
		{/foreach}
	</script>

	<ul id="albums-list"></ul>

### Code

	skinner.compile('albums-template');
	document.getElementById('albums-list').innerHTML = skinner.fetch('albums-template', {
		"albums": albums
	});

## License
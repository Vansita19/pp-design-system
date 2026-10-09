/* Bubble-only scope, token contracts and long/unsafe text; no browser claim. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),style={},context={window:{},document:{createElement:()=>style,getElementById:()=>style,head:{append(){}}}};vm.createContext(context);
for(const file of ['tokens.js','chat-bubble.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma,css=fs.readFileSync(path.join(dist,'chat-bubble.css'),'utf8');
let configurations=0;
for(const appearance of ['primary','secondary','tinted','outline','ghost'])for(const align of ['start','end'])for(const grouping of ['single','grouped']){
 const c={appearance,align,grouping,text:'A < B & C\nNext line'},html=F.chatBubble(c),tokens=F.chatBubbleTokens(c);
 assert.match(html,/A &lt; B &amp; C\nNext line/,'Plain message content is escaped without losing newlines');
 assert.equal((html.match(/data-slot="bubble"/g)||[]).length,grouping==='grouped'?2:1);
 assert.doesNotMatch(html,/data-smooth-/);
 assert.match(html,new RegExp(`data-appearance="${appearance}" data-align="${align}"`));
 assert.doesNotMatch(html,/<(?:button|a\b|form|input|textarea|table|nav|header|aside|img|small|time)\b|role="(?:log|status)"|tabindex|aria-live|pp-source-chat|pp-composer|pp-chat-history|pp-chat-panel/,'Bubble stays presentational without conversation furniture');
 assert.equal(tokens.length,new Set(tokens).size);
 for(const id of tokens){assert.ok(F.tokens[id],id);assert.notEqual(F.resolve(id),undefined,id);if(id.startsWith('component.'))assert.match(F.tokens[id].value,/^\{[^}]+\}$/);for(const target of F.chain(id))assert.equal(F.tokens[id].type,F.tokens[target].type);}
 for(const match of html.matchAll(/var\(--pp-([\w-]+)\)/g)){const referenced=match[1].replace(/-/g,'.');assert.ok(tokens.includes(referenced),referenced+' must appear in the configuration contract');}
 assert.equal(tokens.includes('component.chatBubble.gap'),grouping==='grouped');
 assert.equal(tokens.includes('component.chatBubble.radius'),appearance!=='ghost');
 assert.equal(tokens.includes('component.chatBubble.borderWidth'),appearance==='outline');
 configurations++;
}
assert.equal(F.resolve('component.chatBubble.radius'),'9px');assert.equal(F.resolve('component.chatBubble.paddingX'),'12px');assert.equal(F.resolve('component.chatBubble.paddingY'),'6px');
assert.match(F.chatBubble({appearance:'<script>',align:'wrong',grouping:'wrong',text:'<script>alert("unsafe")</script>'}),/data-appearance="primary" data-align="start"/);
assert.doesNotMatch(F.chatBubble({text:'<script>alert("unsafe")</script>'}),/<script>/);assert.match(F.chatBubble({text:''}),/<p data-slot="bubble-content"><\/p>/);
const long='x'.repeat(10000);assert.ok(F.chatBubble({text:long}).includes(long),'Long text is preserved for wrapping');
assert.match(css,/max-width:80%/);assert.match(css,/data-appearance=ghost[^}]*max-width:100%/);assert.match(css,/overflow-wrap:anywhere/);assert.match(css,/white-space:pre-wrap/);
assert.match(css,/align-self:flex-start/);assert.match(css,/data-align=end[^}]*align-self:flex-end/);assert.doesNotMatch(css,/margin-(left|right)|float:(left|right)|text-align:(left|right)/,'Alignment follows inherited text direction');
assert.match(css,/forced-colors:active/);
const luminance=hex=>{const rgb=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
for(const appearance of ['primary','secondary','tinted','outline','ghost']){const a=luminance(F.resolve(`component.chatBubble.${appearance}.foreground`)),b=luminance(F.resolve(appearance==='ghost'?'semantic.surface.default':`component.chatBubble.${appearance}.background`));assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,appearance+' text contrast');}
console.log(JSON.stringify({configurations,contrastPairs:5,scope:'bubble-only markup, aliases, source dimensions, escaping, wrapping and logical alignment; no browser',status:'passed'}));

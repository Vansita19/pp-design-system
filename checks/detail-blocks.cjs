/* Source geometry, token references, disclosure and numeric meter contracts. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),document={getElementById:()=>({}),createElement:()=>({}),head:{append(){}}},context={window:{},document};vm.createContext(context);
for(const file of ['tokens.js','hugeicons-icons.js','tag.js','utility-atoms.js','navigation-controls.js','drawer.js','spinner.js','previews.js','command-menu.js','guided-popover.js','tooltip.js','file-upload.js','date-picker.js','avatar.js','pitch-patterns.js','ai-response.js','detail-blocks.js','card-patterns.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const F=context.window.Forma,css=fs.readFileSync(path.join(dist,'detail-blocks.css'),'utf8');
const validateTokens=ids=>{for(const id of ids){assert.ok(F.tokens[id],id);F.resolve(id);if(id.startsWith('component.'))assert.match(F.tokens[id].value,/^\{.+\}$/);}};
// These are information compositions: the labelled shell is separate from its content surfaces.
const questionCard=F.evidenceBlock({variant:'question'}),founderCard=F.profileTimeline({variant:'profile'}),researchCard=F.informationEvidence();
assert.match(researchCard,/<section[^>]+pp-information-card/);
assert.match(researchCard,/class="pp-information-body pp-information-evidence-body"/);
assert.equal((researchCard.match(/<details\b/g)||[]).length,2);validateTokens(F.informationEvidenceTokens());
assert.doesNotMatch(F.evidenceBlock({variant:'signals'}),/pp-information-card/,'Standalone research disclosures do not gain an extra nested shell');
assert.match(questionCard,/<section[^>]+pp-information-card/);
assert.match(questionCard,/<header[^>]+pp-information-head[\s\S]+<div class="pp-information-body">/);
assert.match(questionCard,/Customer Adoption/);assert.match(questionCard,/What does repeat usage look like in your current customer cohort\?/);
assert.match(questionCard,/Founder’s answer/);assert.doesNotMatch(questionCard,/<details[^>]*\bopen\b/);
assert.match(founderCard,/<section[^>]+pp-information-card/);
assert.match(founderCard,/>Founders<\/h3>/);
assert.equal((founderCard.match(/<article class="pp-information-body pp-profile-person"/g)||[]).length,2);
for(const name of ['Nina Park','Omar Reed'])assert.ok(founderCard.includes(name));
assert.equal((founderCard.match(/>EnrichLayer profile<\/span>/g)||[]).length,2);
assert.doesNotMatch(founderCard,/<details[^>]*\bopen\b/);
assert.equal((F.profileTimeline({variant:'profile',open:true}).match(/<details[^>]*\bopen\b/g)||[]).length,2,'Each founder has a native independently expandable profile');
assert.match(F.profileTimeline({people:[{name:'Name <',role:'Role &',bio:'Text >'}]}),/Name &lt;/);
assert.doesNotMatch(F.evidenceBlock({variant:'question',question:{question:'<script>alert(1)</script>',answer:'<img src=x>'}}),/<script|<img src=x>/);
assert.match(F.evidenceBlock({variant:'question',question:{question:'Text <',answer:'Answer &'}}),/Text &lt;/);
for(const ids of [F.evidenceBlockTokens({variant:'question'}),F.profileTimelineTokens({variant:'profile'})])for(const token of ['component.information.shell','component.information.radius','component.information.inset','component.information.padding'])assert.ok(ids.includes(token),token+' describes the actual shared shell');
let evidenceConfigurations=0,metricConfigurations=0,profileConfigurations=0;
for(const variant of ['signals','question'])for(const status of ['verified','pending'])for(const open of [false,true])for(const excerpt of [false,true])for(const metrics of [false,true]){
 const c={variant,status,open,excerpt,metrics},html=F.evidenceBlock(c);validateTokens(F.evidenceBlockTokens(c));
 assert.equal((html.match(/<details\b/g)||[]).length,variant==='signals'?2:1);assert.equal((html.match(/\bopen>/g)||[]).length,open?1:0);
 assert.equal(html.includes('pp-evidence-inline-metrics'),variant==='signals'&&metrics);assert.doesNotMatch(html,/<summary[^>]+role="button"/);
 if(variant==='signals'){assert.equal(html.includes('Supporting excerpt'),excerpt);assert.match(html,/data-ai-source-trigger/);assert.match(html,/>Signal 1<\/span>/);assert.match(html,/Local sample/);assert.equal(html.includes('>Verified</span>'),status==='verified');}
 else{assert.match(html,/pp-evidence-answer/);assert.equal(html.includes('No answer yet.'),status==='pending');assert.equal(html.includes('<h4>Assessment</h4>'),excerpt&&status==='verified');}
 evidenceConfigurations++;
}
for(const variant of ['metrics','score','highlights'])for(const columns of [2,4])for(const footer of [false,true]){
 const c={variant,columns,footer},html=F.metricCard(c);validateTokens(F.metricCardTokens(c));
 if(variant==='metrics'){assert.match(html,new RegExp('columns-'+columns));assert.equal((html.match(/<dt>/g)||[]).length,8);assert.equal(html.includes('Local sample'),footer);}
 if(variant==='score'){assert.match(html,/role="meter"/);assert.match(html,/aria-valuenow="84"/);assert.equal((html.match(/<rect /g)||[]).length,100);assert.equal(html.includes('pp-metric-score-footer'),footer);}
 if(variant==='highlights'){assert.match(html,/>\$2M ARR</);assert.equal(html.includes('Annual recurring revenue'),footer);}
 metricConfigurations++;
}
for(const [input,expected]of [[-3,0],[0,0],[1,1],[49.6,50],[100,100],[101,100],['not a number',84],[Infinity,84]]){
 const html=F.metricCard({variant:'score',value:input});assert.match(html,new RegExp(`aria-valuenow="${expected}"`));assert.equal((html.match(/fill="color-mix/g)||[]).length,expected,'Only the assessed portion of the meter is filled');metricConfigurations++;
}
assert.match(F.metricCard({items:[['Label <','Long value & data exceeding eighteen characters']]}),/Label &lt;/);assert.match(F.metricCard({items:[['Label','Long value & data exceeding eighteen characters']]}),/class="long-value"/);
for(const variant of ['profile','timeline'])for(const content of ['experience','education'])for(const avatar of ['text','image','placeholder'])for(const open of [false,true]){
 const c={variant,content,avatar,open},html=F.profileTimeline(c);validateTokens(F.profileTimelineTokens(c));
 assert.equal((html.match(/<li>/g)||[]).length,(content==='experience'?3:2)*(variant==='profile'?2:1));assert.match(html,/<ol>/);assert.equal(html.includes('<details'),variant==='profile');
 if(variant==='profile'){assert.equal(html.includes(' open>'),open);assert.equal(html.includes('pp-avatar-image'),avatar==='image');assert.equal(html.includes('pp-avatar-placeholder'),avatar==='placeholder');assert.match(html,/Sample profile/);}
 profileConfigurations++;
}
assert.match(F.profileTimeline({variant:'timeline',items:[['Role <','Company &','2024','Description >']]}),/Role &lt;/);
// Timeline count/company pills render the same atom and token map as standalone small neutral badges.
const timelineCalls=[],realBadge=F.badge;F.badge=(c,label)=>{timelineCalls.push({c,label});return realBadge(c,label);};
const timelineHTML=F.profileTimeline({variant:'timeline',content:'experience'});F.badge=realBadge;
assert.equal(timelineCalls.length,4);for(const {c,label}of timelineCalls){assert.equal(c.variant,'soft');assert.equal(c.size,'sm');assert.equal(c.tone,'neutral');assert.ok(timelineHTML.includes(realBadge(c,label)));}
const badgeContract=F.badgeTokens({variant:'soft',size:'sm',tone:'neutral'});for(const token of Object.values(badgeContract))assert.ok(F.profileTimelineTokens({variant:'timeline'}).includes(token),token+' is in the composed inspector');
assert.equal(F.resolve(badgeContract.height),'20px');assert.equal(F.resolve(badgeContract.font),'11px');
assert.doesNotMatch(css,/\.pp-profile[^{}]*\.pp-badge[^{}]*\{[^}]*(?:height|font-size|border-radius|background):/,'Timeline does not restyle its badge atom');
assert.doesNotMatch(css,/--avatar-(?:size|font|radius):/,'Profile must keep the shared avatar renderer geometry');
for(const token of ['component.avatar.size.lg','component.avatar.font.lg','component.avatar.radius.square'])assert.ok(F.profileTimelineTokens({variant:'profile'}).includes(token),token+' remains in the composed profile inspector');
assert.match(F.profileTimeline({variant:'profile'}),/--avatar-size:var\(--pp-component-avatar-size-lg\)/);
assert.equal(F.resolve('component.avatar.size.lg'),'40px');assert.equal(F.resolve('component.avatar.font.lg'),'14px');
const variables=new Set(Object.keys(F.tokens).map(F.varName));for(const [,variable]of css.matchAll(/var\((--pp-[a-zA-Z0-9-]+)/g))assert.ok(variables.has(variable),variable);
assert.doesNotMatch(css,/#[0-9a-f]{3,8}\b/i);assert.match(css,/@container/);assert.match(css,/@media \(forced-colors:active\)/);
assert.equal(F.resolve('component.evidence.bodyInset'),'44px');assert.equal(F.resolve('component.metric.valueFont'),'20px');assert.equal(F.resolve('component.profile.avatarSize'),F.resolve('component.avatar.size.lg'));assert.equal(F.resolve('component.timeline.rail'),'18px');
assert.equal(F.resolve('component.information.inset'),'2px');assert.equal(F.resolve('component.information.radius'),'12px');assert.equal(F.resolve('component.profile.cardRadius'),'16px');assert.equal(F.resolve('component.profile.disclosureSurface'),F.resolve('component.information.shell'));
assert.match(css,/\.pp-profile-stack\{[^}]*gap:0/);assert.match(css,/\.pp-information-body\.pp-profile-person\{[^}]*border:0/);
// Keyboard movement supplements the native independently expandable details.
let focused,handler,removed=false;const triggers=Array.from({length:2},()=>({focus(){focused=this;}})),group={querySelectorAll:()=>triggers,addEventListener(type,fn){assert.equal(type,'keydown');handler=fn;},removeEventListener(type,fn){assert.equal(type,'keydown');assert.equal(fn,handler);removed=true;}},root={querySelectorAll:()=>[group]},cleanups=[];
F.wireDetailBlocks(root,fn=>cleanups.push(fn));let prevented=false;
handler({key:'ArrowDown',target:triggers[0],preventDefault(){prevented=true;}});assert.equal(focused,triggers[1]);assert.equal(prevented,true);
handler({key:'Home',target:triggers[1],preventDefault(){}});assert.equal(focused,triggers[0]);
handler({key:'End',target:triggers[0],preventDefault(){}});assert.equal(focused,triggers[1]);
cleanups[0]();assert.equal(removed,true);
console.log(JSON.stringify({evidenceConfigurations,metricConfigurations,profileConfigurations,interactionContracts:4,status:'passed',scope:'source geometry, aliases, native disclosures, safe content, numeric score bounds, shared source citations, and listener cleanup'}));

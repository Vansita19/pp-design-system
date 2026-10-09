import {build} from 'esbuild';
import postcss from 'postcss';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url)),output=path.resolve(root,'../../dist');
const notices=[readFileSync(path.join(root,'LICENSE'),'utf8'),readFileSync(path.join(root,'THIRD_PARTY_LICENSES.txt'),'utf8')].join('\n\n');
const result=await build({metafile:true,alias:{'lucide-react':path.join(root,'hugeicons-react.tsx')},banner:{js:'/* Spectrum toast-stack original source and runtime license notices\n'+notices.replaceAll('*/','* /')+'\n*/'},absWorkingDir:root,entryPoints:['island.tsx'],bundle:true,minify:true,format:'iife',target:['es2020'],outfile:path.join(output,'spectrum-toast-runtime.js'),define:{'process.env.NODE_ENV':'"production"'},legalComments:'eof'});
if(Object.keys(result.metafile.inputs).some(file=>file.includes('node_modules/lucide-react/')))throw new Error('Unexpected Lucide geometry in toast bundle');
execFileSync(process.execPath,[path.join(root,'node_modules/@tailwindcss/cli/dist/index.mjs'),'-i',path.join(root,'styles.css'),'-o',path.join(root,'.toast-css.tmp'),'--minify'],{cwd:root,stdio:'inherit'});
// No preflight. Prefix actual selectors while leaving keyframes/properties at
// valid top level; nested media queries remain inside their originating rule.
const css=postcss.parse(readFileSync(path.join(root,'.toast-css.tmp'),'utf8'));
css.walkRules(rule=>{
  let parent=rule.parent,nested=false,keyframe=false;
  while(parent){if(parent.type==='rule')nested=true;if(parent.type==='atrule'&&parent.name.endsWith('keyframes'))keyframe=true;parent=parent.parent;}
  if(keyframe||nested)return;
  rule.selectors=rule.selectors.map(selector=>selector===':root'||selector===':host'?'.pp-spectrum-toast-host':`.pp-spectrum-toast-host ${selector}`);
});
writeFileSync(path.join(output,'spectrum-toast-runtime.css'),css.toString()+'\n');
unlinkSync(path.join(root,'.toast-css.tmp'));

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(), qa='work/qa/service-area-content-repair-20260917';
const candidate=JSON.parse(fs.readFileSync(qa+'/final-inputs.json','utf8'));
const dir=path.join(candidate.out,'audit/service-area-content-20260917');
const before=JSON.parse(fs.readFileSync(dir+'/before.json','utf8'));
const after=JSON.parse(fs.readFileSync(dir+'/after.json','utf8'));
const browser=JSON.parse(fs.readFileSync(dir+'/browser.json','utf8'));
const query=JSON.parse(fs.readFileSync('work/qa/service-area-content-audit-20260917/query-dom-audit.json','utf8'));
const checks=JSON.parse(fs.readFileSync(qa+'/checks.json','utf8')).checks;
const lookup=new Map(after.rows.map(r=>[r.id,r]));
const invariantProblems=[], changes=[];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
if(!same(before.invariants,after.invariants))invariantProblems.push('Protected build invariant changed');
if(!same(before.rows.map(r=>r.id).sort(),after.rows.map(r=>r.id).sort()))invariantProblems.push('Presentation inventory changed');
for(const old of before.rows){
 const current=lookup.get(old.id);
 if(!current){invariantProblems.push('Missing presentation '+old.id);continue;}
 if(old.h1!==current.h1)invariantProblems.push('Unapproved static H1 change '+old.id);
 if(old.metadata && ['title','canonical','robots'].some(k=>old.metadata[k]!==current.metadata[k]))invariantProblems.push('Protected metadata changed '+old.id);
 if(!same(old.galleries,current.galleries))invariantProblems.push('Static gallery changed '+old.id);
 for(const issue of old.issues)changes.push({id:old.id,url:old.url,kind:old.kind,code:issue.code,reason:issue.reason,field:issue.field,oldH1:old.h1,oldDescription:old.intro,oldCopy:issue.oldCopy,correctedH1:current.h1,correctedDescription:current.intro,correctedCopy:current[issue.field]??'',remainingIssues:current.issues});
}
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const snapshot=JSON.parse(fs.readFileSync(qa+'/snapshot.json','utf8'));
const own=JSON.parse(fs.readFileSync(qa+'/copy-change-manifest.json','utf8')).files;
const runtimeFiles=[...own.map(r=>r.file),'src/cityRentalView.ts'];
const sourceDrift=[];
for(const [file,initial] of Object.entries(snapshot.hashes)){
 if(!fs.existsSync(file)){sourceDrift.push('Missing '+file);continue;}
 if(runtimeFiles.includes(file)){if(hash(file)!==hash(path.join(candidate.out,file)))sourceDrift.push(file+' differs from tested candidate');}
 else if(hash(file)!==initial)sourceDrift.push(file+' changed outside repair scope');
}
if(hash('src/cityRentalView.ts')!==query.sourceHashes.after)invariantProblems.push('Query audit does not match final source');
for(const row of query.rows)changes.push({id:row.url,url:row.url,kind:'city-query',code:'query-product-identity',reason:'City context rotated the destination equipment/use case and replaced its reviewed gallery with a generic image pool.',field:'heading, immediate description and gallery',oldH1:row.oldH1,oldDescription:row.oldDescription,oldCopy:JSON.stringify(row.oldImages),correctedH1:row.correctedH1,correctedDescription:row.correctedDescription,correctedCopy:'Preserved base product identity, original supporting content and reviewed gallery; added selected location and rental-planning context.',remainingIssues:row.issues});
const output='audit/service-area-content-20260917';
fs.mkdirSync(output,{recursive:true});
const cell=value=>'"'+String(typeof value==='object'?JSON.stringify(value):value??'').replaceAll('"','""')+'"';
function csv(name,rows,columns){fs.writeFileSync(output+'/'+name,columns.join(',')+'\n'+rows.map(r=>columns.map(c=>cell(r[c])).join(',')).join('\n'));}
csv('mismatches-and-corrections.csv',changes,['id','url','kind','code','reason','field','oldH1','oldDescription','oldCopy','correctedH1','correctedDescription','correctedCopy','remainingIssues']);
fs.writeFileSync(output+'/mismatches-and-corrections.json',JSON.stringify(changes,null,2));
for(const file of fs.readdirSync(dir))if(/\.(json|csv|png)$/.test(file)&&!file.includes('progress'))fs.copyFileSync(path.join(dir,file),path.join(output,file));
fs.copyFileSync('work/qa/service-area-content-audit-20260917/query-dom-audit.json',output+'/city-query-before-after.json');
fs.copyFileSync('work/qa/service-area-content-audit-20260917/query-h1-corrections-proposed.json',output+'/city-query-h1-corrections-proposed.json');
fs.writeFileSync(output+'/checks.json',JSON.stringify(checks,null,2));
const summary={at:new Date().toISOString(),environment:'Local isolated build only; no preview deployment or live-site verification',origin:candidate.origin,staticServiceAreaUrls:after.summary.urls,linkedCityQueryUrls:query.summary.queryPresentations,totalAuditedUrlPresentations:after.summary.urls+query.summary.queryPresentations,logicalMapPresentations:after.summary.modals,staticBaseline:before.summary,staticFinal:after.summary,browser:browser.summary,queryAudit:query.summary,queryAuditMethod:query.environment,recordedCorrectionInstances:changes.length,uniqueCorrectedPresentations:new Set(changes.map(r=>r.id)).size,invariantProblems,sourceDrift,files:runtimeFiles.map(file=>({file,sha256:hash(file)})),checks};
fs.writeFileSync(output+'/summary.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify({...summary,checks:checks.map(c=>({name:c.name,exitCode:c.exitCode}))},null,2));
process.exitCode=after.summary.issueInstances||query.summary.unresolved||invariantProblems.length||sourceDrift.length||browser.summary.pageFailures||browser.summary.modalFailures||browser.summary.responsiveFailures||browser.summary.mapClickFailures||browser.summary.browserErrors?1:0;

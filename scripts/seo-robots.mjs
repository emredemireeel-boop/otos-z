export function robotsAllows(text,path,agent='Googlebot'){
    const groups=[];let group=null;
    for(const line of text.split(/\r?\n/)){const match=line.replace(/#.*/,'').trim().match(/^([^:]+):\s*(.*)$/);if(!match)continue;const key=match[1].toLowerCase(),value=match[2].trim();if(key==='user-agent'){if(!group||group.rules.length){group={agents:[],rules:[]};groups.push(group);}group.agents.push(value.toLowerCase());}else if(group&&['allow','disallow'].includes(key)&&value)group.rules.push({allow:key==='allow',pattern:value});}
    const scores=groups.map(g=>({g,score:Math.max(-1,...g.agents.map(a=>a==='*'?0:agent.toLowerCase().startsWith(a)?a.length:-1))})),best=Math.max(-1,...scores.map(s=>s.score));
    const matches=scores.filter(s=>s.score===best&&best>=0).flatMap(s=>s.g.rules).filter(r=>{const expression=r.pattern.split('*').map(p=>p.replace(/[.+?^${}()|[\]\\]/g,'\\$&')).join('.*').replace(/\\\$$/,'$');return new RegExp('^'+expression).test(path);}).sort((a,b)=>b.pattern.replace(/\*/g,'').length-a.pattern.replace(/\*/g,'').length||Number(b.allow)-Number(a.allow));
    return matches[0]?.allow??true;
}

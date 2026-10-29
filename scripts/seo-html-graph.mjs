export function breadthFirstDepth(graph,start='/'){
    const depths=new Map([[start,0]]),queue=[start];
    for(let i=0;i<queue.length;i++)for(const next of graph.get(queue[i])||[]){
        if(depths.has(next))continue;
        depths.set(next,depths.get(queue[i])+1);queue.push(next);
    }
    return depths;
}

import 'server-only';
export const SITE='https://otosoz.com';
export const ORGANIZATION_ID=`${SITE}/#organization`;
export const WEBSITE_ID=`${SITE}/#website`;
type Node=Record<string,any>;
// Old route objects use the same final policy while their data adapters migrate.
function normalize(value:any):any {
    if(Array.isArray(value))return value.map(normalize).filter(item=>item!==null);
    if(!value||typeof value!=='object')return value;
    const node=Object.fromEntries(Object.entries(value).map(([key,item])=>[key,normalize(item)]));
    const type=node['@type'];
    if(type==='Organization' && (node.name==='OtoSöz'||node['@id']===ORGANIZATION_ID))return organization();
    if(type==='WebSite' && node.name==='OtoSöz')return website();
    if(type==='QAPage' && !(node.mainEntity?.acceptedAnswer||node.mainEntity?.suggestedAnswer?.length))return null;
    if(['Article','NewsArticle','HowTo'].includes(type)){
        const url=node.url||node.mainEntityOfPage?.['@id']||node.mainEntityOfPage;
        if(typeof url==='string')return {...node,...(type==='NewsArticle'?newsArticle:article)({url,headline:node.headline||node.name||'',description:node.description||'',datePublished:node.datePublished,dateModified:node.dateModified}),...(type==='HowTo'?{step:undefined,totalTime:undefined,tool:undefined,supply:undefined}:{})};
    }
    if(type==='BreadcrumbList' && node.itemListElement?.length){const url=node.itemListElement.at(-1)?.item; if(typeof url==='string')node['@id']=url+'#breadcrumb';}
    return node;
}
export function schemaJson(value:unknown):string{return JSON.stringify(normalize(value)).replace(/</g,'\\u003c');}
export function organization():Node{return {'@type':'Organization','@id':ORGANIZATION_ID,name:'OtoSöz',url:SITE+'/',logo:{'@type':'ImageObject',url:SITE+'/organization-logo.png',width:512,height:512},contactPoint:{'@type':'ContactPoint',contactType:'editorial',url:SITE+'/iletisim',availableLanguage:'tr'}};}
export function website():Node{return {'@type':'WebSite','@id':WEBSITE_ID,url:SITE+'/',name:'OtoSöz',inLanguage:'tr-TR',publisher:{'@id':ORGANIZATION_ID}};}
export type BreadcrumbItem={name:string;url:string};
export function breadcrumb(items:BreadcrumbItem[],url=items.at(-1)?.url||SITE+'/'):Node{return {'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:new URL(item.url,SITE).href}))};}
export function itemList({url,items}:{url:string;items:{name:string;url:string}[]}):Node{return {'@type':'ItemList','@id':url+'#list',numberOfItems:items.length,itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,...item}))};}
export function collectionPage({url,name,description,items}:{url:string;name:string;description?:string;items?:{name:string;url:string}[]}):Node{return {'@type':'CollectionPage','@id':url+'#webpage',url,name,description,inLanguage:'tr-TR',isPartOf:{'@id':WEBSITE_ID},breadcrumb:{'@id':url+'#breadcrumb'},...(items?{mainEntity:itemList({url,items})}:{})};}
function realDate(value:unknown){if(!value)return undefined;const d=new Date(value as string);return Number.isFinite(d.getTime())&&d.getTime()<=Date.now()?d.toISOString():undefined;}
export type ArticleInput={url:string;headline:string;description:string;datePublished?:string;dateModified?:string;image?:string};
export function article(input:ArticleInput):Node {const {url,headline,description}=input;return {'@type':'Article','@id':url+'#article',url,headline:[...headline].slice(0,110).join(''),description,inLanguage:'tr-TR',datePublished:realDate(input.datePublished),dateModified:realDate(input.dateModified),image:{'@type':'ImageObject',url:new URL(input.image||`/api/og?title=${encodeURIComponent(headline)}`,SITE).href,width:1200,height:630},mainEntityOfPage:{'@id':url+'#webpage'},isPartOf:{'@id':WEBSITE_ID},publisher:{'@id':ORGANIZATION_ID},author:{'@type':'Organization','@id':ORGANIZATION_ID,name:'OtoSöz'}};}
export function newsArticle(input:ArticleInput):Node{return {...article(input),'@type':'NewsArticle','@id':input.url+'#article'};}
export function discussionForumPosting({url,headline,text,author,datePublished,dateModified,comments=[]}: {url:string;headline:string;text:string;author:{name:string;url?:string};datePublished?:string;dateModified?:string;comments?:Node[]}):Node{return {'@type':'DiscussionForumPosting','@id':url+'#discussion',url,headline,text,author:{'@type':'Person',...author},datePublished:realDate(datePublished),dateModified:realDate(dateModified),comment:comments,interactionStatistic:{'@type':'InteractionCounter',interactionType:'https://schema.org/CommentAction',userInteractionCount:comments.length},isPartOf:{'@id':WEBSITE_ID}};}
export function qaPage({url,question,answers}:{url:string;question:Node;answers:Node[]}):Node|null {if(!answers.length)return null;return {'@type':'QAPage','@id':url+'#webpage',url,mainEntity:{'@type':'Question',...question,answerCount:answers.length,suggestedAnswer:answers}};}
export function schemaGraph(nodes:(Node|null)[]):Node{return {'@context':'https://schema.org','@graph':nodes.filter(Boolean)};}

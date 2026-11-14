import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
 return {name:'Swipe to Help',short_name:'Swipe to Help',description:'Discover community needs and startup ideas. Early access, no financial transactions.',start_url:'/',scope:'/',display:'standalone',background_color:'#071311',theme_color:'#071311',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]};
}

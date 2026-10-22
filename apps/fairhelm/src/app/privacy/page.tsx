import type {Metadata} from "next";
import {legalHref,legalUrl} from "@fairhelm/config/urls";
import {MovedDocument} from "@fairhelm/ui/components/moved-document";
export const metadata:Metadata={title:"Document moved",alternates:{canonical:legalUrl("fairhelm","/privacy/")},robots:{index:false,follow:true}};
export default function Page(){return <MovedDocument landmark={false} href={legalHref("fairhelm","/privacy/")}/>;}

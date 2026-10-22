import type {Metadata} from "next";
import {PRESS_ORIGIN,pressHref} from "@fairhelm/config/urls";
import {MovedDocument} from "@fairhelm/ui/components/moved-document";
export const metadata:Metadata={title:"Press resources moved",alternates:{canonical:`${PRESS_ORIGIN}/`},robots:{index:false,follow:true}};
export default function Page(){return <MovedDocument landmark={false} href={pressHref()}/>;}

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Lightbulb } from "lucide-react";

const navigationItems = [
    { href: "#sobre", text: "Sobre" },
    { href: "#programacao", text: "Programação" },
    { href: "#palestrantes", text: "Palestrantes" },
    { href: "#parceiros", text: "Parceiros" },
    { href: "#localizacao", text: "Localização" },
    { href: "#faq", text: "FAQ" },
];

export default function Header() {
    return (
        <header className="flex items-center justify-between px-4 py-2 bg-card text-card-foreground border-b">
            <div className="flex items-center">
                <Image src={"/logos/logo-unitins.png"} alt="Logo UNITINS" width={180} height={50} />
            </div>
            <nav>
                <NavigationMenu className="flex gap-x-8">
                    <NavigationMenuList className="flex gap-x-5">
                        {navigationItems.map((item) => (
                            <NavigationMenuItem key={item.text} >
                                <Link href={item.href}>
                                    {item.text}
                                </Link>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>

                    <Button variant="primary" size="lg" className="flex items-center gap-2 font-semibold px-6 py-2 rounded-xl">
                        <Lightbulb className="w-5 h-5" />
                        Participar
                    </Button>
                </NavigationMenu>
            </nav>
        </header>
    );
}


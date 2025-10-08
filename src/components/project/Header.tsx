import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
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
        <header className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-2 bg-card text-card-foreground border-b">
            <div className="flex items-center mb-3 sm:mb-0">
                <Image 
                    src={"/logos/logo-unitins.png"} 
                    alt="Logo UNITINS" 
                    width={140} 
                    height={40} 
                    className="sm:w-[160px] sm:h-[45px] lg:w-[180px] lg:h-[50px]"
                />
            </div>
            <nav className="w-full sm:w-auto">
                <NavigationMenu className="flex flex-col sm:flex-row gap-4 sm:gap-x-6 lg:gap-x-8">
                    <NavigationMenuList className="flex flex-wrap justify-center sm:flex-nowrap gap-3 sm:gap-x-4 lg:gap-x-5">
                        {navigationItems.map((item) => (
                            <NavigationMenuItem key={item.text} className="text-sm sm:text-base">
                                <Link href={item.href} className="font-medium hover:text-primary transition-colors">
                                    {item.text}
                                </Link>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>

                    <Button 
                        variant="primary" 
                        size="lg" 
                        className="flex items-center gap-2 font-semibold px-4 sm:px-6 py-2 text-sm sm:text-base rounded-xl mt-3 sm:mt-0 w-full sm:w-auto justify-center"
                    >
                        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Participar</span>
                        <span className="sm:hidden">Inscrever-se</span>
                    </Button>
                </NavigationMenu>
            </nav>
        </header>
    );
}


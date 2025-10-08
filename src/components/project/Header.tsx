'use client';

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
import { Lightbulb, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navigationItems = [
    { href: "#sobre", text: "Sobre" },
    { href: "#programacao", text: "Programação" },
    { href: "#palestrantes", text: "Palestrantes" },
    { href: "#parceiros", text: "Parceiros" },
    { href: "#localizacao", text: "Localização" },
    { href: "#faq", text: "FAQ" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header 
            className={`
                fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white
                ${isScrolled 
                    ? 'shadow-md border-b border-primary/10' 
                    : 'border-b border-border'
                }
            `}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-3">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image 
                            src="/logos/logo-unitins.png" 
                            alt="Logo UNITINS" 
                            width={180} 
                            height={50} 
                            className="h-12 w-auto"
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <NavigationMenu>
                            <NavigationMenuList className="flex gap-1">
                                {navigationItems.map((item) => (
                                    <NavigationMenuItem key={item.text}>
                                        <Link 
                                            href={item.href}
                                            className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 relative group/item"
                                        >
                                            {item.text}
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover/item:w-full transition-all duration-300" />
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>

                        <Button 
                            variant="default" 
                            size="lg" 
                            className="flex items-center gap-2 font-semibold px-6 py-2.5 rounded-lg bg-primary hover:bg-accent transition-all duration-200"
                        >
                            <Lightbulb className="w-5 h-5" />
                            Participar
                        </Button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div 
                className={`
                    lg:hidden absolute top-full left-0 right-0 bg-white border-b border-primary/10
                    transition-all duration-300 overflow-hidden
                    ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
                `}
            >
                <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
                    {navigationItems.map((item, index) => (
                        <Link
                            key={item.text}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-4 py-3 text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                        >
                            {item.text}
                        </Link>
                    ))}
                    <Button 
                        variant="default" 
                        size="lg" 
                        className="flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-lg bg-primary hover:bg-accent transition-all duration-200 mt-2"
                    >
                        <Lightbulb className="w-5 h-5" />
                        Participar
                    </Button>
                </nav>
            </div>
        </header>
    );
}


'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sparkles, Menu, X } from "lucide-react";
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
                fixed top-0 left-0 right-0 z-50 
                transition-all duration-500 ease-in-out
                ${isScrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-primary/10' 
                    : 'bg-transparent border-b border-transparent'
                }
            `}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link 
                        href="https://www.unitins.br/nPortal/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="transition-all duration-300 hover:opacity-80 relative z-10"
                    >
                        <Image 
                            src="/logos/logo-unitins.png" 
                            alt="Logo UNITINS" 
                            width={160} 
                            height={45}
                            priority
                            className={`w-auto h-9 sm:h-11 transition-all duration-500 ${
                                isScrolled ? 'brightness-100' : 'brightness-0 invert'
                            }`}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navigationItems.map((item) => (
                            <Link 
                                key={item.text}
                                href={item.href}
                                className={`text-sm font-medium transition-all duration-500 ease-in-out relative group ${
                                    isScrolled 
                                        ? 'text-foreground/70 hover:text-primary' 
                                        : 'text-white/90 hover:text-white drop-shadow-lg'
                                }`}
                            >
                                {item.text}
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                                    isScrolled ? 'bg-primary' : 'bg-white'
                                }`} />
                            </Link>
                        ))}

                        <Button 
                            asChild
                            size="default"
                            className={`transition-all duration-500 ease-in-out shadow-sm hover:shadow-md ${
                                isScrolled 
                                    ? 'bg-[#083D77] hover:bg-[#38B6FF] text-white' 
                                    : 'bg-white hover:bg-white/90 text-[#083D77] hover:scale-105'
                            }`}
                        >
                            <a href="#inscricao" className="flex items-center gap-2">
                                Participar
                            </a>
                        </Button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`lg:hidden p-2 transition-all duration-500 ease-in-out rounded-lg ${
                            isScrolled 
                                ? 'text-foreground hover:text-primary hover:bg-secondary/30' 
                                : 'text-white hover:text-white/80 hover:bg-white/10 drop-shadow-lg'
                        }`}
                        aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div 
                className={`
                    lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border/50
                    transition-all duration-500 ease-in-out shadow-lg
                    ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 overflow-hidden'}
                `}
            >
                <nav className="container mx-auto px-4 py-6 space-y-1">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.text}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-3 text-base font-medium text-foreground/70 hover:text-primary hover:bg-secondary/50 rounded-lg transition-all"
                        >
                            {item.text}
                        </Link>
                    ))}
                    
                    <div className="pt-4">
                        <Button 
                            asChild
                            size="lg"
                            className="w-full bg-primary hover:bg-accent transition-all"
                        >
                            <a href="#inscricao" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Participar
                            </a>
                        </Button>
                    </div>
                </nav>
            </div>
        </header>
    );
}


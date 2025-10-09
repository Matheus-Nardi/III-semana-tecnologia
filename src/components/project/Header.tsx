'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const mobileButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on escape key and manage focus trap
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
                mobileButtonRef.current?.focus();
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* Skip to main content link for accessibility */}
            <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg"
            >
                Pular para o conteúdo principal
            </a>

            <header 
                className={`
                    fixed top-0 left-0 right-0 z-50 
                    transition-all duration-500 ease-in-out
                    ${isScrolled 
                        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-primary/10' 
                        : 'bg-transparent border-b border-transparent'
                    }
                `}
                role="banner"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link 
                        href="https://www.unitins.br/nPortal/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="transition-all duration-300 hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded relative z-10"
                        aria-label="Ir para o site da UNITINS (abre em nova aba)"
                    >
                        <Image 
                            src="/logos/logo-unitins.png" 
                            alt="UNITINS - Universidade Estadual do Tocantins" 
                            width={160} 
                            height={45}
                            priority
                            className={`w-auto h-9 sm:h-11 transition-all duration-500 ${
                                isScrolled ? 'brightness-100' : 'brightness-0 invert'
                            }`}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8" aria-label="Navegação principal">
                        {navigationItems.map((item) => (
                            <Link 
                                key={item.text}
                                href={item.href}
                                className={`text-sm font-medium transition-all duration-500 ease-in-out relative group px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                                    isScrolled 
                                        ? 'text-foreground/70 hover:text-primary focus-visible:text-primary' 
                                        : 'text-white/90 hover:text-white focus-visible:text-white drop-shadow-lg'
                                }`}
                            >
                                {item.text}
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full group-focus-visible:w-full transition-all duration-300 ${
                                    isScrolled ? 'bg-primary' : 'bg-white'
                                }`} aria-hidden="true" />
                            </Link>
                        ))}

                        <Button 
                            asChild
                            size="default"
                            className={`transition-all duration-500 ease-in-out shadow-sm hover:shadow-md focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                                isScrolled 
                                    ? 'bg-[#083D77] hover:bg-[#38B6FF] focus-visible:bg-[#38B6FF] text-white focus-visible:ring-primary' 
                                    : 'bg-white hover:bg-white/90 focus-visible:bg-white/90 text-[#083D77] hover:scale-105 focus-visible:scale-105 focus-visible:ring-white'
                            }`}
                        >
                            <a href="#inscricao" className="flex items-center gap-2">
                                Participar
                            </a>
                        </Button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        ref={mobileButtonRef}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`lg:hidden p-2 min-h-[44px] min-w-[44px] transition-all duration-500 ease-in-out rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                            isScrolled 
                                ? 'text-foreground hover:text-primary focus-visible:text-primary hover:bg-secondary/30 focus-visible:bg-secondary/30 focus-visible:ring-primary' 
                                : 'text-white hover:text-white/80 focus-visible:text-white hover:bg-white/10 focus-visible:bg-white/10 drop-shadow-lg focus-visible:ring-white'
                        }`}
                        aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div 
                ref={mobileMenuRef}
                id="mobile-menu"
                className={`
                    lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border/50
                    transition-all duration-500 ease-in-out shadow-lg
                    ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 overflow-hidden'}
                `}
                aria-hidden={!isMobileMenuOpen}
            >
                <nav className="container mx-auto px-4 py-6 space-y-1" aria-label="Navegação móvel">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.text}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-3 min-h-[44px] text-base font-medium text-foreground/70 hover:text-primary focus-visible:text-primary hover:bg-secondary/50 focus-visible:bg-secondary/50 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                        >
                            {item.text}
                        </Link>
                    ))}
                    
                    <div className="pt-4">
                        <Button 
                            asChild
                            size="lg"
                            className="w-full min-h-[48px] bg-primary hover:bg-accent focus-visible:bg-accent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            <a href="#inscricao" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" aria-hidden="true" />
                                Participar
                            </a>
                        </Button>
                    </div>
                </nav>
            </div>
        </header>
        </>
    );
}


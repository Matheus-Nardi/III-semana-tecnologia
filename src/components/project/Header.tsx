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

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        };
        if (isMobileMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileMenuOpen]);

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
    };

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
            role="banner"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link 
                        href="https://www.unitins.br/nPortal/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="transition-all duration-300 hover:opacity-80 relative z-10 focus-ring rounded"
                        aria-label="Ir para o portal da UNITINS"
                    >
                        <Image 
                            src="/logos/logo-unitins.png" 
                            alt="Logo UNITINS" 
                            width={160} 
                            height={45}
                            priority
                            className={`w-auto h-8 sm:h-9 md:h-10 lg:h-11 transition-all duration-500 ${
                                isScrolled ? 'brightness-100' : 'brightness-0 invert'
                            }`}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Navegação principal">
                        {navigationItems.map((item) => (
                            <Link 
                                key={item.text}
                                href={item.href}
                                className={`text-sm xl:text-base font-medium transition-all duration-500 ease-in-out relative group py-2 focus-ring rounded ${
                                    isScrolled 
                                        ? 'text-foreground/70 hover:text-[#e2187f]' 
                                        : 'text-white/90 hover:text-white drop-shadow-lg'
                                }`}
                            >
                                {item.text}
                                <span 
                                    className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                                        isScrolled ? 'bg-gradient-to-r from-[#e2187f] to-[#38B6FF]' : 'bg-white'
                                    }`} 
                                    aria-hidden="true"
                                />
                            </Link>
                        ))}

                        <button 
                            onClick={() => window.location.href = '#inscricao'}
                            className={`group relative px-6 py-3 font-bold rounded-xl transition-all duration-300 overflow-hidden touch-target focus-ring ${
                                isScrolled 
                                    ? 'bg-[#083D77] text-white hover:scale-105 hover:shadow-xl' 
                                    : 'bg-white text-[#083D77] hover:scale-105 hover:shadow-2xl hover:shadow-white/20'
                            }`}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" aria-hidden="true" />
                                Participar
                            </span>
                            <div className={`absolute inset-0 transition-opacity duration-300 ${
                                isScrolled 
                                    ? 'bg-gradient-to-r from-[#38B6FF] to-[#4FD1FF] opacity-0 group-hover:opacity-100' 
                                    : 'bg-gradient-to-r from-[#e2187f] to-[#38B6FF] opacity-0 group-hover:opacity-20'
                            }`} />
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMobileMenuOpen(!isMobileMenuOpen);
                        }}
                        className={`lg:hidden p-2 transition-all duration-500 ease-in-out rounded-lg touch-target focus-ring ${
                            isScrolled 
                                ? 'text-foreground hover:text-primary hover:bg-secondary/30' 
                                : 'text-white hover:text-white/80 hover:bg-white/10 drop-shadow-lg'
                        }`}
                        aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div 
                id="mobile-menu"
                className={`
                    lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border/50
                    transition-all duration-500 ease-in-out shadow-lg
                    ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 overflow-hidden'}
                `}
                role="navigation"
                aria-label="Navegação mobile"
            >
                <nav className="container mx-auto px-4 py-6 space-y-1">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.text}
                            href={item.href}
                            onClick={handleNavClick}
                            className="block px-4 py-3 text-base font-medium text-foreground/70 hover:text-[#e2187f] hover:bg-gradient-to-r hover:from-[#e2187f]/5 hover:to-[#38B6FF]/5 rounded-lg transition-all duration-300 touch-target focus-ring"
                        >
                            {item.text}
                        </Link>
                    ))}
                    
                    <div className="pt-4">
                        <button 
                            onClick={() => {
                                handleNavClick();
                                window.location.href = '#inscricao';
                            }}
                            className="group relative w-full px-6 py-4 bg-[#083D77] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden touch-target focus-ring"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" aria-hidden="true" />
                                Participar
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#38B6FF] to-[#4FD1FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}


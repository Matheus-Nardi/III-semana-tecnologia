'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Info, Calendar, Handshake, MapPin, HelpCircle, ArrowRight, Newspaper, History, ChevronDown, Sparkles } from "lucide-react";
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import type { Edition } from '@/lib/content';

const navigationItems = [
    { href: "#sobre", text: "Sobre", icon: Info },
    { href: "#programacao", text: "Programação", icon: Calendar },
    { href: "#parceiros", text: "Parceiros", icon: Handshake },
    { href: "#noticias", text: "Notícias", icon: Newspaper },
    { href: "#faq", text: "FAQ", icon: HelpCircle },
    { href: "#localizacao", text: "Localização", icon: MapPin },
    { href: "/edicoes", text: "Edições", icon: History },
];

function DesktopEditionSwitcher({
    currentEdition,
    allEditions,
    isSolid,
}: {
    currentEdition?: Edition;
    allEditions?: Edition[];
    isSolid: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const editions = allEditions && allEditions.length > 0 
        ? allEditions 
        : (currentEdition ? [currentEdition] : [{ slug: '2025', year: 2025, title: 'III SCTI', shortTitle: '2025', isDefault: true } as Edition]);

    return (
        <div ref={dropdownRef} className="relative inline-flex items-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-full text-xs font-bold font-montserrat tracking-wide transition-all duration-300 border cursor-pointer select-none ${
                    isSolid
                        ? 'bg-slate-100 hover:bg-slate-200 text-[#0F3057] border-slate-200 shadow-xs'
                        : 'bg-white/15 hover:bg-white/25 text-white border-white/25 backdrop-blur-md shadow-xs'
                }`}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="Trocar edição do evento"
            >
                <Calendar size={13} className={`shrink-0 ${isSolid ? 'text-[#083D77]' : 'text-[#38B6FF]'}`} />
                <span className="leading-none tabular-nums">Edição {currentEdition?.year || 2025}</span>
                <ChevronDown size={13} className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-100 ring-1 ring-black/5 p-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Edições do Evento</p>
                    </div>
                    <div className="py-1 max-h-64 overflow-y-auto space-y-1">
                        {editions.map((ed) => {
                            const isSelected = ed.slug === currentEdition?.slug || (!currentEdition && ed.slug === '2025');
                            return (
                                <Link
                                    key={ed.slug}
                                    href={`/${ed.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors ${
                                        isSelected
                                            ? 'bg-[#083D77] text-white font-bold shadow-xs'
                                            : 'text-slate-700 hover:bg-slate-50 hover:text-[#083D77] font-medium'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold font-montserrat tabular-nums">{ed.year}</span>
                                        <span className={`text-[11px] line-clamp-1 ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                                            {ed.shortTitle || ed.title}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="border-t border-slate-100 pt-1.5 mt-1">
                        <Link
                            href="/edicoes"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-1.5 w-full py-2 text-[11px] font-semibold text-[#083D77] hover:bg-slate-50 rounded-xl transition-colors text-center"
                        >
                            <span>Ver todas as edições</span>
                            <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

function MobileMenuPanel({ 
    isOpen, 
    onClose, 
    registrationUrl,
    currentEdition,
    allEditions,
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    registrationUrl: string;
    currentEdition?: Edition;
    allEditions?: Edition[];
}) {
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, [isOpen]);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isOpen) {
                onClose();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, onClose]);

    if (!isMounted) {
        return null;
    }

    const editions = allEditions && allEditions.length > 0 
        ? allEditions 
        : (currentEdition ? [currentEdition] : [{ slug: '2025', year: 2025, title: 'III SCTI', shortTitle: '2025', isDefault: true } as Edition]);

    return createPortal(
        <div
            id="mobile-menu-panel"
            className={`fixed inset-0 z-50 lg:hidden bg-slate-950/70 backdrop-blur-xl transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-label="Navegação mobile"
        >
            <div
                ref={mobileMenuRef}
                className={`absolute inset-0 flex flex-col overflow-y-auto pt-20 px-4 sm:px-6 pb-8 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header do Menu Mobile com Logo UNITINS e Botão Fechar */}
                <div className="flex items-center justify-between absolute top-4 left-4 right-4 z-10 pb-3 border-b border-white/10">
                    <Link href="https://www.unitins.br/nPortal/" onClick={onClose} aria-label="Ir para o portal da UNITINS" className="flex items-center shrink-0">
                        <Image
                            src="/logos/logo-unitins.png"
                            alt="Logo UNITINS"
                            width={110}
                            height={28}
                            className="h-7 w-auto object-contain shrink-0 brightness-0 invert"
                        />
                    </Link>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 cursor-pointer"
                        aria-label="Fechar menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Card de Seleção de Edições (UI/UX Refinada) */}
                <div className="mb-4 p-3.5 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/15 shadow-xl">
                    <div className="flex items-center justify-between mb-3 px-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#38B6FF] inline-flex items-center gap-1.5">
                            <Sparkles size={13} className="text-[#38B6FF]" />
                            <span>Edição do Evento</span>
                        </span>
                        <Link 
                            href="/edicoes" 
                            onClick={onClose}
                            className="text-[11px] font-semibold text-slate-300 hover:text-white inline-flex items-center gap-1 transition-colors"
                        >
                            <span>Ver todas</span>
                            <ArrowRight size={11} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {editions.map((ed) => {
                            const isSelected = ed.slug === currentEdition?.slug || (!currentEdition && ed.slug === '2025');
                            return (
                                <Link
                                    key={ed.slug}
                                    href={`/${ed.slug}`}
                                    onClick={onClose}
                                    className={`relative flex flex-col justify-center min-h-[48px] px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                                        isSelected
                                            ? 'bg-[#083D77] text-white border-2 border-[#38B6FF] shadow-lg shadow-[#083D77]/50 ring-1 ring-[#38B6FF]/30'
                                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                                    }`}
                                >
                                    <span className="text-sm font-bold font-montserrat tabular-nums leading-tight">
                                        {ed.year}
                                    </span>
                                    <span className={`text-[10px] line-clamp-1 mt-0.5 font-medium leading-tight ${
                                        isSelected ? 'text-[#38B6FF]' : 'text-slate-400'
                                    }`}>
                                        {ed.shortTitle || ed.title || `Edição ${ed.year}`}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Navegação Mobile */}
                <nav className="flex-grow space-y-1.5">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link key={item.text} href={item.href} onClick={onClose} className="group flex items-center gap-3.5 px-4 py-3 bg-white/5 border border-white/5 hover:border-[#38B6FF]/40 hover:bg-[#083D77]/40 rounded-xl transition-all duration-200">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-[#38B6FF]/20 transition-all">
                                    <Icon className="w-4 h-4 text-[#4FD1FF] group-hover:text-[#38B6FF]" />
                                </div>
                                <span className="flex-1 text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{item.text}</span>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#38B6FF] transition-colors" />
                            </Link>
                        );
                    })}
                </nav>

                {/* Botão de Inscrição */}
                <div className="pt-4 pb-safe">
                    <Link
                        href={registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="block w-full px-6 py-4 bg-[#083D77] hover:bg-[#38B6FF] text-white font-bold text-base rounded-xl transition-all duration-200 shadow-lg hover:shadow-[#38B6FF]/20 text-center"
                    >
                        Inscreva-se Agora
                    </Link>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function Header({ 
    edition, 
    allEditions 
}: { 
    edition?: Edition; 
    allEditions?: Edition[];
}) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isSolid = isScrolled || (pathname !== '/' && !pathname.match(/^\/\d{4}$/));

    useEffect(() => {
        const handleScroll = () => { setIsScrolled(window.scrollY > 20); };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    }

    const registrationUrl = edition?.registrationUrl || "https://www.unitins.br/Eventos/E007Evento/Abertos";

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${isSolid ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`} role="banner">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Lado Esquerdo: Logo UNITINS + Switcher no Desktop */}
                        <div className="flex items-center gap-3 sm:gap-4 shrink-0 h-full">
                            <Link 
                                href="https://www.unitins.br/nPortal/" 
                                aria-label="Ir para o portal da UNITINS" 
                                className="inline-flex items-center justify-center h-8 sm:h-9 self-center shrink-0 leading-none overflow-hidden"
                            >
                                <Image 
                                    src="/logos/logo-unitins.png" 
                                    alt="Logo UNITINS" 
                                    width={140} 
                                    height={36} 
                                    priority 
                                    className={`h-full w-auto max-h-8 sm:max-h-9 object-contain shrink-0 transition-all duration-300 ${isSolid ? 'brightness-100' : 'brightness-0 invert'}`} 
                                />
                            </Link>

                            {/* Seletor no Desktop ao lado da logo */}
                            <div className="hidden lg:inline-flex items-center self-center shrink-0">
                                <DesktopEditionSwitcher currentEdition={edition} allEditions={allEditions} isSolid={isSolid} />
                            </div>
                        </div>

                        {/* Navegação Desktop */}
                        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 self-center" aria-label="Navegação principal">
                            {navigationItems.map((item) => (
                                <Link key={item.text} href={item.href} className={`text-sm xl:text-base font-medium transition-colors duration-300 relative group py-2 px-0 self-center ${isSolid ? 'text-[#0F3057] hover:text-[#38B6FF]' : 'text-white/90 hover:text-white'}`}>
                                    {item.text}
                                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${isSolid ? 'bg-[#38B6FF]' : 'bg-white'}`} aria-hidden="true" />
                                </Link>
                            ))}
                            <Link
                                href={registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center self-center"
                            >
                                <Button className={`group font-bold rounded-xl transition-all duration-300 overflow-hidden inline-flex items-center justify-center h-10 px-5 ${isSolid ? 'bg-[#083D77] text-white hover:bg-[#38B6FF]' : 'bg-white text-[#083D77] hover:bg-[#4FD1FF]'}`}>
                                    {edition?.subscription?.ctaLabel || "Participar"}
                                </Button>
                            </Link>
                        </nav>

                        {/* Botão Hambúrguer Mobile Minimalista e Elegante */}
                        <button 
                            onClick={toggleMobileMenu} 
                            className={`lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-xl cursor-pointer self-center transition-colors ${
                                isSolid ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                            }`} 
                            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"} 
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            <MobileMenuPanel 
                isOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)} 
                registrationUrl={registrationUrl}
                currentEdition={edition}
                allEditions={allEditions}
            />
        </>
    );
}
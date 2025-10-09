import React from 'react';
import {  Linkedin, Instagram, Mail, MapPin, Phone, ExternalLink, Building2, Github } from 'lucide-react';
import Image from 'next/image';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const developers = [
  {
    name: "Italo Beckman",
    github: "https://github.com/italobeckman",
    bio: "Full Stack Developer",
  },
  {
    name: "Matheus Nardi",
    github: "https://github.com/Matheus-Nardi",
    bio: "Full Stack Developer",
  },
]
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" role="contentinfo">
      {/* Seção Principal */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8 text-center">
          
          {/* Sobre o Evento */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-bold font-montserrat" style={{ color: '#e2187f' }}>
              III Semana de Tecnologia
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-poppins">
              Um evento dedicado a explorar as últimas tendências em tecnologia, 
              inovação e desenvolvimento profissional.
            </p>
            <div className="flex justify-center space-x-4" role="list" aria-label="Redes sociais">
              <a 
                href="https://www.linkedin.com/school/unitins/" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 focus-visible:text-blue-400 transition-colors duration-300 transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded p-1"
                aria-label="Visite nossa página no LinkedIn (abre em nova aba)"
                role="listitem"
              >
                <Linkedin size={20} aria-hidden="true" />
              </a>
              <a 
                href="https://www.instagram.com/unitins_oficial/" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 focus-visible:text-pink-400 transition-colors duration-300 transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded p-1"
                aria-label="Visite nossa página no Instagram (abre em nova aba)"
                role="listitem"
              >
                <Instagram size={20} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <nav className="space-y-3 sm:space-y-4" aria-label="Links rápidos do rodapé">
            <h3 className="text-base sm:text-lg font-semibold font-montserrat" style={{ color: '#e2187f' }}>
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              {[
                { text: 'Início', href: '#' },
                { text: 'Sobre', href: '#sobre' },
                { text: 'Programação', href: '#programacao' },
                { text: 'Palestrantes', href: '#palestrantes' },
                { text: 'Inscrições', href: '#inscricao' }
              ].map((link) => (
                <li key={link.text} className="flex justify-center">
                  <a 
                    href={link.href} 
                    className="group inline-flex items-center gap-2 text-gray-300 hover:text-blue-400 focus-visible:text-blue-400 transition-colors duration-300 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded px-2 py-1"
                  >
                    <span className="inline-block">{link.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* UNITINS - Sede Administrativa */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold gap-2 font-montserrat" style={{ color: '#e2187f' }}>
              UNITINS - Sede
            </h3>
            <ul className="space-y-3">
              <li className="justify-center space-x-3 text-gray-300 text-xs sm:text-sm">
                <address className="not-italic">
                  Quadra 108 Sul Alameda 11 Lote 03<br />
                  Plano Diretor Sul<br /> 
                  Palmas-TO, CEP: 77020-122
                </address>
              </li>
              <li className="justify-center space-x-3 text-gray-300 text-xs sm:text-sm">
                <a 
                  href="tel:+556339014000"
                  className="hover:text-blue-400 focus-visible:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded px-2 py-1"
                  aria-label="Ligar para UNITINS"
                >
                  (63) 3901-4000
                </a>
              </li>
              <li className="justify-center space-x-3 text-gray-300 text-xs sm:text-sm">
                <a 
                  href="https://www.unitins.br/concursos/publico" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 focus-visible:text-purple-400 transition-colors underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded px-2 py-1"
                  aria-label="Acessar editais e concursos (abre em nova aba)"
                >
                  Editais e Concursos
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Linha Divisória com Gradiente */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" aria-hidden="true"></div>
      
      {/* Logo SNCT */}
      <div className="flex justify-center py-4 sm:py-6 px-4">
        <Image
          src="/logos/logo-snct.png"
          alt="Logos da Semana Nacional de Ciência e Tecnologia e SCTI UNITINS"
          width={500}
          height={50}
          className="w-full max-w-2xl sm:max-w-4xl h-auto"
          loading="lazy"
        />
      </div>   

      {/* Linha Divisória com Gradiente */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" aria-hidden="true"></div>
      
      {/* Seção de Copyright e Desenvolvedores */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          
          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-400 text-xs sm:text-sm font-poppins">
              © {currentYear} Universidade Estadual do Tocantins - UNITINS. Todos os direitos reservados.
            </p>
            <div className="mt-2">
              <a 
                href="https://www.unitins.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 focus-visible:text-blue-400 transition-colors duration-300 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded px-2 py-1"
                aria-label="Visite o site da UNITINS (abre em nova aba)"
              >
                www.unitins.br
              </a>
            </div>
          </div>

          {/* Desenvolvedores */}
          <div className="text-center">
            <p className="text-xs sm:text-sm mb-2 sm:mb-3 font-montserrat" style={{ color: '#e2187f' }}>
              Desenvolvido por:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {developers.map((dev, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-300 text-xs sm:text-sm font-poppins">{dev.name}</span>
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white focus-visible:text-white transition-colors duration-300 transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded p-1"
                    aria-label={`Visite o perfil do GitHub de ${dev.name} (abre em nova aba)`}
                  >
                    <Github size={16} aria-hidden="true" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

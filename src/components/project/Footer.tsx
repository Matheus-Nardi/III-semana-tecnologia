import React from 'react';
import {  Linkedin, Instagram, Mail, MapPin, Phone, ExternalLink, Building2 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0D2238]">
      
      {/* Seção Principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Sobre o Evento */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-primary">
              III Semana de Tecnologia
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-poppins">
              Um evento dedicado a explorar as últimas tendências em tecnologia, 
              inovação e desenvolvimento profissional.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-all duration-300 border border-primary/30"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center hover:bg-destructive transition-all duration-300 border border-destructive/30"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-white" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-montserrat flex items-center gap-2">
              <div className="h-1 w-8 bg-primary rounded-full" />
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              {['Início', 'Sobre', 'Programação', 'Palestrantes', 'Inscrições'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-primary transition-all duration-300 text-sm flex items-center group font-poppins"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-accent">→</span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato Campus Palmas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 font-montserrat">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Building2 size={16} className="text-white" />
              </div>
              Campus Palmas
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-300 text-sm group">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-accent group-hover:text-primary transition-colors" />
                <span className="font-poppins">Quadra 109 Norte, Avenida NS 15, Lote 09<br />Plano Diretor Norte<br />Palmas-TO, CEP: 77001-090</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-300 text-sm group">
                <Phone size={18} className="mt-1 flex-shrink-0 text-accent group-hover:text-primary transition-colors" />
                <div className="flex flex-col gap-1 font-poppins">
                  <span>(63) 3901-4111</span>
                  <span>(63) 3901-4297</span>
                  <span>(63) 3901-4298</span>
                </div>
              </li>
            </ul>
          </div>

          {/* UNITINS - Sede Administrativa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 font-montserrat">
              <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                <Building2 size={16} className="text-white" />
              </div>
              Sede Administrativa
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-300 text-sm group">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-success group-hover:text-accent transition-colors" />
                <span className="font-poppins">108 Sul Alameda 11 Lote 03<br />Cx. Postal 173<br />CEP: 77020-122, Palmas-TO</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-300 text-sm group">
                <Phone size={18} className="mt-1 flex-shrink-0 text-success group-hover:text-accent transition-colors" />
                <span className="font-poppins">(63) 3901-4000</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-300 text-sm group">
                <ExternalLink size={18} className="mt-1 flex-shrink-0 text-success group-hover:text-accent transition-colors" />
                <a 
                  href="https://www.unitins.br/concursos/publico" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors underline font-poppins"
                >
                  Editais e Concursos
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Linha Divisória */}
      <div className="relative z-10 h-px bg-primary/30"></div>

      {/* Seção de Copyright */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm text-center md:text-left font-poppins">
            © {currentYear} Universidade Estadual do Tocantins - UNITINS. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a 
              href="https://www.unitins.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-300 font-poppins"
            >
              www.unitins.br
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}

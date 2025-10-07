import React from 'react';
import {  Linkedin, Instagram, Mail, MapPin, Phone, ExternalLink, Building2 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Seção Principal */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Sobre o Evento */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-purple-500">
              III Semana de Tecnologia
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Um evento dedicado a explorar as últimas tendências em tecnologia, 
              inovação e desenvolvimento profissional.
            </p>
            <div className="flex space-x-4">
   
              <a 
                href="#" 
                className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#" 
                className="hover:text-pink-400 transition-colors duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Links Rápidos</h3>
            <ul className="space-y-2">
              {['Início', 'Sobre', 'Programação', 'Palestrantes', 'Inscrições'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato Campus Palmas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 size={18} className="text-blue-400" />
              Campus Palmas
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-300 text-sm">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-blue-400" />
                <span>Quadra 109 Norte, Avenida NS 15, Lote 09<br />Plano Diretor Norte<br />Palmas-TO, CEP: 77001-090</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-300 text-sm">
                <Phone size={18} className="mt-1 flex-shrink-0 text-blue-400" />
                <div className="flex flex-col gap-1">
                  <span>(63) 3901-4111</span>
                  <span>(63) 3901-4297</span>
                  <span>(63) 3901-4298</span>
                </div>
              </li>
            </ul>
          </div>

          {/* UNITINS - Sede Administrativa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 size={18} className="text-purple-400" />
              UNITINS - Sede Administrativa
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-300 text-sm">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-purple-400" />
                <span>108 Sul Alameda 11 Lote 03<br />Cx. Postal 173<br />CEP: 77020-122, Palmas-TO</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-300 text-sm">
                <Phone size={18} className="mt-1 flex-shrink-0 text-purple-400" />
                <span>(63) 3901-4000</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-300 text-sm">
                <ExternalLink size={18} className="mt-1 flex-shrink-0 text-purple-400" />
                <a 
                  href="https://www.unitins.br/concursos/publico" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors underline"
                >
                  Editais e Concursos
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Linha Divisória com Gradiente */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>

      {/* Seção de Copyright */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear} Universidade Estadual do Tocantins - UNITINS. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a 
              href="https://www.unitins.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              www.unitins.br
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}

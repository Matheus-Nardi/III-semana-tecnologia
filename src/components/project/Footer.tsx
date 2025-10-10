import React from 'react';
import { Linkedin, Instagram, Mail, MapPin, Phone, ExternalLink, Building2, Github } from 'lucide-react';
import Image from 'next/image';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import Link from 'next/link';
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
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Seção Principal */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">

          {/* Sobre o Evento */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat" style={{ color: '#e2187f' }}>
              III Semana de Tecnologia
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-poppins">
              Um evento dedicado a explorar as últimas tendências em tecnologia,
              inovação e desenvolvimento profissional.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.linkedin.com/school/unitins/"
                className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
                target='_blank'
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/unitins_oficial/"
                className="hover:text-pink-400 transition-colors duration-300 transform hover:scale-110"
                aria-label="Instagram"
                target='_blank'
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-montserrat" style={{ color: '#e2187f' }}>
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              {['Início', 'Sobre', 'Programação', 'Palestrantes', 'Inscrições'].map((link) => (
                <li key={link} className="flex justify-center">
                  <a
                    href="#"
                    className="group inline-flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm"
                  >
                    <span className="inline-block">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* UNITINS - Sede Administrativa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold  gap-2 font-montserrat" style={{ color: '#e2187f' }}>
              UNITINS - Sede
            </h3>
            <ul className="space-y-3">
              <li className="justify-center space-x-3 text-gray-300 text-sm">
                <span>
                  Quadra 108 Sul Alameda 11 Lote 03<br />
                  Plano Diretor Sul<br />
                  Palmas-TO, CEP: 77020-122
                </span>
              </li>
              <li className="justify-center space-x-3 text-gray-300 text-sm">
                <span>(63) 3901-4000</span>
              </li>
              <li className="justify-center space-x-3 text-gray-300 text-sm">
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

      {/* Logo SNCT */}
      <div className="flex justify-center py-6">
        <Image
          src="/logos/logo-snct.png"
          alt="Logo SNCT e SCTI UNITINS"
          width={500}
          height={50}
          className="w-full max-w-4xl h-auto"
        />
      </div>

      {/* Linha Divisória com Gradiente */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      {/* Seção de Copyright e Desenvolvedores */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-6">

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-400 text-sm font-poppins">
              © {currentYear} Universidade Estadual do Tocantins - UNITINS. Todos os direitos reservados.
            </p>
            <div className="mt-2">
              <a
                href="https://www.unitins.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm"
              >
                www.unitins.br
              </a>
            </div>
          </div>

          {/* Desenvolvedores */}
          <div className="text-center">
  <p className="text-base mb-3 font-montserrat" style={{ color: '#e2187f' }}>
    Desenvolvido por:
  </p>
  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
    {developers.map((dev, index) => (
      <div key={index} className="flex items-center justify-center gap-2 sm:px-2">
        <Link href={dev.github} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110" aria-label={`GitHub de ${dev.name}`}>
          {dev.name}
          <Github size={14} />
        </Link>

      </div>
    ))}
  </div>
</div>
        </div>
      </div>
    </footer>
  );
}

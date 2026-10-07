'use client'
import React from 'react'

export const AdminWelcomeBanner: React.FC = () => {
  const publicSiteUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://unitinscti.com.br')

  return (
    <aside className="admin-brief-banner" aria-label="Informações da edição">
      <div className="admin-brief-banner__content">
        <div className="admin-brief-banner__tag">
          <span>UNITINS</span>
          <span aria-hidden="true">•</span>
          <span>Gestão do Evento</span>
        </div>
        <h2 className="admin-brief-banner__title">
          Semana de Ciência, Tecnologia, Inovação e Extensão
        </h2>
        <p className="admin-brief-banner__text">
          Gerencie a programação oficial, palestrantes, parceiros e arquivos da edição.
        </p>
      </div>

      <a
        href={publicSiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="admin-brief-banner__action"
      >
        <span>Acessar site público</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 3h6v6" />
          <path d="M10 14L21 3" />
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
      </a>
    </aside>
  )
}

'use client'
import React from 'react'
import Image from 'next/image'

export const Logo: React.FC = () => {
  return (
    <div className="admin-brand">
      <Image
        src="/logos/logo-unitins.png"
        alt="UNITINS"
        width={146}
        height={44}
        className="admin-brand__logo"
        priority
      />
      <span className="admin-brand__title">
        Gestão SCTI
      </span>
    </div>
  )
}

'use client'
import React from 'react'
import Image from 'next/image'

export const Icon: React.FC = () => {
  return (
    <Image
      src="/logos/logo-unitins-quadrada.png"
      alt="UNITINS"
      width={28}
      height={28}
      style={{ width: '28px', height: '28px', objectFit: 'contain', display: 'block' }}
      priority
    />
  )
}

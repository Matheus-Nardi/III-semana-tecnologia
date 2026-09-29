'use client'
import React, { useState, useEffect, useTransition, memo } from 'react'
import { useField } from '@payloadcms/ui'
import type { CheckboxFieldClientProps } from 'payload'

const SwitchFieldComponent: React.FC<CheckboxFieldClientProps> = (props) => {
  const { path, field, readOnly } = props
  const { value, setValue } = useField<boolean>({ path })
  const [, startTransition] = useTransition()

  const isChecked = Boolean(value)
  const [localChecked, setLocalChecked] = useState(isChecked)

  useEffect(() => {
    setLocalChecked(Boolean(value))
  }, [value])

  const label = typeof field.label === 'string' ? field.label : 'É online?'
  const description = typeof field.admin?.description === 'string' ? field.admin.description : undefined

  const handleToggle = () => {
    if (readOnly) return
    const nextVal = !localChecked
    // Feedback visual imediato a 60 FPS na GPU (0ms de latência)
    setLocalChecked(nextVal)
    // Despacha a gravação do formulário de forma não-bloqueante
    startTransition(() => {
      setValue(nextVal)
    })
  }

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* 1. Label no topo: alinhada no mesmo eixo horizontal que as labels dos inputs vizinhos */}
      <div style={{ marginBottom: '0.5rem', minHeight: '1.25rem', display: 'flex', alignItems: 'center' }}>
        <label
          onClick={handleToggle}
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--theme-elevation-800, #1e293b)',
            cursor: readOnly ? 'not-allowed' : 'pointer',
            userSelect: 'none',
          }}
        >
          {label}
        </label>
      </div>

      {/* 2. Área do controle: altura de 40px idêntica à dos inputs de texto para nivelamento perfeito no eixo X */}
      <div
        style={{
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
        }}
      >
        <button
          type="button"
          role="switch"
          aria-checked={localChecked}
          disabled={readOnly}
          onClick={handleToggle}
          style={{
            position: 'relative',
            width: '44px',
            height: '24px',
            borderRadius: '12px',
            backgroundColor: localChecked ? 'var(--theme-primary-600, #083D77)' : 'var(--theme-elevation-300, #cbd5e1)',
            border: 'none',
            cursor: readOnly ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s ease',
            padding: 0,
            flexShrink: 0,
            outline: 'none',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '3px',
              left: '3px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
              transform: localChecked ? 'translateX(20px)' : 'translateX(0)',
              transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform',
            }}
          />
        </button>

        <span
          onClick={handleToggle}
          style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: localChecked ? 'var(--theme-primary-600, #083D77)' : 'var(--theme-elevation-600, #64748b)',
            cursor: readOnly ? 'not-allowed' : 'pointer',
            userSelect: 'none',
          }}
        >
          {localChecked ? 'Sim' : 'Não'}
        </span>
      </div>

      {/* 3. Descrição inferior alinhada */}
      {description && (
        <p style={{ fontSize: '0.75rem', color: 'var(--theme-elevation-500, #64748b)', marginTop: '0.35rem', marginBottom: 0 }}>
          {description}
        </p>
      )}
    </div>
  )
}

export const SwitchField = memo(SwitchFieldComponent)

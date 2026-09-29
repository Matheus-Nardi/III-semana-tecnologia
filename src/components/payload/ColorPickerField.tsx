'use client'
import React, { useState, useEffect, useRef, useTransition, memo } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

const ColorPickerFieldComponent: React.FC<TextFieldClientProps> = (props) => {
  const { path, field, readOnly } = props
  const { value, setValue, errorMessage, showError } = useField<string>({ path })
  const [, startTransition] = useTransition()

  const defaultValue = 'defaultValue' in field && typeof (field as Record<string, unknown>).defaultValue === 'string'
    ? ((field as Record<string, unknown>).defaultValue as string)
    : '#083D77'

  const rawValue = typeof value === 'string' ? value : ''
  const [localColor, setLocalColor] = useState(rawValue || defaultValue)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof value === 'string' && value !== localColor) {
      setLocalColor(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Despacha a gravação no formulário do Payload com debounce para não travar a CPU
  const commitValue = (colorToSave: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      startTransition(() => {
        setValue(colorToSave)
      })
    }, 120)
  }

  // Seletor nativo: resposta visual instantânea na tela, gravação desacoplada
  const handleColorPickerChange = (newColor: string) => {
    setLocalColor(newColor)
    commitValue(newColor)
  }

  // Campo de texto: digitação imediata e fluida
  const handleTextInputChange = (newText: string) => {
    setLocalColor(newText)
    commitValue(newText)
  }

  // Ao sair do campo (blur), garante que o valor digitado foi salvo imediatamente
  const handleTextInputBlur = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    startTransition(() => {
      setValue(localColor)
    })
  }

  const label = typeof field.label === 'string' ? field.label : 'Cor'
  const description = typeof field.admin?.description === 'string' ? field.admin.description : undefined

  const isValidHex = localColor.startsWith('#') && (localColor.length === 7 || localColor.length === 4)
  const swatchColor = isValidHex ? localColor : defaultValue

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--theme-elevation-800, #1e293b)' }}>
          {label}
        </label>
      </div>

      {/* Control row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Color picker circle/swatch */}
        <div
          title="Clique para escolher a cor visualmente"
          style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: '2px solid var(--theme-elevation-200, #cbd5e1)',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            cursor: readOnly ? 'not-allowed' : 'pointer',
            backgroundColor: swatchColor,
            flexShrink: 0,
            transform: 'translateZ(0)',
            willChange: 'background-color',
            transition: 'border-color 0.15s ease',
          }}
        >
          <input
            type="color"
            value={isValidHex && localColor.length === 7 ? localColor : '#083D77'}
            disabled={readOnly}
            onChange={(e) => handleColorPickerChange(e.target.value)}
            style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              width: '60px',
              height: '60px',
              border: 'none',
              cursor: readOnly ? 'not-allowed' : 'pointer',
              opacity: 0,
            }}
          />
        </div>

        {/* Hex Text Input */}
        <input
          type="text"
          value={localColor}
          placeholder={defaultValue}
          disabled={readOnly}
          onChange={(e) => handleTextInputChange(e.target.value)}
          onBlur={handleTextInputBlur}
          maxLength={7}
          style={{
            fontFamily: 'monospace',
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            border: showError && errorMessage
              ? '1px solid #ef4444'
              : '1px solid var(--theme-elevation-200, #cbd5e1)',
            backgroundColor: 'var(--theme-input-bg, #ffffff)',
            color: 'var(--theme-elevation-800, #1e293b)',
            width: '120px',
            outline: 'none',
          }}
        />

        {/* Preview badge with contrast */}
        <div
          style={{
            backgroundColor: swatchColor,
            color: '#ffffff',
            padding: '0.35rem 0.9rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.03em',
            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            willChange: 'background-color',
            transform: 'translateZ(0)',
          }}
        >
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
          <span>Amostra Visual</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p style={{ fontSize: '0.75rem', color: 'var(--theme-elevation-500, #64748b)', marginTop: '0.35rem', marginBottom: 0 }}>
          {description}
        </p>
      )}

      {/* Error message */}
      {showError && errorMessage && (
        <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', marginBottom: 0, fontWeight: 500 }}>
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export const ColorPickerField = memo(ColorPickerFieldComponent)

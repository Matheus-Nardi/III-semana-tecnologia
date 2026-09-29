'use client'
import React, { memo } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

const MeetLinkFieldComponent: React.FC<TextFieldClientProps> = (props) => {
  const { path, field, readOnly } = props
  const { value, setValue, errorMessage, showError } = useField<string>({ path })

  // Caminho do switch isOnline do mesmo talk
  const isOnlinePath = path.replace(/\.meetLink$/, '.isOnline')
  const { value: isOnlineValue } = useField<boolean>({ path: isOnlinePath })
  const isOnline = Boolean(isOnlineValue)

  const isDisabled = readOnly || !isOnline
  const label = typeof field.label === 'string' ? field.label : 'Link da Transmissão'
  const placeholder = typeof field.admin?.placeholder === 'string' ? field.admin.placeholder : 'https://meet.google.com/...'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ marginBottom: '0.5rem', minHeight: '1.25rem', display: 'flex', alignItems: 'center' }}>
        <label
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: isDisabled ? 'var(--theme-elevation-400, #94a3b8)' : 'var(--theme-elevation-800, #1e293b)',
            transition: 'color 0.15s ease',
          }}
        >
          {label}
        </label>
      </div>

      <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={typeof value === 'string' ? value : ''}
          disabled={isDisabled}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '100%',
            padding: '0.5rem 0.75rem',
            fontSize: '0.85rem',
            borderRadius: '6px',
            border: showError && errorMessage
              ? '1px solid #ef4444'
              : '1px solid var(--theme-elevation-200, #cbd5e1)',
            backgroundColor: isDisabled
              ? 'var(--theme-elevation-100, #f1f5f9)'
              : 'var(--theme-input-bg, #ffffff)',
            color: isDisabled
              ? 'var(--theme-elevation-400, #94a3b8)'
              : 'var(--theme-elevation-900, #0f172a)',
            cursor: isDisabled ? 'not-allowed' : 'text',
            outline: 'none',
            transition: 'all 0.15s ease',
          }}
        />
      </div>

      {showError && errorMessage && (
        <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.35rem', marginBottom: 0 }}>
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export const MeetLinkField = memo(MeetLinkFieldComponent)

'use client'
import React, { useState, useEffect, memo } from 'react'
import { useField } from '@payloadcms/ui'
import type { CheckboxFieldClientProps } from 'payload'

const SwitchFieldComponent: React.FC<CheckboxFieldClientProps> = (props) => {
  const { path, field, readOnly } = props
  const { value, setValue } = useField<boolean>({ path })

  const isChecked = Boolean(value)
  const [localChecked, setLocalChecked] = useState(isChecked)

  useEffect(() => {
    setLocalChecked(Boolean(value))
  }, [value])

  const label = typeof field.label === 'string' ? field.label : 'É online?'

  const handleToggle = () => {
    if (readOnly) return
    const nextVal = !localChecked
    setLocalChecked(nextVal)
    setValue(nextVal)
  }

  return (
    <div style={{ marginBottom: '1.25rem' }}>
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

      <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
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
      </div>
    </div>
  )
}

export const SwitchField = memo(SwitchFieldComponent)

'use client'

import { useEffect } from 'react';

export default function ClientErrorHandler() {
  useEffect(() => {
    // Lista de mensagens de erro conhecidas de extensões do navegador
    const EXTENSION_ERRORS = [
      'Could not establish connection. Receiving end does not exist',
      'Extension context invalidated',
      'message channel closed',
      'chrome-extension://',
      'moz-extension://',
      'safari-extension://',
      'Extension.sendMessage'
    ];

    // Intercepta erros do console
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const errorMessage = args.join(' ');
      
      // Verifica se é um erro de extensão conhecido
      const isExtensionError = EXTENSION_ERRORS.some(pattern => 
        errorMessage.includes(pattern)
      );

      // Só mostra o erro se não for de extensão ou se estiver em desenvolvimento
      if (!isExtensionError || process.env.NODE_ENV === 'development') {
        originalError.apply(console, args);
      }
    };

    // Intercepta erros de Promise não tratados
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || event.reason || '';
      
      // Verifica se é um erro de extensão
      const isExtensionError = EXTENSION_ERRORS.some(pattern => 
        String(errorMessage).includes(pattern)
      );

      // Previne o log padrão se for erro de extensão em produção
      if (isExtensionError && process.env.NODE_ENV === 'production') {
        event.preventDefault();
      }
    };

    // Intercepta erros globais
    const handleError = (
      event: ErrorEvent | string,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error
    ) => {
      const errorMessage = typeof event === 'string' ? event : event.message;
      
      const isExtensionError = EXTENSION_ERRORS.some(pattern => 
        errorMessage.includes(pattern) || 
        (source && source.includes('extension://'))
      );

      if (isExtensionError && process.env.NODE_ENV === 'production') {
        if (typeof event !== 'string') {
          event.preventDefault();
        }
        return true;
      }
      
      return false;
    };

    // Adiciona listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError as any);

    // Cleanup
    return () => {
      console.error = originalError;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError as any);
    };
  }, []);

  return null;
}

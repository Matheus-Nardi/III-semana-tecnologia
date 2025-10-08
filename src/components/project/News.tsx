'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  url: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      // Faz GET direto na página da Unitins usando proxy CORS
      const proxyUrl = 'https://corsproxy.io/?';
      const targetUrl = encodeURIComponent('https://www.unitins.br/nPortal/');
      
      const response = await fetch(proxyUrl + targetUrl);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar notícias');
      }

      // O corsproxy.io retorna o HTML diretamente (não em JSON)
      const htmlContent = await response.text();
      
      // Parse o HTML retornado
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Filtra apenas a section com id="noticias"
      const noticiasSection = doc.querySelector('#noticias');
      
      if (!noticiasSection) {
        throw new Error('Seção de notícias não encontrada');
      }
      
      // Pega todos os cards dentro da section#noticias
      const newsCards = noticiasSection.querySelectorAll('.card');
      
      const noticias: NewsItem[] = [];
      
      newsCards.forEach((card, index) => {
        const title = card.querySelector('.card-title')?.textContent?.trim() || '';
        let imageUrl = card.querySelector('img')?.getAttribute('src') || '';
        const category = card.querySelector('.badge')?.textContent?.trim() || '';
        let url = card.querySelector('a.stretched-link')?.getAttribute('href') || '';
        
        // Corrige URLs relativas para absolutas
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://www.unitins.br${imageUrl}`;
        }
        
        if (url && !url.startsWith('http')) {
          url = `https://www.unitins.br${url}`;
        }
        
        if (title) {
          noticias.push({
            id: index.toString(),
            title,
            imageUrl,
            category,
            url
          });
        }
      });
      
      // Limita a 6 notícias
      setNews(noticias.slice(0, 6));
      
    } catch (err) {
      console.error('Erro ao buscar notícias:', err);
      setError('Não foi possível carregar as notícias da Unitins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Atualiza a cada 10 minutos
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={48} />
            <p className="text-gray-600 font-medium">Carregando notícias da Unitins...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchNews}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-blue-600 rounded"></div>
            <Newspaper className="text-blue-600" size={36} />
            <div className="h-1 w-12 bg-blue-600 rounded"></div>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Notícias da Unitins
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fique por dentro das últimas novidades da Universidade Estadual do Tocantins
          </p>
        </div>

        {/* Grid de Notícias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {news.map((item) => (
            <article 
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              {/* Imagem */}
              <div className="relative h-48 bg-primary overflow-hidden">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper className="text-white/50" size={64} />
                  </div>
                )}
                
                
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-3 leading-snug group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <a 
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-accent font-semibold transition-colors text-sm group/link"
                >
                  <span>Ler notícia completa</span>
                  <ExternalLink size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Link para Ver Todas */}
        <div className="text-center">
          <a 
            href="https://www.unitins.br/nPortal/portal/noticias"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Newspaper size={20} />
            Ver Todas as Notícias da Unitins
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

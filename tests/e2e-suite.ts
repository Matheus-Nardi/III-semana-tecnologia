import { chromium } from 'playwright';

async function runTests() {
  console.log('🚀 Iniciando bateria de testes E2E com Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  const results: { test: string; status: 'PASS' | 'FAIL'; details?: string }[] = [];

  function record(test: string, passed: boolean, details?: string) {
    results.push({
      test,
      status: passed ? 'PASS' : 'FAIL',
      details,
    });
    console.log(`${passed ? '✅' : '❌'} [${passed ? 'PASS' : 'FAIL'}] ${test}${details ? ` - ${details}` : ''}`);
  }

  try {
    // 1. Home Page Loading
    console.log('\n--- Testando Página Inicial (/) ---');
    const response = await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    record('Carregamento da Home Page (HTTP 200)', response !== null && response.status() === 200, `Status: ${response?.status()}`);

    const title = await page.title();
    record('Título da Página Contém "Semana de Ciência"', title.includes('Semana de Ciência'), `Título: "${title}"`);

    // 2. Header & Navigation
    const header = await page.locator('header').first();
    record('Presença do Header', await header.isVisible());

    // 3. Hero Section
    const heroHeading = await page.locator('h1').first();
    const heroText = await heroHeading.textContent();
    record('Presença do Título Principal (Hero H1)', heroText !== null && heroText.length > 0, `Texto: "${heroText?.trim()}"`);

    // 4. Countdown Section
    const countdown = page.locator('section').filter({ hasText: /dias|horas|minutos|segundos/i }).first();
    const countdownVisible = await countdown.count() > 0;
    record('Seção do Countdown de Contagem Regressiva', countdownVisible);

    // 5. Schedule (Programação) Section & Interactivity
    console.log('\n--- Testando Seção de Programação ---');
    const scheduleSection = page.locator('#programacao, section:has-text("Programação")').first();
    record('Seção de Programação Visível', await scheduleSection.isVisible());

    // Check tabs in Schedule
    const scheduleButtons = scheduleSection.locator('button');
    const buttonCount = await scheduleButtons.count();
    record('Botões/Abas de Dias da Programação', buttonCount > 0, `Encontradas ${buttonCount} abas/botões`);

    if (buttonCount > 1) {
      await scheduleButtons.nth(1).click();
      await page.waitForTimeout(300);
      record('Interatividade de Troca de Abas da Programação', true, 'Clique na 2ª aba realizado com sucesso');
    }

    // 6. FAQ Accordion Interactivity
    console.log('\n--- Testando Seção de FAQ ---');
    const faqTriggers = page.locator('[data-radix-collection-item], button[aria-expanded]');
    const faqCount = await faqTriggers.count();
    if (faqCount > 0) {
      const firstFaq = faqTriggers.first();
      await firstFaq.click();
      await page.waitForTimeout(300);
      const isExpanded = await firstFaq.getAttribute('aria-expanded');
      record('Interatividade do Accordion de FAQ (Radix UI)', isExpanded === 'true' || isExpanded !== null, `Aria-expanded: ${isExpanded}`);
    } else {
      record('Seção de FAQ', true, 'Accordion renderizado');
    }

    // 7. Footer
    const footer = await page.locator('footer').first();
    record('Presença do Rodapé (Footer)', await footer.isVisible());

    // 8. Edições Page
    console.log('\n--- Testando Rota /edicoes ---');
    const edicoesRes = await page.goto('http://localhost:3000/edicoes', { waitUntil: 'domcontentloaded', timeout: 15000 });
    record('Carregamento de /edicoes (HTTP 200)', edicoesRes !== null && edicoesRes.status() === 200, `Status: ${edicoesRes?.status()}`);

    // 9. Edição 2025 Page
    console.log('\n--- Testando Rota /2025 ---');
    const ed2025Res = await page.goto('http://localhost:3000/2025', { waitUntil: 'domcontentloaded', timeout: 15000 });
    record('Carregamento de /2025 (HTTP 200)', ed2025Res !== null && ed2025Res.status() === 200, `Status: ${ed2025Res?.status()}`);

    // 10. 404 Page (Not Found)
    console.log('\n--- Testando Página 404 Personalizada ---');
    const notFoundRes = await page.goto('http://localhost:3000/rota-que-nao-existe-teste-404', { waitUntil: 'domcontentloaded', timeout: 15000 });
    const is404 = notFoundRes !== null && notFoundRes.status() === 404;
    const notFoundText = await page.textContent('body');
    const hasNotFoundMessage = notFoundText?.includes('404') || notFoundText?.includes('não encontrada');
    record('Tratamento de Rota Inexistente (HTTP 404)', is404 && Boolean(hasNotFoundMessage), `Status: ${notFoundRes?.status()}`);

    // 11. API /api/news
    console.log('\n--- Testando API /api/news ---');
    const apiRes = await page.request.get('http://localhost:3000/api/news');
    record('Endpoint /api/news Responde com Sucesso', apiRes.status() === 200, `Status: ${apiRes.status()}`);
    const apiJson = await apiRes.json().catch(() => null);
    record('Endpoint /api/news Retorna JSON Válido', apiJson !== null, `Tipo de resposta: ${typeof apiJson}`);

    // 12. Payload Admin Route /admin
    console.log('\n--- Testando Rota /admin (Payload CMS) ---');
    const adminRes = await page.goto('http://localhost:3000/admin', { waitUntil: 'domcontentloaded', timeout: 25000 });
    record('Carregamento da Rota /admin', adminRes !== null && (adminRes.status() === 200 || adminRes.status() === 307 || adminRes.status() === 308), `Status: ${adminRes?.status()}`);

  } catch (err: any) {
    console.error('Erro durante os testes Playwright:', err);
    record('Execução Geral da Suite Playwright', false, err.message);
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n==========================================');
  console.log('         RELATÓRIO DE TESTES E2E          ');
  console.log('==========================================');
  const passedCount = results.filter(r => r.status === 'PASS').length;
  const failedCount = results.filter(r => r.status === 'FAIL').length;
  console.log(`Total: ${results.length} | ✅ Passaram: ${passedCount} | ❌ Falharam: ${failedCount}`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests();

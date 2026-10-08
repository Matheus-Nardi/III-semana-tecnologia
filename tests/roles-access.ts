import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { User } from '../src/payload-types'

async function runRolesAccessTests() {
  console.log('🧪 Iniciando testes da matriz de controle de acesso (RBAC - Admin / Editor)...')
  const payload = await getPayload({ config })

  const results: { test: string; status: 'PASS' | 'FAIL'; details?: string }[] = []

  function record(test: string, passed: boolean, details?: string) {
    results.push({
      test,
      status: passed ? 'PASS' : 'FAIL',
      details,
    })
    console.log(`${passed ? '✅' : '❌'} [${passed ? 'PASS' : 'FAIL'}] ${test}${details ? ` - ${details}` : ''}`)
  }

  const timestamp = Date.now()
  const adminEmail = `test-admin-${timestamp}@unitins.br`
  const editorEmail = `test-editor-${timestamp}@unitins.br`
  const editor2Email = `test-editor2-${timestamp}@unitins.br`

  let testAdminUser: User | null = null
  let testEditorUser: User | null = null
  let createdSpeakerId: number | null = null

  try {
    // 1. Setup: Criar usuários de teste com overrideAccess: true
    testAdminUser = await payload.create({
      collection: 'users',
      data: {
        name: 'Admin de Teste',
        email: adminEmail,
        password: 'PasswordTest@123',
        role: 'admin',
      },
    })

    testEditorUser = await payload.create({
      collection: 'users',
      data: {
        name: 'Editor de Teste',
        email: editorEmail,
        password: 'PasswordTest@123',
        role: 'editor',
      },
    })

    console.log(`\n--- Usuários de teste configurados: Admin (${testAdminUser.id}), Editor (${testEditorUser.id}) ---\n`)

    // ─────────────────────────────────────────────────────────
    // Teste 1: Editor NÃO pode criar novos usuários
    // ─────────────────────────────────────────────────────────
    try {
      await payload.create({
        collection: 'users',
        overrideAccess: false,
        user: testEditorUser,
        data: {
          name: 'Editor 2',
          email: editor2Email,
          password: 'PasswordTest@123',
          role: 'editor',
        },
      })
      record('Editor bloqueado de criar novos usuários', false, 'Deveria ter lançado erro de acesso negado')
    } catch {
      record('Editor bloqueado de criar novos usuários', true, 'Acesso negado com sucesso')
    }

    // ─────────────────────────────────────────────────────────
    // Teste 2: Admin PODE criar novos usuários
    // ─────────────────────────────────────────────────────────
    let userCreatedByAdmin: User | null = null
    try {
      userCreatedByAdmin = await payload.create({
        collection: 'users',
        overrideAccess: false,
        user: testAdminUser,
        data: {
          name: 'Editor 2 criado por Admin',
          email: editor2Email,
          password: 'PasswordTest@123',
          role: 'editor',
        },
      })
      record('Admin pode criar novos usuários', Boolean(userCreatedByAdmin?.id), `ID criado: ${userCreatedByAdmin?.id}`)
    } catch (err: unknown) {
      record('Admin pode criar novos usuários', false, err instanceof Error ? err.message : String(err))
    }

    // ─────────────────────────────────────────────────────────
    // Teste 3: Editor NÃO pode deletar outros usuários
    // ─────────────────────────────────────────────────────────
    if (userCreatedByAdmin?.id) {
      try {
        await payload.delete({
          collection: 'users',
          id: userCreatedByAdmin.id,
          overrideAccess: false,
          user: testEditorUser,
        })
        record('Editor bloqueado de deletar usuários', false, 'Deveria ter negado permissão de delete')
      } catch {
        record('Editor bloqueado de deletar usuários', true, 'Delete negado com sucesso')
      }
    }

    // ─────────────────────────────────────────────────────────
    // Teste 4: Editor não pode alterar a própria role para admin (autopromoção)
    // ─────────────────────────────────────────────────────────
    try {
      const updatedUser = await payload.update({
        collection: 'users',
        id: testEditorUser.id,
        overrideAccess: false,
        user: testEditorUser,
        data: {
          role: 'admin',
          name: 'Editor Tentando Autopromoção',
        },
      })
      const isStillEditor = updatedUser?.role === 'editor'
      record('Editor impedido de autopromover sua role para admin', isStillEditor, `Role resultante: ${updatedUser?.role}`)
    } catch {
      record('Editor impedido de autopromover sua role para admin', true, 'Operação rejeitada')
    }

    // ─────────────────────────────────────────────────────────
    // Teste 5: Editor PODE criar e gerenciar conteúdo (Speakers)
    // ─────────────────────────────────────────────────────────
    try {
      const speaker = await payload.create({
        collection: 'speakers',
        overrideAccess: false,
        user: testEditorUser,
        data: {
          name: 'Palestrante Convidado Teste',
          role: 'Pesquisador Sênior',
          institution: 'UNITINS',
        },
      })
      createdSpeakerId = speaker.id
      record('Editor pode criar conteúdo em Speakers', Boolean(speaker.id), `ID criado: ${speaker.id}`)
    } catch (err: unknown) {
      record('Editor pode criar conteúdo em Speakers', false, err instanceof Error ? err.message : String(err))
    }

    // ─────────────────────────────────────────────────────────
    // Teste 6: Usuário anônimo NÃO pode criar conteúdo em Speakers
    // ─────────────────────────────────────────────────────────
    try {
      await payload.create({
        collection: 'speakers',
        overrideAccess: false,
        user: undefined,
        data: {
          name: 'Tentativa Anônima',
          role: 'Hacker',
        },
      })
      record('Usuário anônimo bloqueado de criar conteúdo', false, 'Deveria ter negado acesso anônimo')
    } catch {
      record('Usuário anônimo bloqueado de criar conteúdo', true, 'Acesso bloqueado com sucesso')
    }

    // ─────────────────────────────────────────────────────────
    // Teste 7: Usuário anônimo PODE ler conteúdo público
    // ─────────────────────────────────────────────────────────
    try {
      const publicEditions = await payload.find({
        collection: 'editions',
        overrideAccess: false,
        user: undefined,
        limit: 1,
      })
      record('Usuário anônimo tem acesso público de leitura (Editions)', publicEditions !== null)
    } catch (err: unknown) {
      record('Usuário anônimo tem acesso público de leitura (Editions)', false, err instanceof Error ? err.message : String(err))
    }

    // ─────────────────────────────────────────────────────────
    // Teste 8: Admin NÃO pode excluir a sua própria conta (hook guard)
    // ─────────────────────────────────────────────────────────
    try {
      await payload.delete({
        collection: 'users',
        id: testAdminUser.id,
        overrideAccess: false,
        user: testAdminUser,
      })
      record('Admin impedido de autoexclusão', false, 'Deveria ter bloqueado a autoexclusão')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      const blocked = msg.includes('você não pode excluir a sua própria conta')
      record('Admin impedido de autoexclusão', blocked, msg)
    }

    // ─────────────────────────────────────────────────────────
    // Teste 9: Editor só enxerga seu próprio registro em Users.read
    // ─────────────────────────────────────────────────────────
    try {
      const usersList = await payload.find({
        collection: 'users',
        overrideAccess: false,
        user: testEditorUser,
      })
      const onlySelf = usersList.docs.length === 1 && usersList.docs[0].id === testEditorUser.id
      record('Editor só visualiza seu próprio perfil na lista de usuários', onlySelf, `Registros visíveis: ${usersList.docs.length}`)
    } catch (err: unknown) {
      record('Editor só visualiza seu próprio perfil na lista de usuários', false, err instanceof Error ? err.message : String(err))
    }

  } finally {
    // Limpeza dos dados de teste
    console.log('\n🧹 Limpando dados temporários de teste...')
    if (createdSpeakerId) {
      try {
        await payload.delete({ collection: 'speakers', id: createdSpeakerId })
      } catch {}
    }
    if (testEditorUser?.id) {
      try {
        await payload.delete({ collection: 'users', id: testEditorUser.id })
      } catch {}
    }
    if (testAdminUser?.id) {
      try {
        // Exclusão direta sem passar pelo hook de autoexclusão (user: undefined)
        await payload.delete({ collection: 'users', id: testAdminUser.id })
      } catch {}
    }
  }

  const allPassed = results.every((r) => r.status === 'PASS')
  console.log(`\n========================================`)
  console.log(`Resultado dos testes RBAC: ${allPassed ? '✅ TODOS PASSARAM' : '❌ HOUVE FALHAS'}`)
  console.log(`========================================\n`)

  if (!allPassed) {
    process.exit(1)
  }
}

runRolesAccessTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Erro inesperado nos testes:', err)
    process.exit(1)
  })

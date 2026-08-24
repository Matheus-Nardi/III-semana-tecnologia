import { getPayload } from 'payload'
import config from '@payload-config'

async function updateAdmin() {
  console.log('🔄 Conectando ao Payload CMS para atualizar administrador...')
  const payload = await getPayload({ config })
  const email = process.env.ADMIN_INITIAL_EMAIL || 'italobeckman@unitins.br'
  const password = process.env.ADMIN_INITIAL_PASSWORD || 'Unitins@2025'

  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.totalDocs > 0 && existingUsers.docs[0]) {
    const adminUser = existingUsers.docs[0]
    console.log(`👤 Atualizando usuário ID ${adminUser.id} para ${email}...`)
    await payload.update({
      collection: 'users',
      id: adminUser.id,
      data: {
        email,
        password,
        name: 'Italo Beckman',
      },
    })
    console.log(`✅ Usuário administrador atualizado com sucesso para: ${email}`)
  } else {
    console.log(`👤 Criando novo administrador: ${email}...`)
    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        name: 'Italo Beckman',
      },
    })
    console.log(`✅ Usuário administrador criado com sucesso: ${email}`)
  }
}

updateAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Erro ao atualizar administrador:', err)
    process.exit(1)
  })

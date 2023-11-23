import { MagnifyingGlass } from 'phosphor-react'
import { SeachFormContainer } from './styled'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionContext } from '../../../../context/TransactionContext'
import { useContextSelector } from 'use-context-selector'
import { memo } from 'react'

/**
 * Por que um componente renderiza novamente?
 * - Hooks changed (mudou estado, contexto, reducer, etc)
 * - Props changed (mudou propriedade)
 * - Parent component render (componente pai renderizou)
 *
 * Qual o fluxo de renderização de um componente?
 * 1. O React recria o HTML da interface do componente
 * 2. O React compara o HTML novo com o HTML antigo
 * 3. Se houverem diferenças, o React atualiza o que mudou
 *
 * Memo :
 * 0. Hooks changed, Props changed (deep compare)
 * 0.1: comparar com a versão anterior dos hooks e props
 * 0.2: Se houverem diferenças, renderiza novamente
 */

const searchTransactionSchema = z.object({
  query: z.string(),
})

type searchFormInputs = z.infer<typeof searchTransactionSchema>

function SeacheFormComponents() {
  const { fetchTransactions } = useContextSelector(
    TransactionContext,
    (context) => {
      return {
        fetchTransactions: context.fetchTransactions,
      }
    },
  )
  const {
    register,
    handleSubmit,
    // retorna um true ou false se o formulário está sendo submetido
    formState: { isSubmitting },
  } = useForm<searchFormInputs>({
    resolver: zodResolver(searchTransactionSchema),
  })

  async function handleSearchTransaction(data: searchFormInputs) {
    await fetchTransactions(data.query)
  }

  return (
    <SeachFormContainer onSubmit={handleSubmit(handleSearchTransaction)}>
      <input
        type="text"
        placeholder="Busque por transações"
        {...register('query')}
      />

      <button type="submit" disabled={isSubmitting}>
        <MagnifyingGlass size={20} />
        Buscar
      </button>
    </SeachFormContainer>
  )
}

export const SeacheForm = memo(SeacheFormComponents)

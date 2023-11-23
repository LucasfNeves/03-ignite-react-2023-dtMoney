import { Header } from '../../components/Header'
import { Summary } from '../../components/Summary'
import { SeacheForm } from './components/SeacherForm'
import {
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable,
} from './styled'
import { TransactionContext } from '../../context/TransactionContext'
import { dateFormatter, priceFormatter } from '../../utils/formated'
import { useContextSelector } from 'use-context-selector'

export function Transactions() {
  const { transactions } = useContextSelector(TransactionContext, (context) => {
    return {
      transactions: context.transactions,
    }
  })
  return (
    <div>
      <Header />
      <Summary />

      <TransactionsContainer>
        <SeacheForm />
        <TransactionsTable>
          <tbody>
            {transactions.map((transactions) => {
              return (
                <tr key={transactions.id}>
                  <td width="50%">{transactions.description}</td>
                  <td>
                    <PriceHighlight variant={transactions.type}>
                      {transactions.type === 'outcome' && '- '}
                      {priceFormatter.format(transactions.price)}
                    </PriceHighlight>
                  </td>
                  <td> {transactions.category} </td>
                  <td>
                    {dateFormatter.format(new Date(transactions.createdAt))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </TransactionsTable>
      </TransactionsContainer>
    </div>
  )
}

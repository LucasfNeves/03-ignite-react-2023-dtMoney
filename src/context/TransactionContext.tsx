import { ReactNode, useCallback, useEffect, useState } from 'react'
import { api } from '../lib/axios'
import { createContext } from 'use-context-selector'

interface Transaction {
  id: number
  description: string
  price: number
  type: 'income' | 'outcome'
  category: string
  createdAt: string
}

interface CreatTransactionInput {
  description: string
  price: number
  type: 'income' | 'outcome'
  category: string
}

interface TransactionContextProps {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreatTransactionInput) => Promise<void>
}

export const TransactionContext = createContext<TransactionContextProps>(
  {} as TransactionContextProps,
)

interface TransactionProviderProps {
  children: ReactNode
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('/transactions', {
      params: {
        q: query,
        _sort: 'createdAt',
        _order: 'desc',
      },
    })
    setTransactions(response.data)
  }, [])

  const createTransaction = useCallback(async (data: CreatTransactionInput) => {
    const { description, price, category, type } = data
    const response = await api.post('/transactions', {
      // o id é criado auto pelo backend
      description,
      price,
      category,
      type,
      createdAt: new Date(),
    })
    setTransactions((state) => [response.data, ...state])
  }, [])

  // async function createTransaction(data: CreatTransactionInput) {
  //   const { description, price, category, type } = data
  //   const response = await api.post('/transactions', {
  //     // o id é criado auto pelo backend
  //     description,
  //     price,
  //     category,
  //     type,
  //     createdAt: new Date(),
  //   })
  //   setTransactions((state) => [response.data, ...state])
  // }

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

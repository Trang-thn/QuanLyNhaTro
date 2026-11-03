import { apiRequest } from './api'
import type { TenantInvoice, TenantInvoicePayment } from '../types/tenantInvoice'

export async function getTenantInvoices(): Promise<TenantInvoice[]> {
  const response = await apiRequest<{ data: TenantInvoice[] }>('/invoices')
  return response.data
}

export async function getTenantInvoicePayments(invoiceId: string): Promise<TenantInvoicePayment[]> {
  const response = await apiRequest<{ data: TenantInvoicePayment[] }>(`/invoices/${encodeURIComponent(invoiceId)}/payments`)
  return response.data
}

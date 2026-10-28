import { InvoiceItem, INVOICE_NAVY_COLOR, getInvoiceReadings } from '../../types/invoice/invoice'
import { formatVND } from'../../data/mockData'

export function InvoiceReadingsTable({ selected }: { selected: InvoiceItem }) {
  const readings = getInvoiceReadings(selected)

  return (
    <section>
      <h4 className="font-semibold text-sm mb-2" style={{ color: INVOICE_NAVY_COLOR }}>
        Chỉ số điện nước (tháng {selected.billing_month}/{selected.billing_year})
      </h4>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Loại', 'Cũ', 'Mới', 'Dùng', 'Thành tiền'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100">
              <td className="px-4 py-2.5 text-gray-700 font-medium">Điện (kWh)</td>
              <td className="px-4 py-2.5 text-gray-500">{readings.prevElec}</td>
              <td className="px-4 py-2.5 text-gray-500">{readings.newElec}</td>
              <td className="px-4 py-2.5 font-semibold" style={{ color: INVOICE_NAVY_COLOR }}>{readings.elecKwh}</td>
              <td className="px-4 py-2.5 font-semibold text-right" style={{ color: INVOICE_NAVY_COLOR }}>
                {formatVND(selected.electricity_cost)}<div className="text-[10px] font-normal text-gray-400">× {formatVND(selected.electricity_price_per_kwh ?? 0)}/kWh</div>
              </td>
            </tr>
            <tr className="border-t border-gray-100">
              <td className="px-4 py-2.5 text-gray-700 font-medium">Nước (m³)</td>
              <td className="px-4 py-2.5 text-gray-500">{readings.prevWater}</td>
              <td className="px-4 py-2.5 text-gray-500">{readings.newWater}</td>
              <td className="px-4 py-2.5 font-semibold" style={{ color: INVOICE_NAVY_COLOR }}>{readings.waterM3}</td>
              <td className="px-4 py-2.5 font-semibold text-right" style={{ color: INVOICE_NAVY_COLOR }}>
                {formatVND(selected.water_cost)}<div className="text-[10px] font-normal text-gray-400">× {formatVND(selected.water_price_per_m3 ?? 0)}/m³</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

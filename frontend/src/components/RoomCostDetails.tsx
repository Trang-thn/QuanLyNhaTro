const NAVY = '#0d2137';

const costs = [
  { label: 'Giá thuê', value: '3.500.000đ/tháng' },
  { label: 'Tiền đặt cọc', value: '3.500.000đ' },
  { label: 'Ngày chốt hóa đơn', value: 'Ngày 01 hàng tháng' },
];

const amenities = ['WiFi', 'Điều hòa', 'Tủ lạnh', 'Bình nóng lạnh', 'Máy giặt'];

export default function RoomCostDetails() {
  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <p className="font-semibold text-sm mb-3" style={{ color: NAVY }}>Chi tiết Chi phí &amp; Quy định</p>
      
      <div className="space-y-2.5 text-sm">
        {costs.map((f) => (
          <div key={f.label} className="flex justify-between">
            <span className="text-gray-500">{f.label}</span>
            <span className="font-semibold text-gray-800">{f.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-2">Tiện nghi đi kèm</p>
        <div className="flex flex-wrap gap-2">
          {amenities.map((a) => (
            <span key={a} className="px-2.5 py-1 rounded-full text-xs border border-gray-200 text-gray-600">
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
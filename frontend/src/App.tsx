import Quanlydiennuoc from './components/Quanlydiennuoc/Quanlydiennuoc';
function App() {
  return (
    <main className="container py-5">
      <div className="eyebrow mb-2">BOARDING HOUSE MANAGEMENT</div>
      <h1 className="display-6 fw-semibold">Quản lý phòng trọ</h1>
      <p className="text-secondary">Không gian quản lý phòng, hợp đồng, hóa đơn và khách thuê.</p>
      <div className="row g-3 mt-4">
        {[['Phòng trọ', 'rooms'], ['Khách thuê', 'tenants'], ['Hợp đồng', 'contracts'], ['Hóa đơn', 'invoices']].map(([label, key]) => (
          <div className="col-12 col-sm-6 col-lg-3" key={key}><section className="card h-100"><div className="card-body"><div className="text-secondary small">MODULE</div><h2 className="h5 mt-2 mb-0">{label}</h2></div></section></div>
        ))}
      </div>
      <p className="mt-4 small text-secondary">Giao diện khởi tạo — kết nối API và màn hình chi tiết sẽ được phát triển theo module.</p>
    </main>
  );
}

export default App;

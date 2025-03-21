export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng số người dùng
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      12,345
                    </dd>
                  </dl>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng số nhóm
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      24
                    </dd>
                  </dl>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng số khách hàng
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      567
                    </dd>
                  </dl>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng số đơn hàng
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      678
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Thống kê gần đây
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <p className="text-center text-gray-500">
                  Biểu đồ thống kê sẽ hiển thị ở đây
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

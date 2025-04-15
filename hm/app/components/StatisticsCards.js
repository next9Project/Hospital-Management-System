export default function StatisticsCards({ stats }) {
    const cards = [
      {
        title: 'إجمالي المرضى',
        value: stats.totalPatients,
        icon: '👥',
        color: 'bg-blue-500',
      },
      {
        title: 'إجمالي المواعيد',
        value: stats.totalAppointments,
        icon: '📅',
        color: 'bg-green-500',
      },
      {
        title: 'المواعيد المعلقة',
        value: stats.pendingAppointments,
        icon: '⏳',
        color: 'bg-yellow-500',
      },
      {
        title: 'المواعيد المكتملة',
        value: stats.completedAppointments,
        icon: '✅',
        color: 'bg-purple-500',
      },
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`${card.color} text-white p-3 rounded-full`}>
                <span className="text-xl">{card.icon}</span>
              </div>
              <div className="mr-4">
                <h3 className="text-gray-500 text-sm">{card.title}</h3>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
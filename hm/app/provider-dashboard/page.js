"use client";

import { useState, useEffect } from 'react';
import AppointmentsTable from '../components/AppointmentsTable';
import PatientsTable from '../components/PatientsTable';
import AppointmentModal from '../components/AppointmentModal.js';
import Header from "../components/Header";
import Sidebar from '../components/Sidebar';
import StatisticsCards from '../components/StatisticsCards';
import PrescriptionsTable from"../components/PrescriptionsTable"
import Link from 'next/link';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const appointmentsRes = await fetch('http://localhost:3000/api/appointments');
      const appointmentsData = await appointmentsRes.json();

      const patientsRes = await fetch('http://localhost:3000/api/patients');
      const patientsData = await patientsRes.json();

      const prescriptionsRes = await fetch('http://localhost:3000/api/prescriptions');
      const prescriptionsData = await prescriptionsRes.json();

      const appointmentsList = appointmentsData.appointments || [];
      setAppointments(appointmentsList);
      setPatients(Array.isArray(patientsData) ? patientsData : [patientsData]);
      setPrescriptions(Array.isArray(prescriptionsData) ? prescriptionsData : []);

      setStats({
        totalPatients: Array.isArray(patientsData) ? patientsData.length : 1,
        totalAppointments: appointmentsList.length,
        pendingAppointments: appointmentsList.filter(app => app.status === 'pending').length,
        completedAppointments: appointmentsList.filter(app => app.status === 'completed').length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/appointments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appointmentId, status: newStatus })
      });

      if (response.ok) {
        setAppointments(prev => prev.map(app =>
          app._id === appointmentId ? { ...app, status: newStatus } : app
        ));
        fetchData();
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const logout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-100 text-black" dir="rtl">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-white shadow-md">
          <Header />
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
            تسجيل الخروج
          </button>
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">لوحة التحكم</h1>

          <StatisticsCards stats={stats} />

          {activeTab === 'appointments' && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">المواعيد</h2>
              {loading ? (
                <p className="text-center py-4">جاري تحميل البيانات...</p>
              ) : (
                <AppointmentsTable 
                  appointments={appointments} 
                  handleStatusChange={handleStatusChange}
                  openModal={openModal} 
                />
              )}
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">المرضى</h2>
              {loading ? (
                <p className="text-center py-4">جاري تحميل البيانات...</p>
              ) : (
                <PatientsTable patients={patients} />
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">الوصفات الطبية</h2>
              {loading ? (
                <p className="text-center py-4">جاري تحميل البيانات...</p>
              ) : (
                <PrescriptionsTable prescriptions={prescriptions} />
              )}
            </div>
          )}

        </main>
      </div>

      {isModalOpen && (
        <AppointmentModal 
          appointment={selectedAppointment} 
          onClose={() => setIsModalOpen(false)}
          handleStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}


// components/Header.js

// components/Sidebar.js

// components/StatisticsCards.js
 

// components/AppointmentsTable.js

// components/PatientsTable.js


// components/AppointmentModal.js

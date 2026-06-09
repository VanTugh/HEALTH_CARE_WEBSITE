import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AtHousePage from "./pages/AtHousePage";
import AtHopitalPage from "./pages/AtHopitalPage";
import HealthLifePage from "./pages/HealthLifePage";
import AdminPage from "./pages/AdminPage";
import Dashboard from "./components/Admin/DashBoard/Dashboard"
import MedicalPage from "./components/Admin/CoSoYTe/MedicalPage"
import SpecialtiesPage from "./components/Admin/ChuyenKhoa/SpecialtiesPage"
import DoctorsPage from "./components/Admin/BacSi/DoctorsPage"
import PageLogin from "./pages/PageLogin"
import UserPage from "./pages/UserPage";
import SpecialtyPage from "./pages/SpecialtyPage"
import RemotePage from "./pages/RemotePage";
import ForgotPassword from "./components/User/ForgotPassword";
import AuthOTP from "./components/User/AuthOTP";
import AuthChangePass from "./components/User/AuthChangePass";
import DoctorPage from "./pages/DoctorPage";
import Medical_Page from "./pages/Medical_Page";
import Doctor from "./components/Doctor/Doctor";
import SpecialtyDetailPage from "./pages/SpecialtyDetailPage";
import AppointmentBooking from "./components/AppointmentBooking";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedDoctorRoute from "./components/ProtectedDoctorRoute";
import DoctorManagerPage from "./components/DoctorManager/DoctorManagerPage";
import DoctorInfor from "./components/DoctorManager/Infor/DoctorInfor";
import CustomerBookingPage from "./components/DoctorManager/Appointment/CustomerBookingPage";
import EmailVerification from "./components/Register/EmailVerification.jsx";
import SearchInfor from "./pages/SearchInfor.jsx"
import TrinhDoPage from "./components/Admin/TrinhDo/TrinhDoPage.jsx";
import DoctorBookingPageConfirmed from "./components/DoctorManager/Confirmed/CustomerBookingPageConfirmed.jsx";
import DoctorLeavePage from "./components/Admin/LichNghi/DoctorLeavePage.jsx";
import MyLeavePage from "./components/DoctorManager/Schedule/MyLeavePage.jsx";
import HealthcareCenterCard from "./pages/HealthcareCenterCard.jsx";
import ScheduleTimetable from "./components/Admin/LichLamViec/ScheduleTimetable.jsx";
import PatientPage from "./components/Admin/BenhNhan/PatientPage.jsx";
import DoctorHistoryPage from "./components/DoctorManager/HistoryAppointment/DoctorHistoryPage.jsx";
import AdminHistoryPage from "./components/Admin/LichSuKham/AdminHistoryPage.jsx"
import PaymentResult from "./pages/PaymentResult.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        // Trang chu
        <Route path="/" element={<Home />} />
        <Route path="/athousepage" element={<AtHousePage />} />
        <Route path="/athopitalpage" element={<AtHopitalPage />} />
        <Route path="/athealthlife" element={<HealthLifePage />} />
        <Route path="/loginpage" element={<PageLogin />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/specialtypage" element={<SpecialtyPage />} />
        <Route path="/doctorpage" element={<DoctorPage />} />
        <Route path="/remotepage" element={<RemotePage />} />
        <Route path="/medicalpage" element={<Medical_Page />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/authotp" element={<AuthOTP />} />
        <Route path="/authchangepass" element={<AuthChangePass />} />
        <Route path="/emailverification" element={<EmailVerification />} />
        <Route path="/search" element={<SearchInfor />} />
        <Route path="/hopital" element={<HealthcareCenterCard />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        // small page
        <Route path="/doctor/:id" element={<Doctor />} />
        <Route path="/chuyenkhoa/:id" element={<SpecialtyDetailPage />} />
        <Route path="/dat-lich" element={<AppointmentBooking />} />

        // Doctor
        <Route
          path="/bacsi"
          element={
            <ProtectedDoctorRoute>
              <DoctorManagerPage />
            </ProtectedDoctorRoute>
          }
        >
          <Route index element={<DoctorInfor />} />
          <Route path="infor" element={<DoctorInfor />} />
          <Route path="schedule" element={<MyLeavePage />} />
          <Route path="appointment" element={<CustomerBookingPage />} />
          <Route path="meetings" element={<DoctorBookingPageConfirmed />} />
          <Route path="history" element={<DoctorHistoryPage />} />
        </Route>

        // Admin
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="medical" element={<MedicalPage />} />
          <Route path="specialties" element={<SpecialtiesPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="services" element={<PatientPage />} />
          <Route path="appointments" element={<ScheduleTimetable />} />
          <Route path="degree" element={<TrinhDoPage />} />
          <Route path="leave" element={<DoctorLeavePage />} />
          <Route path="history" element={<AdminHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import AppLayout from "./components/layout/AppLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { storage } from "./utils/storage.js";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import { LanguageProvider } from "./utils/i18n.jsx";
import { ForgotPasswordPage, LandingPage, LoginPage, NotFoundPage } from "./pages/public.jsx";
import {
  AddStudentForm,
  AdminDashboard,
  AdminSimplePage,
  AnnouncementsPage,
  AssignmentDetails,
  AssignmentsPage,
  AttendancePage,
  AuditLog,
  CalendarPage,
  CourseDetails,
  CoursesPage,
  GradesPage,
  Gradebook,
  HelpCenter,
  LessonViewer,
  LessonsPage,
  ManagementPage,
  MessagesPage,
  ParentDashboard,
  ProfilePage,
  QuizInterface,
  QuizzesPage,
  ReportsPage,
  ResourcesPage,
  SettingsPage,
  StudentDashboard,
  StudentsPage,
  Submissions,
  TeacherDashboard,
  UsersManagement,
  AchievementsPage,
} from "./pages/portal.jsx";

export default function App() {
  const [user, setUser] = useState(() => storage.get("edubridge-user"));
  const [theme, setTheme] = useState(() => storage.get("edubridge-theme", "light"));
  const [language, setLanguage] = useState(() => storage.get("edubridge-language", "en"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    storage.set("edubridge-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language === "ar" ? "ar" : "en";
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    storage.set("edubridge-language", language);
  }, [language]);

  return (
    <LanguageProvider language={language} setLanguage={setLanguage}>
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} user={user} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<ProtectedRoute user={user} />}>
        <Route element={<AppLayout user={user} setUser={setUser} theme={theme} setTheme={setTheme} />}>
          <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<CoursesPage />} />
          <Route path="/student/courses/:id" element={<CourseDetails />} />
          <Route path="/student/lessons" element={<LessonsPage />} />
          <Route path="/student/lessons/:id" element={<LessonViewer />} />
          <Route path="/student/assignments" element={<AssignmentsPage />} />
          <Route path="/student/assignments/:id" element={<AssignmentDetails />} />
          <Route path="/student/quizzes" element={<QuizzesPage />} />
          <Route path="/student/quizzes/:id" element={<QuizInterface />} />
          <Route path="/student/grades" element={<GradesPage />} />
          <Route path="/student/attendance" element={<AttendancePage />} />
          <Route path="/student/calendar" element={<CalendarPage />} />
          <Route path="/student/announcements" element={<AnnouncementsPage />} />
          <Route path="/student/messages" element={<MessagesPage />} />
          <Route path="/student/resources" element={<ResourcesPage />} />
          <Route path="/student/profile" element={<ProfilePage />} />
          <Route path="/student/achievements" element={<AchievementsPage />} />
          <Route path="/student/help" element={<HelpCenter />} />
          <Route path="/student/settings" element={<SettingsPage />} />

          <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/courses" element={<CoursesPage mode="teacher" />} />
          <Route path="/teacher/courses/:id" element={<CourseDetails />} />
          <Route path="/teacher/manage-course" element={<ManagementPage />} />
          <Route path="/teacher/lesson-form" element={<ManagementPage type="lesson" />} />
          <Route path="/teacher/assignments" element={<ManagementPage type="assignment" />} />
          <Route path="/teacher/submissions" element={<Submissions />} />
          <Route path="/teacher/quiz-builder" element={<ManagementPage type="quiz" />} />
          <Route path="/teacher/gradebook" element={<Gradebook />} />
          <Route path="/teacher/attendance" element={<AttendancePage teacher />} />
          <Route path="/teacher/students" element={<StudentsPage />} />
          <Route path="/teacher/announcements" element={<ManagementPage type="announcement" />} />
          <Route path="/teacher/messages" element={<MessagesPage />} />
          <Route path="/teacher/help" element={<HelpCenter />} />
          <Route path="/teacher/settings" element={<SettingsPage />} />

          <Route path="/parent" element={<Navigate to="/parent/dashboard" replace />} />
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          <Route path="/parent/progress" element={<GradesPage />} />
          <Route path="/parent/attendance" element={<AttendancePage />} />
          <Route path="/parent/announcements" element={<AnnouncementsPage />} />
          <Route path="/parent/messages" element={<MessagesPage />} />
          <Route path="/parent/calendar" element={<CalendarPage />} />
          <Route path="/parent/help" element={<HelpCenter />} />
          <Route path="/parent/settings" element={<SettingsPage />} />

          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/add-student" element={<AddStudentForm />} />
          <Route path="/admin/academic-structure" element={<AdminSimplePage title="Academic Structure" />} />
          <Route path="/admin/courses" element={<AdminSimplePage title="Course Management" />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/announcements" element={<ManagementPage type="announcement" />} />
          <Route path="/admin/audit-log" element={<AuditLog />} />
          <Route path="/admin/system-settings" element={<SettingsPage />} />
          <Route path="/admin/messages" element={<MessagesPage />} />
          <Route path="/admin/help" element={<HelpCenter />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage user={user} />} />
      </Routes>
    </ErrorBoundary>
    </LanguageProvider>
  );
}

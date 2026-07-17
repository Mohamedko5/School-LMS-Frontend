import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Bell, BookOpen, CalendarDays, CheckSquare, GraduationCap, HelpCircle, Home, LogOut, Menu,
  MessageSquare, Moon, Search, Settings, Shield, Sun, Trophy, Users, X, ClipboardList, BarChart3,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { notifications } from "../../data/mockData";
import { roleHome, storage } from "../../utils/storage";
import { Badge, Button, Input } from "../common/ui";
import { useLanguage } from "../../utils/i18n.jsx";

const baseItems = [
  ["dashboard", "dashboard", Home],
  ["courses", "courses", BookOpen],
  ["assignments", "assignments", ClipboardList],
  ["quizzes", "quizzes", CheckSquare],
  ["calendar", "calendar", CalendarDays],
  ["grades", "grades", Trophy],
  ["attendance", "attendance", BarChart3],
  ["announcements", "announcements", Bell],
  ["messages", "messages", MessageSquare],
  ["resources", "resources", GraduationCap],
  ["help", "help", HelpCircle],
  ["settings", "settings", Settings],
];

const roleItems = {
  Student: [
    ["home", "dashboard", Home],
    ["myClasses", "courses", BookOpen],
    ["homework", "assignments", ClipboardList],
    ["tests", "quizzes", CheckSquare],
    ["calendar", "calendar", CalendarDays],
    ["results", "grades", Trophy],
    ["messages", "messages", MessageSquare],
    ["profile", "profile", Users],
  ],
  Teacher: [
    ["dashboard", "dashboard", Home], ["courses", "courses", BookOpen], ["courseManagement", "manage-course", Shield],
    ["lessons", "lesson-form", GraduationCap], ["assignments", "assignments", ClipboardList], ["submissions", "submissions", CheckSquare],
    ["quizBuilder", "quiz-builder", CheckSquare], ["gradebook", "gradebook", Trophy], ["attendance", "attendance", BarChart3],
    ["students", "students", Users], ["announcements", "announcements", Bell], ["messages", "messages", MessageSquare],
    ["help", "help", HelpCircle], ["settings", "settings", Settings],
  ],
  Parent: [
    ["dashboard", "dashboard", Home], ["childProgress", "progress", Trophy], ["attendance", "attendance", BarChart3],
    ["announcements", "announcements", Bell], ["messages", "messages", MessageSquare], ["calendar", "calendar", CalendarDays],
    ["help", "help", HelpCircle], ["settings", "settings", Settings],
  ],
  "School Admin": [
    ["dashboard", "dashboard", Home], ["users", "users", Users], ["addStudent", "add-student", Users],
    ["academicStructure", "academic-structure", GraduationCap], ["courses", "courses", BookOpen], ["reports", "reports", BarChart3],
    ["announcements", "announcements", Bell], ["auditLog", "audit-log", ClipboardList], ["systemSettings", "system-settings", Settings],
    ["messages", "messages", MessageSquare], ["help", "help", HelpCircle],
  ],
};

function rolePath(role) {
  return role === "School Admin" ? "admin" : role.toLowerCase();
}

export default function AppLayout({ user, setUser, theme, setTheme }) {
  const safeUser = user || { name: "Demo User", role: "Student" };
  const { t, language, dir, toggleLanguage } = useLanguage();
  const [drawer, setDrawer] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const items = roleItems[safeUser.role] || roleItems.Student;
  const pageTitle = useMemo(() => {
    const last = location.pathname.split("/").filter(Boolean).pop() || "dashboard";
    const matchingItem = items.find(([, slug]) => slug === last);
    if (matchingItem) return t(matchingItem[0]);
    return last.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
  }, [items, location.pathname, t]);

  useEffect(() => setDrawer(false), [location.pathname]);
  useEffect(() => {
    if (!drawer) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setDrawer(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const logout = () => {
    storage.remove("edubridge-user");
    setUser(null);
    navigate("/login");
  };

  const switchRole = (role) => {
    const next = { ...safeUser, role };
    storage.set("edubridge-user", next);
    setUser(next);
    navigate(roleHome[role]);
  };

  const side = (
    <aside className="flex h-full w-full max-w-[min(20rem,86vw)] flex-col bg-white dark:bg-slate-950" dir={dir} aria-label="Main navigation">
      <Link to={roleHome[safeUser.role]} className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white"><GraduationCap /></div>
        <div>
          <p className="font-bold text-slate-950 dark:text-white">EduBridge</p>
          <p className="text-xs text-slate-500">{t("schoolLms")}</p>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map(([labelKey, slug, Icon]) => (
          <NavLink key={slug} to={`/${rolePath(safeUser.role)}/${slug}`} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"}`}>
            <Icon size={18} /> {t(labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-950" dir={dir}>
      <div className={`fixed inset-y-0 z-30 hidden w-72 border-slate-200 dark:border-slate-800 lg:block ${dir === "rtl" ? "right-0 border-l" : "left-0 border-r"}`}>{side}</div>
      <AnimatePresence>
        {drawer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" onMouseDown={() => setDrawer(false)}>
            <motion.div initial={{ x: dir === "rtl" ? 320 : -320 }} animate={{ x: 0 }} exit={{ x: dir === "rtl" ? 320 : -320 }} className={`h-full w-[min(20rem,86vw)] ${dir === "rtl" ? "ml-auto" : ""}`} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
              <div className={`absolute top-4 ${dir === "rtl" ? "left-4" : "right-4"}`}><Button aria-label="Close navigation" variant="ghost" className="bg-white px-2 dark:bg-slate-900" onClick={() => setDrawer(false)}><X /></Button></div>
              {side}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={dir === "rtl" ? "lg:pr-72" : "lg:pl-72"}>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-3 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-4 sm:py-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="ghost" className="px-2 lg:hidden" aria-label={t("openNavigation")} onClick={() => setDrawer(true)}><Menu /></Button>
            <div className={`min-w-0 ${dir === "rtl" ? "ml-auto" : "mr-auto"}`}>
              <h1 className="truncate text-base font-bold text-slate-950 dark:text-white sm:text-xl">{pageTitle}</h1>
              <p className="hidden text-xs text-slate-500 sm:block">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
            </div>
            <div className="hidden w-full max-w-xs md:block">
              <Input aria-label={t("globalSearchPlaceholder")} placeholder={t("globalSearchPlaceholder")} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Button aria-label="Global search" variant="ghost" className="hidden px-3 sm:inline-flex" title="Global search"><Search size={18} /></Button>
            <Button aria-label={t("notifications")} variant="ghost" className="px-2 sm:px-3" onClick={() => setNoticeOpen(!noticeOpen)} title={t("notifications")}><Bell size={18} /></Button>
            <Button variant="outline" className="px-2 sm:px-3" onClick={toggleLanguage} title={t("switchLanguage")}>{language === "ar" ? "EN" : "ع"}</Button>
            <Button aria-label={t("toggleTheme")} variant="ghost" className="hidden px-3 sm:inline-flex" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title={t("toggleTheme")}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</Button>
            <div className="flex min-w-0 items-center gap-1 rounded-lg border border-slate-200 px-1.5 py-1 dark:border-slate-800 sm:gap-2 sm:px-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-teal-100 font-bold text-teal-700 dark:bg-teal-950">{safeUser.name?.[0] || "D"}</div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-4">{safeUser.name}</p>
                <select aria-label={t("switchDemoRole")} className="bg-transparent text-xs text-slate-500" value={safeUser.role} onChange={(e) => switchRole(e.target.value)}>
                  {Object.keys(roleHome).map((role) => <option key={role}>{role}</option>)}
                </select>
              </div>
              <span className="hidden md:inline-flex"><Badge tone="teal">{safeUser.role}</Badge></span>
              <Button variant="ghost" className="px-2" onClick={logout} title={t("logout")}><LogOut size={18} /></Button>
            </div>
          </div>
          {noticeOpen && (
            <div className={`absolute top-14 mx-3 max-h-[70dvh] w-[calc(100vw-1.5rem)] max-w-sm overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:top-16 ${dir === "rtl" ? "left-0 sm:left-4" : "right-0 sm:right-4"}`}>
              <div className="mb-2 flex items-center justify-between"><b>{t("notifications")}</b><Badge>{notifications.filter((n) => !n.read).length} {t("new")}</Badge></div>
              {notifications.map((item) => <div key={item.id} className="rounded-lg p-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"><b>{item.type}</b><p className="text-slate-500">{item.title}</p></div>)}
              <Button className="mt-2 w-full" variant="outline">{t("markAllRead")}</Button>
            </div>
          )}
          {query && <div className={`absolute top-14 mx-3 w-[calc(100vw-1.5rem)] max-w-md rounded-lg border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:top-16 ${dir === "rtl" ? "left-0 sm:left-36" : "right-0 sm:right-36"}`}><b className="break-words">{t("searchResultsFor")} "{query}"</b><p className="mt-2 text-sm text-slate-500">{t("searchResultsText")}</p></div>}
        </header>
        <main className={`mx-auto w-full max-w-[1920px] p-3 md:p-5 xl:p-6 ${safeUser.role === "Student" ? "mobile-safe-bottom lg:pb-6" : "pb-6"}`}><Outlet context={{ user: safeUser, home: roleHome[safeUser.role] }} /></main>
        {safeUser.role === "Student" && (
          <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden dark:border-slate-800 dark:bg-slate-950">
            {[
              ["home", "dashboard", Home],
              ["myClasses", "courses", BookOpen],
              ["homework", "assignments", ClipboardList],
              ["calendar", "calendar", CalendarDays],
              ["profile", "profile", Users],
            ].map(([labelKey, slug, Icon]) => <NavLink key={slug} to={`/${rolePath(safeUser.role)}/${slug}`} className="grid min-w-0 place-items-center gap-1 px-1 py-2 text-[11px] leading-tight"><Icon size={18} /><span className="max-w-full truncate">{t(labelKey)}</span></NavLink>)}
          </nav>
        )}
      </div>
    </div>
  );
}

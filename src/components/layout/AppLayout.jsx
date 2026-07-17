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
  Student: baseItems.concat([["achievements", "achievements", Trophy], ["profile", "profile", Users]]),
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
    <aside className="flex h-full flex-col bg-white dark:bg-slate-950" dir={dir}>
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950" dir={dir}>
      <div className={`fixed inset-y-0 z-30 hidden w-72 border-slate-200 dark:border-slate-800 lg:block ${dir === "rtl" ? "right-0 border-l" : "left-0 border-r"}`}>{side}</div>
      <AnimatePresence>{drawer && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"><motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} className="h-full w-72"><div className="absolute right-4 top-4"><Button variant="ghost" className="bg-white px-2" onClick={() => setDrawer(false)}><X /></Button></div>{side}</motion.div></motion.div>}</AnimatePresence>
      <div className={dir === "rtl" ? "lg:pr-72" : "lg:pl-72"}>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" className="px-2 lg:hidden" aria-label={t("openNavigation")} onClick={() => setDrawer(true)}><Menu /></Button>
            <div className={dir === "rtl" ? "ml-auto" : "mr-auto"}>
              <h1 className="text-xl font-bold text-slate-950 dark:text-white">{pageTitle}</h1>
              <p className="text-xs text-slate-500">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
            </div>
            <div className="hidden w-full max-w-xs md:block">
              <Input aria-label={t("globalSearchPlaceholder")} placeholder={t("globalSearchPlaceholder")} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Button variant="ghost" className="px-3" title="Global search"><Search size={18} /></Button>
            <Button variant="ghost" className="px-3" onClick={() => setNoticeOpen(!noticeOpen)} title={t("notifications")}><Bell size={18} /></Button>
            <Button variant="outline" className="px-3" onClick={toggleLanguage} title={t("switchLanguage")}>{language === "ar" ? "EN" : "ع"}</Button>
            <Button variant="ghost" className="px-3" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title={t("toggleTheme")}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</Button>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1 dark:border-slate-800">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-teal-100 font-bold text-teal-700 dark:bg-teal-950">{safeUser.name?.[0] || "D"}</div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-4">{safeUser.name}</p>
                <select aria-label={t("switchDemoRole")} className="bg-transparent text-xs text-slate-500" value={safeUser.role} onChange={(e) => switchRole(e.target.value)}>
                  {Object.keys(roleHome).map((role) => <option key={role}>{role}</option>)}
                </select>
              </div>
              <Badge tone="teal">{safeUser.role}</Badge>
              <Button variant="ghost" className="px-2" onClick={logout} title={t("logout")}><LogOut size={18} /></Button>
            </div>
          </div>
          {noticeOpen && (
            <div className="absolute right-4 top-16 w-80 rounded-lg border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-2 flex items-center justify-between"><b>{t("notifications")}</b><Badge>{notifications.filter((n) => !n.read).length} {t("new")}</Badge></div>
              {notifications.map((item) => <div key={item.id} className="rounded-lg p-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"><b>{item.type}</b><p className="text-slate-500">{item.title}</p></div>)}
              <Button className="mt-2 w-full" variant="outline">{t("markAllRead")}</Button>
            </div>
          )}
          {query && <div className="absolute right-36 top-16 w-96 rounded-lg border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900"><b>{t("searchResultsFor")} "{query}"</b><p className="mt-2 text-sm text-slate-500">{t("searchResultsText")}</p></div>}
        </header>
        <main className="p-4 pb-24 md:p-6"><Outlet context={{ user: safeUser, home: roleHome[safeUser.role] }} /></main>
        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-950">
          {items.slice(0, 4).map(([labelKey, slug, Icon]) => <NavLink key={slug} to={`/${rolePath(safeUser.role)}/${slug}`} className="grid place-items-center gap-1 px-2 py-2 text-xs"><Icon size={18} />{t(labelKey)}</NavLink>)}
        </nav>
      </div>
    </div>
  );
}

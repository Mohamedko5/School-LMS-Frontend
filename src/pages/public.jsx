import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff, GraduationCap, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { school } from "../data/mockData";
import { roleHome, storage } from "../utils/storage";
import { Badge, Button, Card, Input, Select } from "../components/common/ui";
import { useLanguage } from "../utils/i18n.jsx";

export function LandingPage() {
  const { t, dir, language, toggleLanguage } = useLanguage();
  const features = language === "ar"
    ? ["بوابات حسب الدور", "واجبات واختبارات", "الحضور والدرجات", "رسائل مدرسية آمنة", "تقارير وإعلانات", "الوضع الداكن"]
    : ["Role-based portals", "Assignments and quizzes", "Attendance and grades", "Safe school messaging", "Reports and announcements", "Dark mode"];
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950" dir={dir}>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link className="flex items-center gap-3" to="/"><div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600 text-white"><GraduationCap /></div><b className="text-xl">EduBridge</b></Link>
        <nav className="hidden gap-6 text-sm font-medium md:flex"><a href="#features">{t("features")}</a><a href="#benefits">{t("benefits")}</a><a href="#contact">{t("contact")}</a></nav>
        <div className="flex gap-2"><Button variant="outline" onClick={toggleLanguage}>{t("switchLanguage")}</Button><Link to="/login"><Button>{t("demoLoginButton")}</Button></Link></div>
      </header>
      <main>
        <section className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <Badge tone="teal">{t("landingBadge")}</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-normal text-slate-950 dark:text-white sm:text-6xl">EduBridge School LMS</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{t("landingText")}</p>
            <div className="mt-7 flex flex-wrap gap-3"><Link to="/login"><Button>{t("explorePrototype")}</Button></Link><a href="#features"><Button variant="outline">{t("viewFeatures")}</Button></a></div>
          </div>
          <div className="relative">
            <div className="absolute -left-4 top-6 h-28 w-28 rounded-full bg-teal-200/60 blur-2xl" />
            <Card className="relative overflow-hidden">
              <div className="mb-5 flex items-center justify-between"><b>Student Dashboard Preview</b><Badge>Grade 8A</Badge></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {["Daily progress 72%", "Math class 9:00", "Science quiz Jul 22", "Attendance 94%"].map((item) => <div key={item} className="rounded-lg bg-blue-50 p-4 text-sm font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-100">{item}</div>)}
              </div>
              <div className="mt-5 h-44 rounded-lg bg-gradient-to-br from-blue-100 via-white to-teal-100 p-5 dark:from-blue-950 dark:via-slate-900 dark:to-teal-950">
                <Sparkles className="text-blue-600" />
                <p className="mt-6 max-w-sm text-2xl font-bold">Keep learning calm, clear, and connected.</p>
              </div>
            </Card>
          </div>
        </section>
        <section id="features" className="mx-auto max-w-7xl px-5 py-12"><h2 className="text-2xl font-bold">{t("mainFeatures")}</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{features.map((feature) => <Card key={feature}><b>{feature}</b><p className="mt-2 text-sm text-slate-500">{language === "ar" ? "مصمم بتدفقات واقعية وحالة محفوظة وتجاوب كامل وتحكم سهل الوصول." : "Built with realistic workflows, saved demo state, responsive layout, and accessible controls."}</p></Card>)}</div></section>
        <section id="benefits" className="mx-auto max-w-7xl px-5 py-12"><div className="grid gap-4 md:grid-cols-3">{["Students stay organized without feeling overwhelmed.", "Teachers manage lessons, grading, quizzes, and attendance in one place.", "Parents see progress, attendance, and school updates clearly."].map((text, index) => <Card key={text}><Badge tone={index === 1 ? "green" : "blue"}>{["Students", "Teachers", "Parents"][index]}</Badge><p className="mt-4 text-slate-600 dark:text-slate-300">{text}</p></Card>)}</div></section>
      </main>
      <footer id="contact" className="border-t border-slate-200 px-5 py-8 text-sm dark:border-slate-800"><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4"><span>{school.name} - {school.address}</span><span>{school.email} - Privacy - Terms</span></div></footer>
    </div>
  );
}

export function LoginPage({ setUser, user }) {
  const { t, dir, toggleLanguage } = useLanguage();
  const [form, setForm] = useState({ name: "Adam Hassan", password: "demo123", role: "Student", remember: true });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role && roleHome[user.role]) navigate(roleHome[user.role], { replace: true });
  }, [navigate, user]);
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.password.trim()) return setError(t("loginError"));
    const user = { name: form.name.trim(), role: form.role };
    storage.set("edubridge-user", user);
    setUser(user);
    navigate(roleHome[form.role]);
  };
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-slate-950" dir={dir}>
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-slate-900 lg:grid-cols-2">
        <div className="bg-gradient-to-br from-blue-700 to-teal-600 p-8 text-white">
          <div className="flex justify-end"><Button variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20" type="button" onClick={toggleLanguage}>{t("switchLanguage")}</Button></div>
          <GraduationCap size={42} />
          <h1 className="mt-8 text-4xl font-black">{t("welcome")}</h1>
          <p className="mt-4 text-blue-50">{t("loginHelp")}</p>
          <div className="mt-8 grid gap-3">{(dir === "rtl" ? ["خطط تعلم للطلاب", "أدوات تقييم للمعلمين", "تحديثات لأولياء الأمور", "تقارير الإدارة"] : ["Student learning plans", "Teacher grading tools", "Parent progress updates", "Admin reports"]).map((item) => <div key={item} className="rounded-lg bg-white/15 p-3">{item}</div>)}</div>
        </div>
        <form onSubmit={submit} className="p-8">
          <h2 className="text-2xl font-bold">{t("demoLogin")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("tryRoles")}</p>
          <div className="mt-6 space-y-4">
            <Input label={t("username")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200"><span className="mb-1 block">{t("password")}</span><div className="flex rounded-lg border border-slate-300 dark:border-slate-700"><input className="min-w-0 flex-1 rounded-l-lg bg-white px-3 py-2 dark:bg-slate-950" type={show ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button type="button" className="px-3" onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
            <Select label={t("role")} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{Object.keys(roleHome).map((role) => <option key={role}>{role}</option>)}</Select>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} /> {t("rememberMe")}</label>
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <Button className="w-full" type="submit"><Lock size={18} /> {t("login")}</Button>
            <Link className="block text-center text-sm font-semibold text-blue-600" to="/forgot-password">{t("forgotPassword")}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  return <div className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-slate-950"><Card className="w-full max-w-md"><h1 className="text-2xl font-bold">Reset Password</h1>{sent ? <p className="mt-4 text-green-700">Check your inbox for demo reset instructions.</p> : <form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setSent(true); }}><Input label="School email" value={email} onChange={(e) => setEmail(e.target.value)} error={email && !email.includes("@") ? "Enter a valid email address." : ""} /><Button className="w-full">Send Reset Link</Button></form>}<Link className="mt-4 block text-sm font-semibold text-blue-600" to="/login">Return to login</Link></Card></div>;
}

export function NotFoundPage({ user }) {
  return <div className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-slate-950"><Card className="max-w-lg text-center"><h1 className="text-5xl font-black">404</h1><p className="mt-3 text-slate-500">This page wandered outside the school map.</p><Link to={user ? roleHome[user.role] : "/"}><Button className="mt-5">Go Back</Button></Link></Card></div>;
}

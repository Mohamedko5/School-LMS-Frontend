import { useMemo, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Award, Bell, BookOpen, CalendarDays, Check, CheckCircle2, Clock, Download, FileText, GraduationCap,
  MessageSquare, Plus, Save, Send, Settings, Star, Trash2, Upload, Users, ArrowLeft,
} from "lucide-react";
import { announcements, assignments, attendance, calendarEvents, chartSeries, courses, grades, lessons, messages, people, quizzes, resources } from "../data/mockData";
import { Badge, Button, Card, EmptyState, Input, Modal, ProgressBar, Select, StatCard, Textarea } from "../components/common/ui";
import { storage } from "../utils/storage";
import { useLanguage } from "../utils/i18n.jsx";

const roleBase = { Student: "student", Teacher: "teacher", Parent: "parent", "School Admin": "admin" };

function Page({ title, children, actions }) {
  const { t } = useLanguage();
  return <div className="min-w-0 space-y-4 sm:space-y-5"><div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"><div className="min-w-0"><h2 className="break-words text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">{title}</h2><p className="text-sm text-slate-500">{t("prototypeNote")}</p></div>{actions && <div className="flex w-full flex-wrap gap-2 sm:w-auto">{actions}</div>}</div>{children}</div>;
}

function SearchFilters({ query, setQuery, children }) {
  const { t } = useLanguage();
  return <Card><div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] [&>*]:min-w-0"><Input aria-label={t("globalSearchPlaceholder")} placeholder={t("globalSearchPlaceholder")} value={query} onChange={(e) => setQuery(e.target.value)} />{children}</div></Card>;
}

function CourseCard({ course, base = "student" }) {
  const Icon = course.icon;
  return (
    <Card className="overflow-hidden">
      <div className="mb-4 h-24 rounded-lg p-4" style={{ background: course.image }}><Icon className="text-blue-700" size={30} /></div>
      <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words font-bold">{course.name}</h3><p className="text-sm text-slate-500">{course.teacher} - {course.lessons} lessons</p></div><Badge>{course.grade}</Badge></div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{course.description}</p>
      <div className="mt-4"><ProgressBar value={course.progress} label="Progress" /></div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500"><span>{course.nextAssignment}</span><span>{course.lastActivity}</span></div>
      <Link to={`/${base}/courses/${course.id}`}><Button className="mt-4 w-full">Continue Learning</Button></Link>
    </Card>
  );
}

function AssignmentCard({ item }) {
  const days = Math.ceil((new Date(item.due) - new Date()) / 86400000);
  return <Card><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{item.title}</h3><p className="text-sm text-slate-500">{item.course} - {item.teacher}</p></div><Badge tone={item.status === "Overdue" ? "red" : item.status === "Graded" ? "green" : "amber"}>{item.status}</Badge></div><p className="mt-3 text-sm">Due {format(new Date(item.due), "MMM d, yyyy")} - {item.marks} marks - {days >= 0 ? `${days} days remaining` : "Late"}</p><Link to={`/student/assignments/${item.id}`}><Button variant="outline" className="mt-4">Open Assignment</Button></Link></Card>;
}

function QuizCard({ item }) {
  return <Card><div className="flex justify-between gap-3"><div><h3 className="font-bold">{item.title}</h3><p className="text-sm text-slate-500">{item.course}</p></div><Badge tone={item.status === "Completed" ? "green" : "blue"}>{item.status}</Badge></div><p className="mt-3 text-sm">{item.questions} questions - {item.duration} min - {item.attempts} attempt(s)</p><p className="text-sm text-slate-500">Deadline {format(new Date(item.deadline), "MMM d")}</p><Link to={`/student/quizzes/${item.id}`}><Button className="mt-4">{item.status === "Completed" ? "Review Results" : "Start Quiz"}</Button></Link></Card>;
}

export function StudentDashboard() {
  const { t, language } = useLanguage();
  const outlet = useOutletContext() || {};
  const user = outlet.user || { name: "Adam Hassan", role: "Student" };
  const firstName = user.name?.split(" ")?.[0] || "Student";
  const dashboardCourses = courses?.slice?.(0, 4) || [];
  const todaysTasks = assignments?.slice?.(0, 4)?.map((assignment, index) => ({
    ...assignment,
    action: index === 0 ? t("startHomework") : index === 1 ? t("continueLearning") : t("viewAllHomework"),
    simpleStatus: [language === "ar" ? "ابدأ" : "Start", t("continueLearning"), t("submitted"), t("late")][index] || t("continueLearning"),
  })) || [];
  const dashboardAnnouncements = announcements?.slice?.(0, 3) || [];
  const latestUpdates = [
    language === "ar" ? "تم تقييم واجب العلوم الخاص بك." : "Your Science homework was graded.",
    language === "ar" ? "تمت إضافة درس جديد في اللغة الإنجليزية." : "A new English lesson was added.",
    dashboardAnnouncements[0]?.title || (language === "ar" ? "يوم الرياضة المدرسي الخميس القادم." : "School sports day is next Thursday."),
  ];
  const nextClass = calendarEvents?.[0] || { title: "Mathematics", time: "9:00 AM", date: "Today" };

  return <Page title={t("home")} actions={null}>
    <Card className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-900 dark:to-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-200">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">{t("goodMorning")}, {firstName}</h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{t("todayIntro")}</p>
        </div>
        <Link to="/student/assignments"><Button className="w-full sm:w-auto"><FileText size={18} /> {t("viewAllHomework")}</Button></Link>
      </div>
    </Card>

    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-bold">{t("todaysTasks")}</h3>
        <Link className="text-sm font-semibold text-blue-700 dark:text-blue-200" to="/student/assignments">{t("viewAllHomework")}</Link>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {todaysTasks.map((task, index) => {
          const course = courses[index % courses.length];
          const Icon = course?.icon || BookOpen;
          return <div key={task.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200"><Icon size={24} /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-500">{task.course}</p>
              <h4 className="break-words text-base font-bold">{task.title}</h4>
              <p className="text-sm text-slate-500">{t("due")} {format(new Date(task.due), "MMM d")}</p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Badge tone={task.status === "Overdue" ? "red" : task.status === "Submitted" ? "green" : "amber"}>{task.simpleStatus}</Badge>
              <Link to={`/student/assignments/${task.id}`}><Button className="w-full sm:w-auto">{task.action}</Button></Link>
            </div>
          </div>;
        })}
      </div>
    </Card>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <Card>
        <h3 className="text-xl font-bold">{t("nextClass")}</h3>
        <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-200">{nextClass.date} - {nextClass.time}</p>
          <h4 className="mt-1 text-lg font-bold">{nextClass.title}</h4>
          <p className="mt-1 text-sm text-slate-500">{t("teacher")}: Ms. Nur Aina</p>
          <p className="text-sm text-slate-500">{t("room")}: B204</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button>{t("viewClass")}</Button>
            <Link className="inline-flex min-h-11 items-center font-semibold text-blue-700 dark:text-blue-200" to="/student/calendar">{t("viewFullCalendar")}</Link>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xl font-bold">{t("myClasses")}</h3>
          <Link className="text-sm font-semibold text-blue-700 dark:text-blue-200" to="/student/courses">{t("viewAllClasses")}</Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {dashboardCourses.map((course) => {
            const Icon = course.icon;
            return <div key={course.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950"><Icon size={22} /></div>
                <div className="min-w-0">
                  <h4 className="truncate font-bold">{course.name}</h4>
                  <p className="truncate text-sm text-slate-500">{course.teacher}</p>
                </div>
              </div>
              <div className="mt-4"><ProgressBar value={course.progress} label={language === "ar" ? "التقدم" : "Progress"} /></div>
              <Link to={`/student/courses/${course.id}`}><Button variant="outline" className="mt-4 w-full">{t("continueLearning")}</Button></Link>
            </div>;
          })}
        </div>
      </Card>
    </div>

    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-bold">{t("latestUpdates")}</h3>
        <Link className="text-sm font-semibold text-blue-700 dark:text-blue-200" to="/student/profile">{t("viewAllUpdates")}</Link>
      </div>
      <div className="space-y-3">
        {latestUpdates.slice(0, 3).map((update) => <p key={update} className="rounded-lg bg-slate-50 p-3 text-base text-slate-700 dark:bg-slate-800 dark:text-slate-200">{update}</p>)}
      </div>
    </Card>
  </Page>;
}
export function CoursesPage({ mode = "student" }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const filtered = courses.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.teacher.toLowerCase().includes(query.toLowerCase()));
  return <Page title={mode === "teacher" ? "Teacher Courses" : t("myClasses")} actions={<Button className="w-full sm:w-auto" variant="outline" onClick={() => setView(view === "grid" ? "list" : "grid")}>{view === "grid" ? "List View" : "Grid View"}</Button>}><SearchFilters query={query} setQuery={setQuery}><Select aria-label="Filter progress"><option>All progress</option><option>Active</option><option>Completed</option></Select></SearchFilters><div className={view === "grid" ? "responsive-grid" : "space-y-4"}>{filtered.map((course) => <CourseCard key={course.id} course={course} base={mode === "teacher" ? "teacher" : "student"} />)}</div></Page>;
}

export function CourseDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const course = courses.find((c) => c.id === id) || courses[0];
  const [tab, setTab] = useState("Lessons");
  const tabs = ["Lessons", t("homework"), t("tests"), t("resources")];
  return <Page title={course.name}><Card><div className="rounded-lg p-4 sm:p-6" style={{ background: course.image }}><h3 className="break-words text-2xl font-black text-slate-950 sm:text-3xl">{course.name}</h3><p className="break-words">{course.teacher} - {course.schedule}</p></div><div className="mt-5"><ProgressBar value={course.progress} label={t("courseProgress")} /></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-600 dark:text-slate-300">Next: {lessons.find((lesson) => lesson.courseId === course.id)?.title || "Continue your next lesson"}</p><Button>{t("continueLearning")}</Button></div><div className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1">{tabs.map((label) => <Button key={label} className="shrink-0" variant={tab === label ? "primary" : "outline"} onClick={() => setTab(label)}>{label}</Button>)}</div></Card>{tab === "Lessons" ? <LessonsPage embedded courseId={course.id} /> : <Card><h3 className="font-bold">{tab}</h3><p className="mt-2 text-slate-600 dark:text-slate-300">{course.description}</p></Card>}</Page>;
}

export function LessonsPage({ embedded = false, courseId }) {
  const rows = lessons.filter((l) => !courseId || l.courseId === courseId);
  const content = <div className="space-y-3">{rows.map((lesson) => <Card key={lesson.id} className="flex flex-wrap items-center justify-between gap-3"><div><Badge tone={lesson.status === "locked" ? "slate" : lesson.status === "current" ? "amber" : "green"}>{lesson.status}</Badge><h3 className="mt-2 font-bold">{lesson.title}</h3><p className="text-sm text-slate-500">{lesson.module} - {lesson.duration} - {lesson.type}</p></div><Link to={`/student/lessons/${lesson.id}`}><Button variant={lesson.status === "locked" ? "outline" : "primary"}>{lesson.status === "completed" ? "Review" : "Start"}</Button></Link></Card>)}</div>;
  return embedded ? content : <Page title="Lessons">{content}</Page>;
}

export function LessonViewer() {
  const [complete, setComplete] = useState(false);
  return <Page title="Understanding ratios"><div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]"><Card><div className="grid aspect-video min-h-40 place-items-center rounded-lg bg-slate-900 text-center text-white"><BookOpen size={48} /><p>Video lesson placeholder</p></div><h3 className="mt-5 text-lg font-bold sm:text-xl">Lesson Content</h3><p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">Ratios compare two quantities. Today you will practice identifying equivalent ratios, simplifying them, and explaining your thinking in complete sentences.</p><div className="mt-5 grid gap-3 sm:flex sm:flex-wrap"><Button variant="outline">Previous</Button><Button onClick={() => setComplete(true)}><CheckCircle2 size={18} /> Mark as Complete</Button><Button variant="outline">Next Lesson</Button></div>{complete && <p className="mt-4 rounded-lg bg-green-50 p-3 text-green-700">Great work. This lesson is marked complete.</p>}</Card><Card><h3 className="font-bold">Notes & Resources</h3><Textarea className="mt-3" placeholder="Write your private lesson notes..." /><Button variant="outline" className="mt-3 w-full"><Download size={18} /> Ratio worksheet PDF</Button><div className="mt-5"><h4 className="font-semibold">Knowledge Check</h4><p className="mt-2 text-sm">Which ratio is equivalent to 2:3?</p><div className="mt-2 grid gap-2">{["4:6", "3:4", "5:6"].map((x) => <Button key={x} variant="outline">{x}</Button>)}</div></div></Card></div></Page>;
}

export function AssignmentsPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const rows = assignments.filter((a) => (status === "All" || a.status === status) && a.title.toLowerCase().includes(query.toLowerCase()));
  return <Page title={t("homework")}><SearchFilters query={query} setQuery={setQuery}><Select value={status} onChange={(e) => setStatus(e.target.value)}>{["All", "Due soon", "Submitted", "Graded", "Overdue"].map((s) => <option key={s}>{s}</option>)}</Select></SearchFilters><div className="responsive-grid">{rows.map((item) => <AssignmentCard key={item.id} item={item} />)}</div></Page>;
}

export function AssignmentDetails() {
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return <Page title="Assignment Submission"><div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]"><Card><h3 className="break-words text-xl font-bold">Science lab report</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Explain your experiment, observations, data table, and conclusion. Include one paragraph about how you improved your method.</p><div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Late submissions may require a teacher note.</div><h4 className="mt-5 font-bold">Rubric</h4><div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">{["Method 10", "Data 15", "Conclusion 15"].map((r) => <Badge key={r}>{r} marks</Badge>)}</div></Card><Card><Textarea label="Text answer" placeholder="Type or paste your response..." /><label className="mt-4 grid w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-slate-300 p-5 text-center dark:border-slate-700 sm:p-6"><Upload /><span className="mt-2 break-words text-sm">Upload PDF, DOCX, PNG under 10MB</span><input className="hidden" type="file" onChange={(e) => setFile(e.target.files?.[0])} /></label>{file && <p className="mt-3 break-words rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">{file.name} ready for preview</p>}<div className="mt-4 grid gap-2 sm:flex"><Button variant="outline"><Save size={18} /> Save Draft</Button><Button onClick={() => setConfirm(true)}>Submit</Button></div>{submitted && <p className="mt-3 rounded-lg bg-green-50 p-3 text-green-700">Assignment submitted successfully.</p>}</Card></div><Modal open={confirm} title="Submit assignment?" onClose={() => setConfirm(false)}><p className="text-sm text-slate-500">Please confirm that your answer and file are ready for your teacher to review.</p><div className="mt-5 grid gap-2 sm:flex sm:justify-end"><Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button><Button onClick={() => { setSubmitted(true); setConfirm(false); }}>Confirm Submit</Button></div></Modal></Page>;
}

export function QuizzesPage() {
  const { t } = useLanguage();
  return <Page title={t("tests")}><div className="responsive-grid">{quizzes.map((q) => <QuizCard key={q.id} item={q} />)}</div></Page>;
}

export function QuizInterface() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const questions = ["Which fraction equals 0.5?", "True or false: A force can change motion.", "Explain one way to revise safely online."];
  if (done) return <Page title="Quiz Results"><Card><h3 className="text-3xl font-black text-green-700">Score: 86%</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Strong result. Review question 2 feedback before your next attempt.</p><Button className="mt-5">View Correct Answers</Button></Card></Page>;
  const navPanel = <Card><h3 className="font-bold">Question Navigation</h3><div className="mt-3 grid grid-cols-5 gap-2">{questions.map((_, i) => <Button key={i} variant={i === index ? "primary" : "outline"} onClick={() => { setIndex(i); setShowNav(false); }}>{i + 1}</Button>)}</div><Button variant="outline" className="mt-4 w-full">Mark for Review</Button></Card>;
  return <Page title="Fractions Checkpoint" actions={<Badge tone="amber"><Clock size={14} /> 18:42 left</Badge>}><div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_280px]"><Card><ProgressBar value={((index + 1) / questions.length) * 100} label={`Question ${index + 1} of ${questions.length}`} /><div className="mt-4 xl:hidden"><Button variant="outline" className="w-full" onClick={() => setShowNav(!showNav)}>Question Navigation</Button></div>{showNav && <div className="mt-4 xl:hidden">{navPanel}</div>}<h3 className="mt-6 text-lg font-bold sm:text-xl">{questions[index]}</h3><div className="mt-4 grid gap-2">{["1/2", "2/3", "3/4", "Short written answer"].map((a) => <Button key={a} variant="outline" className="justify-start text-left">{a}</Button>)}</div><div className="mt-6 grid gap-2 sm:flex sm:justify-between"><Button variant="outline" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</Button>{index === questions.length - 1 ? <Button onClick={() => setDone(true)}>Submit Quiz</Button> : <Button onClick={() => setIndex(index + 1)}>Next</Button>}</div><p className="mt-3 text-sm text-teal-600">Auto-saved just now</p></Card><div className="hidden xl:block">{navPanel}</div></div></Page>;
}

export function GradesPage() {
  const { t } = useLanguage();
  const attendanceRecords = attendance || [];
  const presentDays = attendanceRecords.filter((item) => item?.status === "Present").length;
  const attendancePercent = attendanceRecords.length ? Math.round((presentDays / attendanceRecords.length) * 100) : 0;
  return <Page title={t("results")}><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"><StatCard icon={Award} label={t("overallAverage")} value="84%" detail="Good" /><StatCard icon={CalendarDays} label={t("attendance")} value={`${attendancePercent}%`} tone="teal" detail={`${presentDays} ${t("presentRecords")} ${attendanceRecords.length}`} /><StatCard icon={Download} label="Report" value="Ready" tone="amber" /></div><Card><h3 className="mb-3 font-bold">Recent trend</h3><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><LineChart data={grades[0].trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis width={32} /><Tooltip /><Line dataKey="score" stroke="#2563eb" strokeWidth={3} /></LineChart></ResponsiveContainer></div><Button variant="outline" className="mt-4">View detailed report</Button></Card><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{grades.map((g) => <Card key={g.subject}><div className="flex flex-wrap justify-between gap-2"><b>{g.subject}</b><Badge tone={g.average >= 80 ? "green" : "amber"}>{g.average}%</Badge></div><p className="mt-2 text-sm text-slate-500">{g.feedback}</p></Card>)}</div></Page>;
}

export function AttendancePage({ teacher = false }) {
  const [records, setRecords] = useState(storage.get("attendance-demo", attendance.slice(0, 10)));
  const update = (i, status) => { const next = [...records]; next[i] = { ...next[i], status }; setRecords(next); storage.set("attendance-demo", next); };
  return <Page title={teacher ? "Attendance Management" : "Attendance"} actions={teacher && <Button className="w-full sm:w-auto" onClick={() => setRecords(records.map((r) => ({ ...r, status: "Present" })))}><Check size={18} /> Mark All Present</Button>}><div className="dashboard-grid"><StatCard icon={CheckCircle2} label="Present" value="24" /><StatCard icon={Clock} label="Late" value="2" tone="amber" /><StatCard icon={CalendarDays} label="Absent" value="1" /><StatCard icon={Award} label="Rate" value="94%" tone="teal" /></div><Card><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartSeries}><XAxis dataKey="name" /><YAxis width={32} /><Tooltip /><Bar dataKey="activity" fill="#14b8a6" /></BarChart></ResponsiveContainer></div></Card><div className="table-scroll"><table className="w-full bg-white text-sm dark:bg-slate-900"><tbody>{records.map((r, i) => <tr key={r.date} className="border-b border-slate-100 dark:border-slate-800"><td className="p-3">{format(new Date(r.date), "MMM d")}</td><td className="p-3">{r.subject}</td><td className="p-3">{teacher ? <Select value={r.status} onChange={(e) => update(i, e.target.value)}>{["Present", "Absent", "Late", "Excused"].map((s) => <option key={s}>{s}</option>)}</Select> : <Badge tone={r.status === "Present" ? "green" : "amber"}>{r.status}</Badge>}</td></tr>)}</tbody></table></div></Page>;
}

export function CalendarPage() {
  const [selected, setSelected] = useState(calendarEvents[0]);
  return <Page title="Calendar" actions={<div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto"><Button variant="outline">Today</Button><Button variant="outline">Month</Button><Button variant="outline">Week</Button><Button variant="outline">Agenda</Button></div>}><div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]"><Card><div className="hidden grid-cols-7 gap-2 md:grid">{Array.from({ length: 35 }, (_, i) => <button key={i} className="min-h-24 min-w-0 rounded-lg border border-slate-200 p-2 text-left hover:bg-blue-50 dark:border-slate-800 dark:hover:bg-slate-800"><b>{i + 1}</b>{calendarEvents.filter((e) => Number(e.date.slice(-2)) === i + 1).map((e) => <p key={e.id} className="mt-1 truncate rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">{e.title}</p>)}</button>)}</div><div className="space-y-3 md:hidden">{calendarEvents.map((e) => <button key={e.id} onClick={() => setSelected(e)} className="block w-full rounded-lg border border-slate-200 p-3 text-left dark:border-slate-800"><b className="break-words">{e.title}</b><p className="text-sm text-slate-500">{e.date} - {e.time}</p></button>)}</div></Card><Card><h3 className="font-bold">Event Details</h3>{calendarEvents.map((e) => <button key={e.id} onClick={() => setSelected(e)} className="mt-3 block w-full rounded-lg bg-slate-50 p-3 text-left dark:bg-slate-800"><b className="break-words">{e.title}</b><p className="text-sm text-slate-500">{e.type} - {e.time}</p></button>)}<p className="mt-5 break-words text-sm">Selected: <b>{selected.title}</b></p></Card></div></Page>;
}

export function AnnouncementsPage() {
  return <Page title="Announcements"><div className="grid gap-4 md:grid-cols-2">{announcements.map((a) => <Card key={a.id}><div className="flex justify-between"><Badge tone={a.priority === "Priority" ? "red" : a.priority === "Pinned" ? "amber" : "blue"}>{a.priority}</Badge><span className="text-sm text-slate-500">{format(new Date(a.date), "MMM d")}</span></div><h3 className="mt-3 font-bold">{a.title}</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{a.body}</p></Card>)}</div></Page>;
}

export function MessagesPage() {
  const [active, setActive] = useState(messages[0]);
  const [draft, setDraft] = useState("");
  const [mobilePanel, setMobilePanel] = useState("list");
  return <Page title="Messages"><div className="grid min-h-[calc(100dvh-12rem)] grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]"><Card className={`${mobilePanel === "thread" ? "hidden lg:block" : ""}`}>{messages.map((m) => <button key={m.id} onClick={() => { setActive(m); setMobilePanel("thread"); }} className="mb-2 block w-full rounded-lg p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800"><b className="break-words">{m.from}</b><p className="text-sm text-slate-500">{m.role} - {m.time}</p></button>)}</Card><Card className={`${mobilePanel === "list" ? "hidden lg:flex" : "flex"} min-h-[420px] flex-col`}><div className="flex items-center gap-2"><Button variant="ghost" className="px-2 lg:hidden" onClick={() => setMobilePanel("list")}><ArrowLeft size={18} /></Button><h3 className="min-w-0 break-words font-bold">{active.from}</h3></div><div className="my-4 flex-1 rounded-lg bg-slate-50 p-3 dark:bg-slate-800 sm:p-4"><p className="max-w-md break-words rounded-lg bg-white p-3 shadow-sm dark:bg-slate-900">{active.text}</p></div><div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"><Input aria-label="Message" placeholder="Write a respectful school message" value={draft} onChange={(e) => setDraft(e.target.value)} /><Button onClick={() => setDraft("")}><Send size={18} /></Button></div></Card></div></Page>;
}

export function ResourcesPage() {
  return <Page title="Learning Resources"><div className="responsive-grid">{resources.map((r) => <Card key={r.id}><Badge tone="teal">{r.type}</Badge><h3 className="mt-3 break-words font-bold">{r.title}</h3><p className="text-sm text-slate-500">{r.category}</p><Button variant="outline" className="mt-4 w-full"><Download size={18} /> Open</Button></Card>)}</div></Page>;
}

export function ProfilePage() {
  const { t } = useLanguage();
  return <Page title={t("profile")}><div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]"><Card className="text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700 sm:h-24 sm:w-24">A</div><h3 className="mt-4 break-words text-xl font-bold">Adam Hassan</h3><p className="text-slate-500">Grade 8A - ST2026014</p><Badge tone="green">Active learner</Badge></Card><div className="space-y-4"><Card><h3 className="font-bold">{t("attendanceSummary")}</h3><div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3"><StatCard icon={CalendarDays} label={t("attendance")} value="94%" /><StatCard icon={CheckCircle2} label="Present" value="24" tone="teal" /><StatCard icon={Clock} label="Late" value="2" tone="amber" /></div></Card><Card><h3 className="font-bold">{t("achievementBadges")}</h3><div className="mt-3 flex flex-wrap gap-2">{[t("steadyStudy"), t("kindCommunicator"), t("quizReady"), t("attendanceStar")].map((badge) => <Badge key={badge} tone="teal">{badge}</Badge>)}</div></Card><Card><h3 className="font-bold">{t("settings")}</h3><div className="mt-4 grid gap-2 sm:flex sm:flex-wrap"><Link to="/student/settings"><Button variant="outline">{t("settings")}</Button></Link><Button variant="outline">{t("notifications")}</Button></div></Card></div></div></Page>;
}

export function AchievementsPage() {
  const badges = ["Steady Study", "Course Finisher", "Quiz Ready", "Kind Communicator", "Attendance Star", "Curious Reader"];
  return <Page title="Achievements"><Card><ProgressBar value={68} label="Progress toward next healthy habit badge" /></Card><div className="responsive-grid">{badges.map((b, i) => <Card key={b} className={i > 3 ? "opacity-60" : ""}><Award className="text-teal-600" /><h3 className="mt-3 break-words font-bold">{b}</h3><p className="text-sm text-slate-500">{i > 3 ? "Locked achievement" : "Unlocked through consistent effort."}</p></Card>)}</div></Page>;
}

export function TeacherDashboard() {
  return <Page title="Teacher Dashboard" actions={<Button className="w-full sm:w-auto"><Plus size={18} /> Create</Button>}><div className="dashboard-grid"><StatCard icon={Users} label="Students" value="136" /><StatCard icon={FileText} label="Pending grading" value="18" tone="amber" /><StatCard icon={BookOpen} label="Courses" value="5" /><StatCard icon={CalendarDays} label="Lessons today" value="4" tone="teal" /></div><Card><h3 className="mb-3 font-bold">Class Performance</h3><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><BarChart data={grades}><XAxis dataKey="subject" hide /><YAxis width={32} /><Tooltip /><Bar dataKey="average" fill="#2563eb" /></BarChart></ResponsiveContainer></div></Card><div className="grid grid-cols-1 gap-4 xl:grid-cols-2"><Submissions compact /><AnnouncementsPage /></div></Page>;
}

export function ManagementPage({ type = "course" }) {
  const [open, setOpen] = useState(false);
  return <Page title={type === "quiz" ? "Quiz Builder" : type === "lesson" ? "Lesson Creation" : type === "assignment" ? "Assignment Creation" : "Course Management"} actions={<Button className="w-full sm:w-auto" onClick={() => setOpen(true)}><Plus size={18} /> Add Item</Button>}><Card><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><Input label="Title" placeholder="Enter title" /><Select label="Course"><option>Mathematics Grade 8A</option></Select><Textarea label="Instructions or content" /><Input label="Due date / duration" type="date" /></div><div className="mt-4 grid gap-2 sm:flex sm:flex-wrap"><Button variant="outline">Save Draft</Button><Button>Publish</Button><Button variant="outline">Preview</Button></div></Card><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{lessons.slice(0, 6).map((l) => <Card key={l.id}><div className="flex flex-wrap justify-between gap-2"><b className="break-words">{l.title}</b><Badge>{l.status}</Badge></div><p className="mt-2 text-sm text-slate-500">Drag to reorder, edit, publish, or unpublish in this frontend prototype.</p><div className="mt-3 grid gap-2 sm:flex"><Button variant="outline">Edit</Button><Button variant="danger"><Trash2 size={16} /> Delete</Button></div></Card>)}</div><Modal open={open} title="Create item" onClose={() => setOpen(false)}><Textarea label="Details" /><Button className="mt-4 w-full sm:w-auto" onClick={() => setOpen(false)}>Save</Button></Modal></Page>;
}

export function Submissions({ compact = false }) {
  const content = <Card><h3 className="font-bold">Submission Management</h3><div className="table-scroll mt-4"><table className="w-full bg-white text-sm dark:bg-slate-900"><tbody>{people.students.slice(0, compact ? 5 : 12).map((s, i) => <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800"><td className="p-3">{s.name}</td><td className="p-3"><Badge tone={i % 3 ? "green" : "amber"}>{i % 3 ? "Submitted" : "Missing"}</Badge></td><td className="p-3"><Input aria-label="Grade" defaultValue={i % 3 ? 82 + i : ""} /></td><td className="p-3"><Button variant="outline">Feedback</Button></td></tr>)}</tbody></table></div></Card>;
  return compact ? content : <Page title="Submissions">{content}</Page>;
}

export function Gradebook() {
  return <Page title="Gradebook"><div className="table-scroll"><table className="w-full bg-white text-sm dark:bg-slate-900"><thead><tr>{["Student", "Assignment", "Quiz", "Average", "Status"].map((h) => <th key={h} className="p-3 text-left">{h}</th>)}</tr></thead><tbody>{people.students.map((s, i) => <tr key={s.id} className="border-t border-slate-100 dark:border-slate-800"><td className="p-3">{s.name}</td><td className="p-3">{70 + i}%</td><td className="p-3">{76 + i}%</td><td className="p-3 font-bold">{s.average}%</td><td className="p-3"><Badge tone={s.average > 80 ? "green" : "amber"}>{s.status}</Badge></td></tr>)}</tbody></table></div></Page>;
}

export function StudentsPage() {
  return <Page title="Students"><div className="responsive-grid">{people.students.map((s) => <Card key={s.id}><h3 className="break-words font-bold">{s.name}</h3><p className="text-sm text-slate-500">{s.grade}{s.className} - {s.id}</p><ProgressBar value={s.average} label="Performance" /><p className="mt-3 text-sm">Attendance {s.attendance}%</p></Card>)}</div></Page>;
}

export function ParentDashboard() {
  return <Page title="Parent Dashboard" actions={<div className="w-full sm:w-72"><Select aria-label="Child selector"><option>Adam Hassan - Grade 8A</option><option>Sara Hassan - Grade 5B</option></Select></div>}><div className="dashboard-grid"><StatCard icon={Award} label="Progress" value="84%" /><StatCard icon={CalendarDays} label="Attendance" value="94%" /><StatCard icon={FileText} label="Due soon" value="3" tone="amber" /><StatCard icon={MessageSquare} label="Teacher notes" value="5" tone="teal" /></div><div className="grid grid-cols-1 gap-4 xl:grid-cols-2"><GradesPage /><AnnouncementsPage /></div></Page>;
}

export function AdminDashboard() {
  return <Page title="Admin Dashboard" actions={<Button className="w-full sm:w-auto"><Plus size={18} /> Quick Action</Button>}><div className="dashboard-grid"><StatCard icon={Users} label="Students" value="620" /><StatCard icon={GraduationCap} label="Teachers" value="42" /><StatCard icon={BookOpen} label="Active courses" value="58" /><StatCard icon={CalendarDays} label="Attendance today" value="96%" tone="teal" /></div><Card><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartSeries}><XAxis dataKey="name" /><YAxis width={32} /><Tooltip /><Area dataKey="activity" fill="#ccfbf1" stroke="#14b8a6" /></AreaChart></ResponsiveContainer></div></Card><div className="grid grid-cols-1 gap-4 md:grid-cols-3"><Card><h3 className="font-bold">Storage Usage</h3><ProgressBar value={61} label="Files" /></Card><Card><h3 className="font-bold">Important Alerts</h3><p className="mt-2 text-sm text-slate-500">3 accounts need verification.</p></Card><Card><h3 className="font-bold">Recent Registrations</h3><p className="mt-2 text-sm text-slate-500">12 users added this week.</p></Card></div></Page>;
}

export function UsersManagement() {
  const [tab, setTab] = useState("Students");
  const data = tab === "Students" ? people.students : tab === "Teachers" ? people.teachers : people.parents;
  return <Page title="User Management" actions={<div className="grid w-full gap-2 sm:flex sm:w-auto"><Button><Plus size={18} /> Add User</Button><Button variant="outline">Export</Button></div>}><div className="flex flex-wrap gap-2">{["Students", "Teachers", "Parents", "Administrators"].map((t) => <Button key={t} variant={tab === t ? "primary" : "outline"} onClick={() => setTab(t)}>{t}</Button>)}</div><div className="table-scroll"><table className="w-full bg-white text-sm dark:bg-slate-900"><tbody>{data.map((u) => <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800"><td className="p-3 font-semibold">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3"><Badge tone="green">Active</Badge></td><td className="p-3"><Button variant="outline">Edit</Button></td></tr>)}</tbody></table></div></Page>;
}

export function AddStudentForm() {
  return <Page title="Add Student"><Card><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><Input label="Full name" /><Input label="Student ID" /><Input label="Date of birth" type="date" /><Select label="Gender"><option>Female</option><option>Male</option><option>Prefer not to say</option></Select><Input label="Email" /><Input label="Phone" /><Select label="Grade level"><option>Grade 8</option><option>Grade 5</option></Select><Input label="Classroom" /><Textarea label="Parent information" /><Textarea label="Address" /><Input label="Enrollment date" type="date" /><Select label="Account status"><option>Active</option><option>Pending</option></Select></div><Button className="mt-5 w-full sm:w-auto">Create Student</Button></Card></Page>;
}

export function AdminSimplePage({ title }) {
  return <Page title={title}><Card><div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto]"><Input label="Search" placeholder="Find records" /><Select label="Filter"><option>All</option><option>Active</option></Select><Button className="self-end"><Plus size={18} /> Add</Button></div></Card><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{["Academic year 2026", "Term 1", "Grade 8A", "Mathematics course", "Teacher assignment", "Student enrollment"].map((item) => <Card key={item}><b className="break-words">{item}</b><p className="mt-2 text-sm text-slate-500">Manage details, status, schedules, and relationships in this frontend-only interface.</p></Card>)}</div></Page>;
}

export function ReportsPage() {
  return <Page title="Reports"><div className="responsive-grid">{["Student performance", "Attendance", "Assignment completion", "Quiz results", "Teacher activity", "Course engagement"].map((r) => <Card key={r}><h3 className="break-words font-bold">{r}</h3><div className="h-32 w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: "A", value: 70 }, { name: "B", value: 30 }]} dataKey="value" outerRadius={45}>{["#2563eb", "#14b8a6"].map((c) => <Cell key={c} fill={c} />)}</Pie></PieChart></ResponsiveContainer></div><Button variant="outline" className="w-full">Export</Button></Card>)}</div></Page>;
}

export function AuditLog() {
  const rows = ["Teacher updated a grade", "Admin created a student", "Student submitted an assignment", "Teacher recorded attendance"];
  return <Page title="Audit Log"><div className="table-scroll"><table className="w-full bg-white text-sm dark:bg-slate-900"><tbody>{rows.concat(rows).map((r, i) => <tr key={`${r}-${i}`} className="border-b border-slate-100 dark:border-slate-800"><td className="p-3">{people.teachers[i % people.teachers.length].name}</td><td className="p-3">{r}</td><td className="p-3">Jul {17 - i}, 2026 09:{i}0</td><td className="p-3">LMS</td><td className="p-3">Chrome</td><td className="p-3"><Badge tone="green">Success</Badge></td></tr>)}</tbody></table></div></Page>;
}

export function HelpCenter() {
  return <Page title="Help Center"><SearchFilters query="" setQuery={() => {}} /><div className="responsive-grid">{["How do I submit work?", "How do teachers grade?", "How can parents contact teachers?", "Accessibility settings", "Notification guide", "Contact support"].map((q) => <Card key={q}><h3 className="break-words font-bold">{q}</h3><p className="mt-2 text-sm text-slate-500">Clear, age-friendly guidance for using EduBridge confidently.</p></Card>)}</div></Page>;
}

export function SettingsPage() {
  const tabs = ["Profile", "Account", "Password", "Notifications", "Appearance", "Language", "Accessibility"];
  const [tab, setTab] = useState(tabs[0]);
  return <Page title="Settings"><div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">{tabs.map((t) => <Button key={t} className="shrink-0" variant={tab === t ? "primary" : "outline"} onClick={() => setTab(t)}>{t}</Button>)}</div><Card><h3 className="font-bold">{tab}</h3><div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"><Input label={`${tab} preference`} /><Select label="Status"><option>Enabled</option><option>Disabled</option></Select></div><Button className="mt-4 w-full sm:w-auto"><Settings size={18} /> Save Settings</Button></Card></Page>;
}

export function GenericRolePage() {
  const { user } = useOutletContext() || { user: { role: "demo" } };
  return <EmptyState title="Ready for demo" text={`This ${user.role} page is connected to the authenticated layout and can be extended with more school-specific details.`} />;
}

export function routeBaseFor(role) {
  return roleBase[role] || "student";
}


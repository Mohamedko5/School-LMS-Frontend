import { useMemo, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Award, Bell, BookOpen, CalendarDays, Check, CheckCircle2, Clock, Download, FileText, GraduationCap,
  MessageSquare, Plus, Save, Search, Send, Settings, Star, Trash2, Upload, Users,
} from "lucide-react";
import { announcements, assignments, attendance, calendarEvents, chartSeries, courses, grades, lessons, messages, people, quizzes, resources } from "../data/mockData";
import { Badge, Button, Card, EmptyState, Input, Modal, ProgressBar, Select, StatCard, Textarea } from "../components/common/ui";
import { storage } from "../utils/storage";
import { useLanguage } from "../utils/i18n.jsx";

const roleBase = { Student: "student", Teacher: "teacher", Parent: "parent", "School Admin": "admin" };

function Page({ title, children, actions }) {
  const { t } = useLanguage();
  return <div className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h2><p className="text-sm text-slate-500">{t("prototypeNote")}</p></div>{actions}</div>{children}</div>;
}

function SearchFilters({ query, setQuery, children }) {
  const { t } = useLanguage();
  return <Card><div className="grid gap-3 md:grid-cols-[1fr_auto_auto]"><Input aria-label={t("globalSearchPlaceholder")} placeholder={t("globalSearchPlaceholder")} value={query} onChange={(e) => setQuery(e.target.value)} />{children}</div></Card>;
}

function CourseCard({ course, base = "student" }) {
  const Icon = course.icon;
  return (
    <Card className="overflow-hidden">
      <div className="mb-4 h-24 rounded-lg p-4" style={{ background: course.image }}><Icon className="text-blue-700" size={30} /></div>
      <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{course.name}</h3><p className="text-sm text-slate-500">{course.teacher} - {course.lessons} lessons</p></div><Badge>{course.grade}</Badge></div>
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
  const dashboardCourses = courses?.slice?.(0, 4) || [];
  const dueSoon = assignments?.slice?.(0, 4) || [];
  const upcomingQuizzes = quizzes?.slice?.(0, 3) || [];
  const recentGrades = grades?.slice?.(0, 4) || [];
  const attendanceRecords = attendance || [];
  const dashboardAnnouncements = announcements?.slice?.(0, 3) || [];
  const weeklyActivity = chartSeries || [];
  const presentDays = attendanceRecords.filter((item) => item?.status === "Present").length;
  const attendancePercent = attendanceRecords.length ? Math.round((presentDays / attendanceRecords.length) * 100) : 0;

  const badgeLabels = [t("steadyStudy"), t("kindCommunicator"), t("quizReady"), t("attendanceStar")];

  return <Page title={`${t("goodMorning")}, ${user.name}`} actions={<Button><Plus size={18} /> {t("quickNote")}</Button>}>
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-200">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{t("readyStudy")}</h3>
          <p className="mt-1 text-sm text-slate-500">{t("smallSteps")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline"><BookOpen size={18} /> {t("continueLesson")}</Button>
          <Button variant="outline"><FileText size={18} /> {t("submitWork")}</Button>
          <Button variant="outline"><MessageSquare size={18} /> {t("askTeacher")}</Button>
        </div>
      </div>
    </Card>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={BookOpen} label={t("dailyProgress")} value="72%" detail={t("dailyProgressDetail")} />
      <StatCard icon={Star} label={t("studyStreak")} value={language === "ar" ? "12 يومًا" : "12 days"} tone="teal" detail={t("studyStreakDetail")} />
      <StatCard icon={Award} label={t("overallAverage")} value="84%" detail={t("overallAverageDetail")} />
      <StatCard icon={CalendarDays} label={t("attendance")} value={`${attendancePercent}%`} tone="amber" detail={t("attendanceDetail")} />
    </div>
    <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
      <Card><h3 className="mb-4 font-bold">{t("weeklyActivity")}</h3><ResponsiveContainer width="100%" height={260}><AreaChart data={weeklyActivity}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area type="monotone" dataKey="study" stroke="#2563eb" fill="#bfdbfe" /></AreaChart></ResponsiveContainer></Card>
      <Card><h3 className="mb-4 font-bold">{t("upcomingClasses")}</h3>{(calendarEvents || []).map((e) => <div key={e.id} className="mb-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><b>{e.title}</b><p className="text-sm text-slate-500">{e.date} - {e.time}</p></div>)}</Card>
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      <Card><h3 className="mb-3 font-bold">{t("courseProgress")}</h3>{dashboardCourses.map((course) => <div key={course.id} className="mb-3"><ProgressBar value={course.progress || 0} label={course.name || "Course"} /></div>)}</Card>
      <Card><h3 className="mb-3 font-bold">{t("assignmentsDueSoon")}</h3>{dueSoon.map((a) => <p key={a.id} className="border-b border-slate-100 py-2 text-sm dark:border-slate-800">{a.title} - {format(new Date(a.due), "MMM d")}</p>)}</Card>
      <Card><h3 className="mb-3 font-bold">{t("upcomingQuizzes")}</h3>{upcomingQuizzes.map((quiz) => <p key={quiz.id} className="border-b border-slate-100 py-2 text-sm dark:border-slate-800">{quiz.title} - {quiz.duration} min</p>)}</Card>
      <Card><h3 className="mb-3 font-bold">{t("recentGrades")}</h3>{recentGrades.map((g) => <p key={g.subject} className="flex justify-between py-2 text-sm"><span>{g.subject}</span><b>{g.average}%</b></p>)}</Card>
      <Card><h3 className="mb-3 font-bold">{t("attendanceSummary")}</h3><ProgressBar value={attendancePercent} label={t("presentDays")} /><p className="mt-3 text-sm text-slate-500">{presentDays} {t("presentRecords")} {attendanceRecords.length}</p></Card>
      <Card><h3 className="mb-3 font-bold">{t("announcements")}</h3>{dashboardAnnouncements.map((item) => <p key={item.id} className="border-b border-slate-100 py-2 text-sm dark:border-slate-800">{item.title}</p>)}</Card>
      <Card className="lg:col-span-3"><h3 className="mb-3 font-bold">{t("achievementBadges")}</h3><div className="flex flex-wrap gap-2">{badgeLabels.map((b) => <Badge key={b} tone="teal">{b}</Badge>)}</div></Card>
    </div>
  </Page>;
}

export function CoursesPage({ mode = "student" }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const filtered = courses.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.teacher.toLowerCase().includes(query.toLowerCase()));
  return <Page title={mode === "teacher" ? "Teacher Courses" : "My Courses"} actions={<Button variant="outline" onClick={() => setView(view === "grid" ? "list" : "grid")}>{view === "grid" ? "List View" : "Grid View"}</Button>}><SearchFilters query={query} setQuery={setQuery}><Select aria-label="Filter progress"><option>All progress</option><option>In progress</option><option>Almost complete</option></Select><Select aria-label="Sort courses"><option>Sort by recent</option><option>Sort by progress</option></Select></SearchFilters><div className={view === "grid" ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>{filtered.map((course) => <CourseCard key={course.id} course={course} base={mode === "teacher" ? "teacher" : "student"} />)}</div></Page>;
}

export function CourseDetails() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id) || courses[0];
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Lessons", "Assignments", "Quizzes", "Resources", "Discussion"];
  return <Page title={course.name}><Card><div className="rounded-lg p-6" style={{ background: course.image }}><h3 className="text-3xl font-black text-slate-950">{course.name}</h3><p>{course.teacher} - {course.schedule}</p></div><div className="mt-5"><ProgressBar value={course.progress} label="Course progress" /></div><div className="mt-5 flex flex-wrap gap-2">{tabs.map((t) => <Button key={t} variant={tab === t ? "primary" : "outline"} onClick={() => setTab(t)}>{t}</Button>)}</div></Card>{tab === "Lessons" ? <LessonsPage embedded courseId={course.id} /> : <Card><h3 className="font-bold">{tab}</h3><p className="mt-2 text-slate-600 dark:text-slate-300">{course.description}. Learning objectives include confident practice, clear explanations, reflection, and steady weekly progress.</p><div className="mt-4 grid gap-3 md:grid-cols-3"><StatCard icon={BookOpen} label="Lessons" value={course.lessons} /><StatCard icon={FileText} label="Assignments" value="4" /><StatCard icon={MessageSquare} label="Discussion posts" value="18" /></div></Card>}</Page>;
}

export function LessonsPage({ embedded = false, courseId }) {
  const rows = lessons.filter((l) => !courseId || l.courseId === courseId);
  const content = <div className="space-y-3">{rows.map((lesson) => <Card key={lesson.id} className="flex flex-wrap items-center justify-between gap-3"><div><Badge tone={lesson.status === "locked" ? "slate" : lesson.status === "current" ? "amber" : "green"}>{lesson.status}</Badge><h3 className="mt-2 font-bold">{lesson.title}</h3><p className="text-sm text-slate-500">{lesson.module} - {lesson.duration} - {lesson.type}</p></div><Link to={`/student/lessons/${lesson.id}`}><Button variant={lesson.status === "locked" ? "outline" : "primary"}>{lesson.status === "completed" ? "Review" : "Start"}</Button></Link></Card>)}</div>;
  return embedded ? content : <Page title="Lessons">{content}</Page>;
}

export function LessonViewer() {
  const [complete, setComplete] = useState(false);
  return <Page title="Understanding ratios"><div className="grid gap-4 xl:grid-cols-[1fr_320px]"><Card><div className="grid h-64 place-items-center rounded-lg bg-slate-900 text-white"><BookOpen size={48} /><p>Video lesson placeholder</p></div><h3 className="mt-5 text-xl font-bold">Lesson Content</h3><p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">Ratios compare two quantities. Today you will practice identifying equivalent ratios, simplifying them, and explaining your thinking in complete sentences.</p><div className="mt-5 flex flex-wrap gap-3"><Button variant="outline">Previous</Button><Button onClick={() => setComplete(true)}><CheckCircle2 size={18} /> Mark as Complete</Button><Button variant="outline">Next Lesson</Button></div>{complete && <p className="mt-4 rounded-lg bg-green-50 p-3 text-green-700">Great work. This lesson is marked complete.</p>}</Card><Card><h3 className="font-bold">Notes & Resources</h3><Textarea className="mt-3" placeholder="Write your private lesson notes..." /><Button variant="outline" className="mt-3"><Download size={18} /> Ratio worksheet PDF</Button><div className="mt-5"><h4 className="font-semibold">Knowledge Check</h4><p className="mt-2 text-sm">Which ratio is equivalent to 2:3?</p><div className="mt-2 grid gap-2">{["4:6", "3:4", "5:6"].map((x) => <Button key={x} variant="outline">{x}</Button>)}</div></div></Card></div></Page>;
}

export function AssignmentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const rows = assignments.filter((a) => (status === "All" || a.status === status) && a.title.toLowerCase().includes(query.toLowerCase()));
  return <Page title="Assignments"><SearchFilters query={query} setQuery={setQuery}><Select value={status} onChange={(e) => setStatus(e.target.value)}>{["All", "Due soon", "Submitted", "Graded", "Overdue"].map((s) => <option key={s}>{s}</option>)}</Select></SearchFilters><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{rows.map((item) => <AssignmentCard key={item.id} item={item} />)}</div></Page>;
}

export function AssignmentDetails() {
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return <Page title="Assignment Submission"><div className="grid gap-4 xl:grid-cols-[1fr_360px]"><Card><h3 className="text-xl font-bold">Science lab report</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Explain your experiment, observations, data table, and conclusion. Include one paragraph about how you improved your method.</p><div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Late submissions may require a teacher note.</div><h4 className="mt-5 font-bold">Rubric</h4><div className="mt-2 grid gap-2 md:grid-cols-3">{["Method 10", "Data 15", "Conclusion 15"].map((r) => <Badge key={r}>{r} marks</Badge>)}</div></Card><Card><Textarea label="Text answer" placeholder="Type or paste your response..." /><label className="mt-4 grid cursor-pointer place-items-center rounded-lg border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-700"><Upload /><span className="mt-2 text-sm">Upload PDF, DOCX, PNG under 10MB</span><input className="hidden" type="file" onChange={(e) => setFile(e.target.files?.[0])} /></label>{file && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">{file.name} ready for preview</p>}<div className="mt-4 flex gap-2"><Button variant="outline"><Save size={18} /> Save Draft</Button><Button onClick={() => setConfirm(true)}>Submit</Button></div>{submitted && <p className="mt-3 rounded-lg bg-green-50 p-3 text-green-700">Assignment submitted successfully.</p>}</Card></div><Modal open={confirm} title="Submit assignment?" onClose={() => setConfirm(false)}><p className="text-sm text-slate-500">Please confirm that your answer and file are ready for your teacher to review.</p><div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button><Button onClick={() => { setSubmitted(true); setConfirm(false); }}>Confirm Submit</Button></div></Modal></Page>;
}

export function QuizzesPage() {
  return <Page title="Quizzes"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{quizzes.map((q) => <QuizCard key={q.id} item={q} />)}</div></Page>;
}

export function QuizInterface() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const questions = ["Which fraction equals 0.5?", "True or false: A force can change motion.", "Explain one way to revise safely online."];
  if (done) return <Page title="Quiz Results"><Card><h3 className="text-3xl font-black text-green-700">Score: 86%</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Strong result. Review question 2 feedback before your next attempt.</p><Button className="mt-5">View Correct Answers</Button></Card></Page>;
  return <Page title="Fractions Checkpoint" actions={<Badge tone="amber"><Clock size={14} /> 18:42 left</Badge>}><div className="grid gap-4 xl:grid-cols-[1fr_280px]"><Card><ProgressBar value={((index + 1) / questions.length) * 100} label={`Question ${index + 1} of ${questions.length}`} /><h3 className="mt-6 text-xl font-bold">{questions[index]}</h3><div className="mt-4 grid gap-2">{["1/2", "2/3", "3/4", "Short written answer"].map((a) => <Button key={a} variant="outline" className="justify-start">{a}</Button>)}</div><div className="mt-6 flex justify-between"><Button variant="outline" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</Button>{index === questions.length - 1 ? <Button onClick={() => setDone(true)}>Submit Quiz</Button> : <Button onClick={() => setIndex(index + 1)}>Next</Button>}</div><p className="mt-3 text-sm text-teal-600">Auto-saved just now</p></Card><Card><h3 className="font-bold">Question Navigation</h3><div className="mt-3 grid grid-cols-5 gap-2">{questions.map((_, i) => <Button key={i} variant={i === index ? "primary" : "outline"} onClick={() => setIndex(i)}>{i + 1}</Button>)}</div><Button variant="outline" className="mt-4 w-full">Mark for Review</Button></Card></div></Page>;
}

export function GradesPage() {
  return <Page title="Grades"><div className="grid gap-4 md:grid-cols-3"><StatCard icon={Award} label="Overall average" value="84%" /><StatCard icon={Star} label="GPA style" value="3.6" tone="teal" /><StatCard icon={Download} label="Report" value="Ready" tone="amber" /></div><Card><ResponsiveContainer width="100%" height={260}><LineChart data={grades[0].trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line dataKey="score" stroke="#2563eb" strokeWidth={3} /></LineChart></ResponsiveContainer></Card><div className="grid gap-4 md:grid-cols-2">{grades.map((g) => <Card key={g.subject}><div className="flex justify-between"><b>{g.subject}</b><Badge tone={g.average >= 80 ? "green" : "amber"}>{g.average}%</Badge></div><p className="mt-2 text-sm text-slate-500">{g.feedback}</p></Card>)}</div></Page>;
}

export function AttendancePage({ teacher = false }) {
  const [records, setRecords] = useState(storage.get("attendance-demo", attendance.slice(0, 10)));
  const update = (i, status) => { const next = [...records]; next[i] = { ...next[i], status }; setRecords(next); storage.set("attendance-demo", next); };
  return <Page title={teacher ? "Attendance Management" : "Attendance"} actions={teacher && <Button onClick={() => setRecords(records.map((r) => ({ ...r, status: "Present" })))}><Check size={18} /> Mark All Present</Button>}><div className="grid gap-4 md:grid-cols-4"><StatCard icon={CheckCircle2} label="Present" value="24" /><StatCard icon={Clock} label="Late" value="2" tone="amber" /><StatCard icon={CalendarDays} label="Absent" value="1" /><StatCard icon={Award} label="Rate" value="94%" tone="teal" /></div><Card><ResponsiveContainer width="100%" height={220}><BarChart data={chartSeries}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="activity" fill="#14b8a6" /></BarChart></ResponsiveContainer></Card><div className="table-scroll"><table className="w-full bg-white text-sm dark:bg-slate-900"><tbody>{records.map((r, i) => <tr key={r.date} className="border-b border-slate-100 dark:border-slate-800"><td className="p-3">{format(new Date(r.date), "MMM d")}</td><td className="p-3">{r.subject}</td><td className="p-3">{teacher ? <Select value={r.status} onChange={(e) => update(i, e.target.value)}>{["Present", "Absent", "Late", "Excused"].map((s) => <option key={s}>{s}</option>)}</Select> : <Badge tone={r.status === "Present" ? "green" : "amber"}>{r.status}</Badge>}</td></tr>)}</tbody></table></div></Page>;
}

export function CalendarPage() {
  const [selected, setSelected] = useState(calendarEvents[0]);
  return <Page title="Calendar" actions={<div className="flex gap-2"><Button variant="outline">Today</Button><Button variant="outline">Month</Button><Button variant="outline">Week</Button><Button variant="outline">Day</Button></div>}><div className="grid gap-4 lg:grid-cols-[1fr_320px]"><Card><div className="grid grid-cols-7 gap-2">{Array.from({ length: 35 }, (_, i) => <button key={i} className="min-h-24 rounded-lg border border-slate-200 p-2 text-left hover:bg-blue-50 dark:border-slate-800 dark:hover:bg-slate-800"><b>{i + 1}</b>{calendarEvents.filter((e) => Number(e.date.slice(-2)) === i + 1).map((e) => <p key={e.id} className="mt-1 rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">{e.title}</p>)}</button>)}</div></Card><Card><h3 className="font-bold">Event Details</h3>{calendarEvents.map((e) => <button key={e.id} onClick={() => setSelected(e)} className="mt-3 block w-full rounded-lg bg-slate-50 p-3 text-left dark:bg-slate-800"><b>{e.title}</b><p className="text-sm text-slate-500">{e.type} - {e.time}</p></button>)}<p className="mt-5 text-sm">Selected: <b>{selected.title}</b></p></Card></div></Page>;
}

export function AnnouncementsPage() {
  return <Page title="Announcements"><div className="grid gap-4 md:grid-cols-2">{announcements.map((a) => <Card key={a.id}><div className="flex justify-between"><Badge tone={a.priority === "Priority" ? "red" : a.priority === "Pinned" ? "amber" : "blue"}>{a.priority}</Badge><span className="text-sm text-slate-500">{format(new Date(a.date), "MMM d")}</span></div><h3 className="mt-3 font-bold">{a.title}</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{a.body}</p></Card>)}</div></Page>;
}

export function MessagesPage() {
  const [active, setActive] = useState(messages[0]);
  const [draft, setDraft] = useState("");
  return <Page title="Messages"><div className="grid min-h-[560px] gap-4 lg:grid-cols-[320px_1fr]"><Card>{messages.map((m) => <button key={m.id} onClick={() => setActive(m)} className="mb-2 block w-full rounded-lg p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800"><b>{m.from}</b><p className="text-sm text-slate-500">{m.role} - {m.time}</p></button>)}</Card><Card className="flex flex-col"><h3 className="font-bold">{active.from}</h3><div className="my-4 flex-1 rounded-lg bg-slate-50 p-4 dark:bg-slate-800"><p className="max-w-md rounded-lg bg-white p-3 shadow-sm dark:bg-slate-900">{active.text}</p></div><div className="flex gap-2"><Input aria-label="Message" placeholder="Write a respectful school message" value={draft} onChange={(e) => setDraft(e.target.value)} /><Button onClick={() => setDraft("")}><Send size={18} /></Button></div></Card></div></Page>;
}

export function ResourcesPage() {
  return <Page title="Learning Resources"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{resources.map((r) => <Card key={r.id}><Badge tone="teal">{r.type}</Badge><h3 className="mt-3 font-bold">{r.title}</h3><p className="text-sm text-slate-500">{r.category}</p><Button variant="outline" className="mt-4 w-full"><Download size={18} /> Open</Button></Card>)}</div></Page>;
}

export function ProfilePage() {
  return <Page title="Student Profile"><div className="grid gap-4 lg:grid-cols-[320px_1fr]"><Card className="text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">A</div><h3 className="mt-4 text-xl font-bold">Adam Hassan</h3><p className="text-slate-500">Grade 8A - ST2026014</p><Badge tone="green">Active learner</Badge></Card><Card><h3 className="font-bold">Learning Statistics</h3><div className="mt-4 grid gap-4 md:grid-cols-3"><StatCard icon={Award} label="Badges" value="8" /><StatCard icon={BookOpen} label="Courses" value="6" /><StatCard icon={Clock} label="Study hours" value="42" /></div><Textarea className="mt-4" label="Editable personal note" defaultValue="I learn best with short practice sessions and examples." /></Card></div></Page>;
}

export function AchievementsPage() {
  const badges = ["Steady Study", "Course Finisher", "Quiz Ready", "Kind Communicator", "Attendance Star", "Curious Reader"];
  return <Page title="Achievements"><Card><ProgressBar value={68} label="Progress toward next healthy habit badge" /></Card><div className="grid gap-4 md:grid-cols-3">{badges.map((b, i) => <Card key={b} className={i > 3 ? "opacity-60" : ""}><Award className="text-teal-600" /><h3 className="mt-3 font-bold">{b}</h3><p className="text-sm text-slate-500">{i > 3 ? "Locked achievement" : "Unlocked through consistent effort."}</p></Card>)}</div></Page>;
}

export function TeacherDashboard() {
  return <Page title="Teacher Dashboard" actions={<Button><Plus size={18} /> Create</Button>}><div className="grid gap-4 md:grid-cols-4"><StatCard icon={Users} label="Students" value="136" /><StatCard icon={FileText} label="Pending grading" value="18" tone="amber" /><StatCard icon={BookOpen} label="Courses" value="5" /><StatCard icon={CalendarDays} label="Lessons today" value="4" tone="teal" /></div><Card><h3 className="mb-3 font-bold">Class Performance</h3><ResponsiveContainer width="100%" height={260}><BarChart data={grades}><XAxis dataKey="subject" /><YAxis /><Tooltip /><Bar dataKey="average" fill="#2563eb" /></BarChart></ResponsiveContainer></Card><div className="grid gap-4 md:grid-cols-2"><Submissions compact /><AnnouncementsPage /></div></Page>;
}

export function ManagementPage({ type = "course" }) {
  const [open, setOpen] = useState(false);
  return <Page title={type === "quiz" ? "Quiz Builder" : type === "lesson" ? "Lesson Creation" : type === "assignment" ? "Assignment Creation" : "Course Management"} actions={<Button onClick={() => setOpen(true)}><Plus size={18} /> Add Item</Button>}><Card><div className="grid gap-4 md:grid-cols-2"><Input label="Title" placeholder="Enter title" /><Select label="Course"><option>Mathematics Grade 8A</option></Select><Textarea label="Instructions or content" /><Input label="Due date / duration" type="date" /></div><div className="mt-4 flex gap-2"><Button variant="outline">Save Draft</Button><Button>Publish</Button><Button variant="outline">Preview</Button></div></Card><div className="grid gap-4 md:grid-cols-2">{lessons.slice(0, 6).map((l) => <Card key={l.id}><div className="flex justify-between"><b>{l.title}</b><Badge>{l.status}</Badge></div><p className="mt-2 text-sm text-slate-500">Drag to reorder, edit, publish, or unpublish in this frontend prototype.</p><div className="mt-3 flex gap-2"><Button variant="outline">Edit</Button><Button variant="danger"><Trash2 size={16} /> Delete</Button></div></Card>)}</div><Modal open={open} title="Create item" onClose={() => setOpen(false)}><Textarea label="Details" /><Button className="mt-4" onClick={() => setOpen(false)}>Save</Button></Modal></Page>;
}

export function Submissions({ compact = false }) {
  const content = <Card><h3 className="font-bold">Submission Management</h3><div className="table-scroll mt-4"><table className="w-full bg-white text-sm dark:bg-slate-900"><tbody>{people.students.slice(0, compact ? 5 : 12).map((s, i) => <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800"><td className="p-3">{s.name}</td><td className="p-3"><Badge tone={i % 3 ? "green" : "amber"}>{i % 3 ? "Submitted" : "Missing"}</Badge></td><td className="p-3"><Input aria-label="Grade" defaultValue={i % 3 ? 82 + i : ""} /></td><td className="p-3"><Button variant="outline">Feedback</Button></td></tr>)}</tbody></table></div></Card>;
  return compact ? content : <Page title="Submissions">{content}</Page>;
}

export function Gradebook() {
  return <Page title="Gradebook"><div className="table-scroll"><table className="w-full bg-white text-sm dark:bg-slate-900"><thead><tr>{["Student", "Assignment", "Quiz", "Average", "Status"].map((h) => <th key={h} className="p-3 text-left">{h}</th>)}</tr></thead><tbody>{people.students.map((s, i) => <tr key={s.id} className="border-t border-slate-100 dark:border-slate-800"><td className="p-3">{s.name}</td><td className="p-3">{70 + i}%</td><td className="p-3">{76 + i}%</td><td className="p-3 font-bold">{s.average}%</td><td className="p-3"><Badge tone={s.average > 80 ? "green" : "amber"}>{s.status}</Badge></td></tr>)}</tbody></table></div></Page>;
}

export function StudentsPage() {
  return <Page title="Students"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{people.students.map((s) => <Card key={s.id}><h3 className="font-bold">{s.name}</h3><p className="text-sm text-slate-500">{s.grade}{s.className} - {s.id}</p><ProgressBar value={s.average} label="Performance" /><p className="mt-3 text-sm">Attendance {s.attendance}%</p></Card>)}</div></Page>;
}

export function ParentDashboard() {
  return <Page title="Parent Dashboard" actions={<Select aria-label="Child selector"><option>Adam Hassan - Grade 8A</option><option>Sara Hassan - Grade 5B</option></Select>}><div className="grid gap-4 md:grid-cols-4"><StatCard icon={Award} label="Progress" value="84%" /><StatCard icon={CalendarDays} label="Attendance" value="94%" /><StatCard icon={FileText} label="Due soon" value="3" tone="amber" /><StatCard icon={MessageSquare} label="Teacher notes" value="5" tone="teal" /></div><div className="grid gap-4 lg:grid-cols-2"><GradesPage /><AnnouncementsPage /></div></Page>;
}

export function AdminDashboard() {
  return <Page title="Admin Dashboard" actions={<Button><Plus size={18} /> Quick Action</Button>}><div className="grid gap-4 md:grid-cols-4"><StatCard icon={Users} label="Students" value="620" /><StatCard icon={GraduationCap} label="Teachers" value="42" /><StatCard icon={BookOpen} label="Active courses" value="58" /><StatCard icon={CalendarDays} label="Attendance today" value="96%" tone="teal" /></div><Card><ResponsiveContainer width="100%" height={260}><AreaChart data={chartSeries}><XAxis dataKey="name" /><YAxis /><Tooltip /><Area dataKey="activity" fill="#ccfbf1" stroke="#14b8a6" /></AreaChart></ResponsiveContainer></Card><div className="grid gap-4 md:grid-cols-3"><Card><h3 className="font-bold">Storage Usage</h3><ProgressBar value={61} label="Files" /></Card><Card><h3 className="font-bold">Important Alerts</h3><p className="mt-2 text-sm text-slate-500">3 accounts need verification.</p></Card><Card><h3 className="font-bold">Recent Registrations</h3><p className="mt-2 text-sm text-slate-500">12 users added this week.</p></Card></div></Page>;
}

export function UsersManagement() {
  const [tab, setTab] = useState("Students");
  const data = tab === "Students" ? people.students : tab === "Teachers" ? people.teachers : people.parents;
  return <Page title="User Management" actions={<div className="flex gap-2"><Button><Plus size={18} /> Add User</Button><Button variant="outline">Export</Button></div>}><div className="flex flex-wrap gap-2">{["Students", "Teachers", "Parents", "Administrators"].map((t) => <Button key={t} variant={tab === t ? "primary" : "outline"} onClick={() => setTab(t)}>{t}</Button>)}</div><div className="table-scroll"><table className="w-full bg-white text-sm dark:bg-slate-900"><tbody>{data.map((u) => <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800"><td className="p-3 font-semibold">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3"><Badge tone="green">Active</Badge></td><td className="p-3"><Button variant="outline">Edit</Button></td></tr>)}</tbody></table></div></Page>;
}

export function AddStudentForm() {
  return <Page title="Add Student"><Card><div className="grid gap-4 md:grid-cols-2"><Input label="Full name" /><Input label="Student ID" /><Input label="Date of birth" type="date" /><Select label="Gender"><option>Female</option><option>Male</option><option>Prefer not to say</option></Select><Input label="Email" /><Input label="Phone" /><Select label="Grade level"><option>Grade 8</option><option>Grade 5</option></Select><Input label="Classroom" /><Textarea label="Parent information" /><Textarea label="Address" /><Input label="Enrollment date" type="date" /><Select label="Account status"><option>Active</option><option>Pending</option></Select></div><Button className="mt-5">Create Student</Button></Card></Page>;
}

export function AdminSimplePage({ title }) {
  return <Page title={title}><Card><div className="grid gap-4 md:grid-cols-3"><Input label="Search" placeholder="Find records" /><Select label="Filter"><option>All</option><option>Active</option></Select><Button className="self-end"><Plus size={18} /> Add</Button></div></Card><div className="grid gap-4 md:grid-cols-2">{["Academic year 2026", "Term 1", "Grade 8A", "Mathematics course", "Teacher assignment", "Student enrollment"].map((item) => <Card key={item}><b>{item}</b><p className="mt-2 text-sm text-slate-500">Manage details, status, schedules, and relationships in this frontend-only interface.</p></Card>)}</div></Page>;
}

export function ReportsPage() {
  return <Page title="Reports"><div className="grid gap-4 md:grid-cols-3">{["Student performance", "Attendance", "Assignment completion", "Quiz results", "Teacher activity", "Course engagement"].map((r) => <Card key={r}><h3 className="font-bold">{r}</h3><ResponsiveContainer width="100%" height={120}><PieChart><Pie data={[{ name: "A", value: 70 }, { name: "B", value: 30 }]} dataKey="value" outerRadius={45}>{["#2563eb", "#14b8a6"].map((c) => <Cell key={c} fill={c} />)}</Pie></PieChart></ResponsiveContainer><Button variant="outline" className="w-full">Export</Button></Card>)}</div></Page>;
}

export function AuditLog() {
  const rows = ["Teacher updated a grade", "Admin created a student", "Student submitted an assignment", "Teacher recorded attendance"];
  return <Page title="Audit Log"><div className="table-scroll"><table className="w-full bg-white text-sm dark:bg-slate-900"><tbody>{rows.concat(rows).map((r, i) => <tr key={`${r}-${i}`} className="border-b border-slate-100 dark:border-slate-800"><td className="p-3">{people.teachers[i % people.teachers.length].name}</td><td className="p-3">{r}</td><td className="p-3">Jul {17 - i}, 2026 09:{i}0</td><td className="p-3">LMS</td><td className="p-3">Chrome</td><td className="p-3"><Badge tone="green">Success</Badge></td></tr>)}</tbody></table></div></Page>;
}

export function HelpCenter() {
  return <Page title="Help Center"><SearchFilters query="" setQuery={() => {}} /><div className="grid gap-4 md:grid-cols-3">{["How do I submit work?", "How do teachers grade?", "How can parents contact teachers?", "Accessibility settings", "Notification guide", "Contact support"].map((q) => <Card key={q}><h3 className="font-bold">{q}</h3><p className="mt-2 text-sm text-slate-500">Clear, age-friendly guidance for using EduBridge confidently.</p></Card>)}</div></Page>;
}

export function SettingsPage() {
  const tabs = ["Profile", "Account", "Password", "Notifications", "Appearance", "Language", "Accessibility"];
  const [tab, setTab] = useState(tabs[0]);
  return <Page title="Settings"><div className="flex flex-wrap gap-2">{tabs.map((t) => <Button key={t} variant={tab === t ? "primary" : "outline"} onClick={() => setTab(t)}>{t}</Button>)}</div><Card><h3 className="font-bold">{tab}</h3><div className="mt-4 grid gap-4 md:grid-cols-2"><Input label={`${tab} preference`} /><Select label="Status"><option>Enabled</option><option>Disabled</option></Select></div><Button className="mt-4"><Settings size={18} /> Save Settings</Button></Card></Page>;
}

export function GenericRolePage() {
  const { user } = useOutletContext() || { user: { role: "demo" } };
  return <EmptyState title="Ready for demo" text={`This ${user.role} page is connected to the authenticated layout and can be extended with more school-specific details.`} />;
}

export function routeBaseFor(role) {
  return roleBase[role] || "student";
}

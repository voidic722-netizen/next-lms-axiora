import { http, HttpResponse, delay } from 'msw'
import {
  MOCK_USERS, MOCK_FACULTIES, MOCK_DEPARTMENTS, MOCK_SEMESTERS,
  MOCK_SUBJECTS, MOCK_CLASSROOMS, MOCK_SCHEDULES, MOCK_ASSIGNMENTS,
  MOCK_EXAMS, DEV_USERS,
} from './seed-data'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Simulasi delay jaringan agar terasa realistis
const DELAY = 300

// Helper: ambil role dari cookie dev
function getDevRole(): 'admin' | 'teacher' | 'student' {
  if (typeof document === 'undefined') return 'admin'
  const match = document.cookie.match(/dev_role=([^;]+)/)
  return (match?.[1] as 'admin' | 'teacher' | 'student') || 'admin'
}

export const handlers = [
  // ── Auth ────────────────────────────────────────────────────────────────────
  http.post(`${API}/auth/login`, async ({ request }) => {
    await delay(DELAY)
    const body = await request.json() as { email: string; password: string }
    const role = body.email.includes('teacher') ? 'teacher'
      : body.email.includes('student') ? 'student'
      : 'admin'
    const user = DEV_USERS[role]
    return HttpResponse.json({ user: toRawUser(user) })
  }),

  http.get(`${API}/auth/me`, async () => {
    await delay(DELAY / 2)
    const role = getDevRole()
    const user = DEV_USERS[role]
    return HttpResponse.json({ user: toRawUser(user) })
  }),

  http.post(`${API}/auth/logout`, async () => {
    await delay(DELAY / 2)
    return HttpResponse.json({ msg: 'Logged out' })
  }),

  http.patch(`${API}/auth/profile`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ msg: 'Profile updated' })
  }),

  // ── Users ────────────────────────────────────────────────────────────────────
  http.get(`${API}/users`, async ({ request }) => {
    await delay(DELAY)
    const url = new URL(request.url)
    const role = url.searchParams.get('role')
    const users = role ? MOCK_USERS.filter(u => u.role === role) : MOCK_USERS
    return HttpResponse.json({ users: users.map(toRawUser) })
  }),

  http.post(`${API}/users`, async ({ request }) => {
    await delay(DELAY)
    const body = await request.formData()
    const newUser = {
      ...MOCK_USERS[0]!,
      id: Date.now(),
      name: body.get('name') as string,
      email: body.get('email') as string,
      role: body.get('role') as string,
    }
    return HttpResponse.json({ user: toRawUser(newUser as typeof MOCK_USERS[0]) })
  }),

  http.put(`${API}/users/:id`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ user: toRawUser(MOCK_USERS[1]!) })
  }),

  http.delete(`${API}/users/:id`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ msg: 'User deleted' })
  }),

  // ── Faculties ─────────────────────────────────────────────────────────────────
  http.get(`${API}/fakultas`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ fakultas: MOCK_FACULTIES })
  }),

  http.get(`${API}/fakultas/available-for-dekan`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ fakultas: MOCK_FACULTIES })
  }),

  http.get(`${API}/fakultas/:id`, async ({ params }) => {
    await delay(DELAY)
    const faculty = MOCK_FACULTIES.find(f => f.id === Number(params.id))
    if (!faculty) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json({
      fakultas: {
        ...faculty,
        dekan: { id: 2, name: 'Dr. Budi Santoso', nidn: '0012345678' },
        jurusan: MOCK_DEPARTMENTS.filter(d => d.facultyId === faculty.id).map(d => ({
          id: d.id, name: d.name, description: d.description, thumbnail: null,
        })),
        pengajar: MOCK_USERS.filter(u => u.role === '2' && u.facultyId === faculty.id).map(u => ({
          id: u.id, name: u.name, email: u.email, nidn: u.nidn, position: u.position, image: null,
          jurusan: u.department ?? null,
        })),
        siswa: MOCK_USERS.filter(u => u.role === '3' && u.facultyId === faculty.id).map(u => ({
          id: u.id, name: u.name, email: u.email, nim: u.nim, image: null,
          jurusan: u.department ?? null, kelas: u.classroom ?? null,
        })),
      }
    })
  }),

  http.post(`${API}/fakultas`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ fakultas: MOCK_FACULTIES[0] })
  }),

  http.put(`${API}/fakultas/:id`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ fakultas: MOCK_FACULTIES[0] })
  }),

  http.delete(`${API}/fakultas/:id`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ msg: 'Deleted' })
  }),

  // ── Departments (jurusan) ─────────────────────────────────────────────────────
  http.get(`${API}/jurusan`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ jurusan: MOCK_DEPARTMENTS.map(d => ({
      id: d.id, name: d.name, description: d.description,
      fakultas_id: d.facultyId, thumbnail: null, created_at: d.createdAt,
    }))})
  }),

  http.get(`${API}/jurusan/:id`, async ({ params }) => {
    await delay(DELAY)
    const dept = MOCK_DEPARTMENTS.find(d => d.id === Number(params.id))
    if (!dept) return new HttpResponse(null, { status: 404 })
    const faculty = MOCK_FACULTIES.find(f => f.id === dept.facultyId)
    return HttpResponse.json({ jurusan: {
      id: dept.id, name: dept.name, description: dept.description,
      fakultas_id: dept.facultyId, thumbnail: null, created_at: dept.createdAt,
      fakultas: faculty ? { id: faculty.id, name: faculty.name } : null,
      pengajar: MOCK_USERS.filter(u => u.role === '2' && u.departmentId === dept.id).map(u => ({
        id: u.id, name: u.name, email: u.email, nidn: u.nidn, position: u.position, image: null,
      })),
      siswa: MOCK_USERS.filter(u => u.role === '3' && u.departmentId === dept.id).map(u => ({
        id: u.id, name: u.name, email: u.email, nim: u.nim, image: null,
        kelas: u.classroom ?? null,
      })),
      mata_pelajaran: MOCK_SUBJECTS.filter(s => s.departmentId === dept.id).map(s => ({
        id: s.id, name: s.name, description: s.description, thumbnail: null, type: s.type, teacher: null,
      })),
      kelas: MOCK_CLASSROOMS.filter(c => c.departmentId === dept.id).map(c => ({
        id: c.id, name: c.name,
        semester: c.semester ? { id: c.semester.id, name: c.semester.name, academic_year: c.semester.academicYear } : null,
        mata_pelajaran: c.subject ?? null,
      })),
    }})
  }),

  http.post(`${API}/jurusan`, async () => { await delay(DELAY); return HttpResponse.json({ jurusan: { ...MOCK_DEPARTMENTS[0], fakultas_id: 1, created_at: new Date().toISOString() } }) }),
  http.put(`${API}/jurusan/:id`, async () => { await delay(DELAY); return HttpResponse.json({ jurusan: { ...MOCK_DEPARTMENTS[0], fakultas_id: 1, created_at: new Date().toISOString() } }) }),
  http.delete(`${API}/jurusan/:id`, async () => { await delay(DELAY); return HttpResponse.json({ msg: 'Deleted' }) }),

  // ── Semesters ────────────────────────────────────────────────────────────────
  http.get(`${API}/semester`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ semesters: MOCK_SEMESTERS.map(s => ({ id: s.id, name: s.name, academic_year: s.academicYear, created_at: s.createdAt })) })
  }),
  http.post(`${API}/semester`, async () => { await delay(DELAY); return HttpResponse.json({ semester: { id: 99, name: 'New', academic_year: '2025/2026', created_at: new Date().toISOString() } }) }),
  http.put(`${API}/semester/:id`, async () => { await delay(DELAY); return HttpResponse.json({ semester: { id: 1, name: 'Updated', academic_year: '2024/2025', created_at: new Date().toISOString() } }) }),
  http.delete(`${API}/semester/:id`, async () => { await delay(DELAY); return HttpResponse.json({ msg: 'Deleted' }) }),

  // ── Subjects (mata-pelajaran) ─────────────────────────────────────────────────
  http.get(`${API}/mata-pelajaran`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ mata_pelajaran: MOCK_SUBJECTS.map(s => ({ id: s.id, name: s.name, type: s.type, jurusan_id: s.departmentId, description: s.description, thumbnail: null, created_at: s.createdAt })) })
  }),
  http.get(`${API}/mata-pelajaran/:id`, async ({ params }) => {
    await delay(DELAY)
    const s = MOCK_SUBJECTS.find(s => s.id === Number(params.id))
    if (!s) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json({ mata_pelajaran: { id: s.id, name: s.name, type: s.type, jurusan_id: s.departmentId, description: s.description, thumbnail: null, created_at: s.createdAt } })
  }),
  http.post(`${API}/mata-pelajaran`, async () => { await delay(DELAY); return HttpResponse.json({ mataPelajaran: { id: 99, name: 'New Subject', type: 'wajib', jurusan_id: null, description: '', thumbnail: null, created_at: new Date().toISOString() } }) }),
  http.put(`${API}/mata-pelajaran/:id`, async () => { await delay(DELAY); return HttpResponse.json({ mataPelajaran: { id: 1, name: 'Updated', type: 'wajib', jurusan_id: 1, description: '', thumbnail: null, created_at: new Date().toISOString() } }) }),
  http.delete(`${API}/mata-pelajaran/:id`, async () => { await delay(DELAY); return HttpResponse.json({ msg: 'Deleted' }) }),

  // ── Classrooms (kelas) ────────────────────────────────────────────────────────
  http.get(`${API}/kelas`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ kelas: MOCK_CLASSROOMS.map(toRawClassroom) })
  }),
  http.get(`${API}/kelas/:id`, async ({ params }) => {
    await delay(DELAY)
    const c = MOCK_CLASSROOMS.find(c => c.id === Number(params.id))
    if (!c) return new HttpResponse(null, { status: 404 })
    const students = MOCK_USERS.filter(u => u.role === '3' && u.classroomId === c.id)
    return HttpResponse.json({ kelas: {
      ...toRawClassroom(c),
      teacher: { id: 2, name: 'Dr. Budi Santoso', email: 'budi@lms.id', position: 'dosen', nidn: '0012345678' },
      teachers: [{ id: 2, name: 'Dr. Budi Santoso', email: 'budi@lms.id', position: 'dosen', nidn: '0012345678' }],
      students: students.map(u => ({ id: u.id, name: u.name, email: u.email, nim: u.nim })),
      student_count: students.length,
      tasks: MOCK_ASSIGNMENTS.filter(a => a.classroomIds.includes(c.id)).map(a => ({
        id: a.id, title: a.title, description: a.description, task_types: a.types,
        kelas_ids: a.classroomIds, due_date: a.dueDate, max_file_size: a.maxFileSize,
        mata_pelajaran_id: a.subjectId, created_at: a.createdAt,
      })),
      exams: MOCK_EXAMS.filter(e => e.classroomIds.includes(c.id)).map(e => ({
        id: e.id, title: e.title, description: e.description, kategori_ujian: e.examTypes,
        kelas_ids: e.classroomIds, available_date: e.availableDate, deadline_date: e.deadlineDate,
        duration_minutes: e.durationMinutes, questions: e.questions, created_at: e.createdAt,
      })),
      schedules: MOCK_SCHEDULES.filter(s => s.classroomId === c.id).map(s => ({
        id: s.id, date: s.date, topic: s.topic,
      })),
    }})
  }),
  http.post(`${API}/kelas`, async () => { await delay(DELAY); return HttpResponse.json({ kelas: toRawClassroom(MOCK_CLASSROOMS[0]!) }) }),
  http.put(`${API}/kelas/:id`, async () => { await delay(DELAY); return HttpResponse.json({ kelas: toRawClassroom(MOCK_CLASSROOMS[0]!) }) }),
  http.delete(`${API}/kelas/:id`, async () => { await delay(DELAY); return HttpResponse.json({ msg: 'Deleted' }) }),

  // ── Schedules (jadwal) ────────────────────────────────────────────────────────
  http.get(`${API}/jadwal`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ jadwal: MOCK_SCHEDULES.map(s => ({ id: s.id, date: s.date, kelas_id: s.classroomId, topic: s.topic, created_at: s.createdAt, kelas: s.classroom })) })
  }),
  http.get(`${API}/jadwal/:id`, async ({ params }) => {
    await delay(DELAY)
    const s = MOCK_SCHEDULES.find(s => s.id === Number(params.id))
    if (!s) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json({ jadwal: { id: s.id, date: s.date, kelas_id: s.classroomId, topic: s.topic, created_at: s.createdAt, kelas: s.classroom } })
  }),
  http.post(`${API}/jadwal`, async () => { await delay(DELAY); return HttpResponse.json({ jadwal: { id: 99, date: new Date().toISOString(), kelas_id: 1, topic: 'New Topic', created_at: new Date().toISOString() } }) }),
  http.put(`${API}/jadwal/:id`, async () => { await delay(DELAY); return HttpResponse.json({ jadwal: { id: 1, date: new Date().toISOString(), kelas_id: 1, topic: 'Updated', created_at: new Date().toISOString() } }) }),
  http.delete(`${API}/jadwal/:id`, async () => { await delay(DELAY); return HttpResponse.json({ msg: 'Deleted' }) }),

  // ── Assignments (tugas) ────────────────────────────────────────────────────────
  http.get(`${API}/tugas`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ tugas: MOCK_ASSIGNMENTS.map(toRawAssignment) })
  }),
  http.get(`${API}/tugas/:id`, async ({ params }) => {
    await delay(DELAY)
    const a = MOCK_ASSIGNMENTS.find(a => a.id === Number(params.id))
    if (!a) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json({ tugas: toRawAssignment(a) })
  }),
  http.post(`${API}/tugas`, async () => { await delay(DELAY); return HttpResponse.json({ tugas: toRawAssignment(MOCK_ASSIGNMENTS[0]!) }) }),
  http.put(`${API}/tugas/:id`, async () => { await delay(DELAY); return HttpResponse.json({ tugas: toRawAssignment(MOCK_ASSIGNMENTS[0]!) }) }),
  http.delete(`${API}/tugas/:id`, async () => { await delay(DELAY); return HttpResponse.json({ msg: 'Deleted' }) }),
  http.delete(`${API}/tugas-modul/:id`, async () => { await delay(DELAY); return HttpResponse.json({ msg: 'Deleted' }) }),

  // Submissions
  http.get(`${API}/tugas/:id/my-submission`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ submission: null })
  }),
  http.get(`${API}/tugas/:id/submissions`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ submissions: [
      { student_id: 3, student_name: 'Siti Rahayu', kelas_id: 1, kelas_name: 'TI-A 2024', is_submitted: true, submission: { id: 1, files: [{ file_name: 'laporan.pdf', file_path: '/files/laporan.pdf', format: 'pdf', file_size: '2 MB' }], status: 'submitted', submitted_at: new Date().toISOString(), grade: 85, feedback: 'Bagus!' } },
      { student_id: 4, student_name: 'Ahmad Fauzi', kelas_id: 1, kelas_name: 'TI-A 2024', is_submitted: false, submission: null },
    ]})
  }),
  http.post(`${API}/tugas/:id/submit`, async () => { await delay(DELAY); return HttpResponse.json({ submission: { id: 1, files: [], status: 'submitted', submitted_at: new Date().toISOString() } }) }),
  http.post(`${API}/tugas-pengumpulan/:id/grade`, async () => { await delay(DELAY); return HttpResponse.json({ submission: { id: 1, grade: 90, feedback: 'Excellent' } }) }),

  // ── Exams (ujian) ─────────────────────────────────────────────────────────────
  http.get(`${API}/ujian`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ ujian: MOCK_EXAMS.map(toRawExam) })
  }),
  http.get(`${API}/ujian/:id`, async ({ params }) => {
    await delay(DELAY)
    const e = MOCK_EXAMS.find(e => e.id === Number(params.id))
    if (!e) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json({ ujian: toRawExam(e) })
  }),
  http.post(`${API}/ujian`, async () => { await delay(DELAY); return HttpResponse.json({ ujian: toRawExam(MOCK_EXAMS[0]!) }) }),
  http.put(`${API}/ujian/:id`, async () => { await delay(DELAY); return HttpResponse.json({ ujian: toRawExam(MOCK_EXAMS[0]!) }) }),
  http.delete(`${API}/ujian/:id`, async () => { await delay(DELAY); return HttpResponse.json({ msg: 'Deleted' }) }),

  http.get(`${API}/ujian/:id/my-submission`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ submission: null })
  }),
  http.get(`${API}/ujian/:id/submissions`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ submissions: [
      { student_id: 3, student_name: 'Siti Rahayu', student_nim: '2024001001', student_email: 'siti@lms.id', kelas_id: 1, kelas_name: 'TI-A 2024', is_submitted: true, submission: { id: 1, score: 80, correct_count: 8, total_questions: 10, submitted_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } },
      { student_id: 4, student_name: 'Ahmad Fauzi', student_nim: '2024001002', student_email: 'ahmad@lms.id', kelas_id: 1, kelas_name: 'TI-A 2024', is_submitted: false, submission: null },
    ]})
  }),
  http.post(`${API}/ujian/:id/submit`, async () => {
    await delay(1000)
    return HttpResponse.json({ score: 80, correct_count: 8, total_questions: 10 })
  }),
]

// ── Raw Mappers (frontend → backend shape untuk mock response) ────────────────
function toRawUser(u: typeof MOCK_USERS[0]) {
  return {
    id: u.id, name: u.name, email: u.email, role: u.role, image: u.image,
    position: u.position, nidn: u.nidn, nim: u.nim,
    createdAt: u.createdAt, updatedAt: u.updatedAt, deletedAt: u.deletedAt,
    fakultas_id: u.facultyId, jurusan_id: u.departmentId,
    kelas_id: u.classroomId, mata_pelajaran_id: u.subjectId,
    jurusan: u.department ?? null, fakultas: u.faculty ?? null,
    kelas: u.classroom ?? null, mata_pelajaran: u.subject ?? null,
  }
}

function toRawClassroom(c: typeof MOCK_CLASSROOMS[0]) {
  return {
    id: c.id, name: c.name, jurusan_id: c.departmentId,
    semester_id: c.semesterId, mata_pelajaran_id: c.subjectId, created_at: c.createdAt,
    jurusan: c.department ? { id: c.department.id, name: c.department.name } : null,
    semester: c.semester ? { id: c.semester.id, name: c.semester.name, academic_year: c.semester.academicYear } : null,
    mata_pelajaran: c.subject ?? null,
  }
}

function toRawAssignment(a: typeof MOCK_ASSIGNMENTS[0]) {
  return {
    id: a.id, title: a.title, description: a.description, task_types: a.types,
    kelas_ids: a.classroomIds, due_date: a.dueDate, max_file_size: a.maxFileSize,
    mata_pelajaran_id: a.subjectId, mata_pelajaran: a.subject ?? null,
    moduls: a.modules.map(m => ({ id: m.id, tugas_id: m.assignmentId, name: m.name, file_path: m.filePath, format: m.format, file_size: m.fileSize })),
    created_at: a.createdAt,
  }
}

function toRawExam(e: typeof MOCK_EXAMS[0]) {
  return {
    id: e.id, title: e.title, description: e.description, kategori_ujian: e.examTypes,
    kelas_ids: e.classroomIds, available_date: e.availableDate, deadline_date: e.deadlineDate,
    duration_minutes: e.durationMinutes,
    questions: e.questions.map(q => ({
      id: q.id, text: q.text, type: q.type, image: q.image,
      options: q.options.map(o => ({ id: o.id, label: o.label, is_correct: o.isCorrect })),
    })),
    created_at: e.createdAt,
  }
}
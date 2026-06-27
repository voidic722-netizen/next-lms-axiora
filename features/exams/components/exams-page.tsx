"use client";

import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Plus, GraduationCap, Loader2, Trash2, PlusCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/shared/data-table";
import { formatDate, isFuture, toLocalDatetimeString, toUtcIsoString } from "@/lib/format-date";
import { examSchema, type ExamFormValues } from "../schemas/exam-schema";
import {
  useExams,
  useExamDetail,
  useCreateExam,
  useUpdateExam,
  useDeleteExam,
} from "../hooks/use-exams";
import { useExamSubmissions } from "@/features/exam-submissions/hooks/use-exam-submissions";
import { useMyExamSubmission } from "@/features/exam-submissions/hooks/use-exam-submissions";
import { useClassrooms } from "@/features/classrooms/hooks/use-classrooms";
import { useExamList } from "../hooks/use-exam-list";
import type { Exam } from "@/types/exam";
import type { StudentExamSubmissionRecord } from "@/types/exam-submission";

const EXAM_TYPE_OPTIONS = [
  { value: 'UTS', label: 'UTS' },
  { value: 'UAS', label: 'UAS' },
  { value: 'Kuis', label: 'Kuis' },
  { value: 'Ulangan Harian', label: 'Ulangan Harian' },
]

export function ExamsPage() {
  const { user, isTeacherOrAdmin } = useAuth();
  const { data: exams = [], isLoading } = useExams();
  const deleteMutation = useDeleteExam();
  const {
    handleExamClick,
    isStartDialogOpen,
    setIsStartDialogOpen,
    handleStartExam,
    isNotAvailableOpen,
    setIsNotAvailableOpen,
    notAvailableFrom,
  } = useExamList();

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)

  function openAddModal() {
    setEditingExam(null)
    setIsModalOpen(true)
  }

  function openEditModal(e: Exam) {
    setEditingExam(e)
    setIsModalOpen(true)
  }

  const visible = exams.filter((e) => {
    if (isTeacherOrAdmin) return true;
    return (
      user?.classroomId != null &&
      e.classroomIds.map(Number).includes(user.classroomId)
    );
  });

  if (isLoading)
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg bg-[#E2E8F0]" />
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ujian"
        description={`${visible.length} ujian`}
        action={
          isTeacherOrAdmin ? (
            <Button size="sm" onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Ujian
            </Button>
          ) : undefined
        }
      />
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <GraduationCap className="h-12 w-12 text-[#64748B]/40" />
          <p className="text-[#64748B]">Belum ada ujian</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((e) => (
            <ExamCard
              key={e.id}
              exam={e}
              isTeacherOrAdmin={isTeacherOrAdmin}
              onExamClick={handleExamClick}
              onEdit={() => openEditModal(e)}
              onDelete={() => deleteMutation.mutateAsync(e.id)}
            />
          ))}
        </div>
      )}

      {isStartDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-[#0F172A]">Mulai Ujian?</h2>
            <p className="text-sm text-[#64748B]">
              Pastikan koneksi internet stabil. Ujian akan dimulai dalam mode layar penuh. Berpindah tab dihitung sebagai pelanggaran.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsStartDialogOpen(false)}>Batal</Button>
              <Button onClick={handleStartExam}>Mulai</Button>
            </div>
          </div>
        </div>
      )}

      {isNotAvailableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-[#0F172A]">Ujian Belum Dibuka</h2>
            <p className="text-sm text-[#64748B]">
              Ujian ini baru bisa diakses mulai{" "}
              <span className="font-medium text-[#0F172A]">{formatDate(notAvailableFrom ?? "")}</span>.
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setIsNotAvailableOpen(false)}>Mengerti</Button>
            </div>
          </div>
        </div>
      )}

      {isTeacherOrAdmin && (
        <ExamFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          exam={editingExam}
        />
      )}
    </div>
  );
}

function ExamCard({
  exam: e,
  isTeacherOrAdmin,
  onExamClick,
  onEdit,
  onDelete,
}: {
  exam: Exam;
  isTeacherOrAdmin: boolean;
  onExamClick: (ev: React.MouseEvent, id: number, isCompleted: boolean, availableFrom?: string) => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}) {
  const notYet = isFuture(e.availableDate);
  const expired = !isFuture(e.deadlineDate);
  return (
    <Card
      className="group cursor-pointer relative overflow-hidden bg-white border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(75,92,240,0.08)] hover:-translate-y-[2px] transition-all duration-300 rounded-2xl"
      onClick={(ev) => onExamClick(ev, e.id, false, e.availableDate)}
    >

      <CardContent className="py-5 px-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg text-slate-800 group-hover:text-indigo-600 truncate transition-colors">{e.title}</p>
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              {e.examTypes.map((t) => (
                <Badge key={t} variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-slate-600 bg-slate-50 border-slate-200">
                  {t}
                </Badge>
              ))}
              <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
              <Badge className={`text-[10px] uppercase font-bold tracking-wider border-0 ${expired ? "bg-red-100 text-red-600" : notYet ? "bg-slate-100 text-slate-600" : "bg-indigo-100 text-indigo-700"}`}>
                {expired ? "Berakhir" : notYet ? "Belum Dimulai" : "Aktif"}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-3 flex items-center flex-wrap gap-2">
              <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{e.durationMinutes} menit</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{e.questions.length} soal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="text-xs">{formatDate(e.availableDate)} — {formatDate(e.deadlineDate)}</span>
            </p>
          </div>
          {isTeacherOrAdmin && (
            <div
              className="flex sm:flex-col gap-2 shrink-0 sm:pt-0 pt-2 w-full sm:w-auto border-t sm:border-0 border-slate-100 mt-2 sm:mt-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 sm:flex-none">
                Edit
              </Button>
              <ConfirmDialog
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 hover:border-red-200 transition-colors"
                  >
                    Hapus
                  </Button>
                }
                title="Hapus Ujian"
                description={`Yakin menghapus "${e.title}"?`}
                confirmLabel="Hapus"
                onConfirm={onDelete}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ExamSubmittedPage({ id }: { id: string }) {
  const { data: submission, isLoading } = useMyExamSubmission(id);
  const { data: exam } = useExamDetail(id);
  if (isLoading) return <Skeleton className="h-64 rounded-lg max-w-md mx-auto bg-[#E2E8F0]" />;
  return (
    <div className="max-w-md mx-auto py-12 space-y-6 text-center">
      <CheckCircle2 className="h-16 w-16 text-[#22C55E] mx-auto" />
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Ujian Selesai</h1>
        <p className="text-[#64748B] mt-1">{exam?.title}</p>
      </div>
      {submission && (
        <div className="grid grid-cols-3 gap-4">
          <ResultCard label="Nilai" value={String(submission.score)} highlight />
          <ResultCard label="Benar" value={`${submission.correctCount}/${submission.totalQuestions}`} />
          <ResultCard label="Status" value="Selesai" />
        </div>
      )}
      <Button asChild variant="outline">
        <Link href="/exams">Kembali ke Daftar Ujian</Link>
      </Button>
    </div>
  );
}

function ResultCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm">
      <p className="text-xs text-[#64748B]">{label}</p>
      <p className={`text-xl font-bold mt-0.5 ${highlight ? "text-[#4B5CF0]" : "text-[#0F172A]"}`}>{value}</p>
    </div>
  );
}

export function ExamSubmissionsPage({ id }: { id: string }) {
  const { data: exam } = useExamDetail(id);
  const { data: submissions = [] } = useExamSubmissions(id);
  const submitted = submissions.filter((s) => s.isSubmitted).length;
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Pengumpulan — ${exam?.title ?? "..."}`}
        description={`${submitted} / ${submissions.length} mahasiswa telah mengerjakan`}
      />
      <DataTable
        data={submissions as unknown as Record<string, unknown>[]}
        searchable
        searchPlaceholder="Cari mahasiswa..."
        searchKeys={["studentName"]}
        columns={[
          {
            key: "student", header: "Mahasiswa",
            render: (row) => {
              const s = row as unknown as StudentExamSubmissionRecord;
              return <div><p className="font-medium text-sm text-[#0F172A]">{s.studentName}</p><p className="text-xs text-[#64748B]">{s.classroomName}</p></div>;
            },
          },
          {
            key: "status", header: "Status",
            render: (row) => {
              const s = row as unknown as StudentExamSubmissionRecord;
              return s.isSubmitted
                ? <Badge className="bg-[#22C55E] text-white border-0">Selesai</Badge>
                : <Badge variant="secondary">Belum</Badge>;
            },
          },
          {
            key: "score", header: "Nilai",
            render: (row) => {
              const s = row as unknown as StudentExamSubmissionRecord;
              if (!s.submission) return <span className="text-[#64748B] text-sm">-</span>;
              return <span className="font-semibold text-[#0F172A]">{s.submission.score}</span>;
            },
          },
          {
            key: "correct", header: "Benar",
            render: (row) => {
              const s = row as unknown as StudentExamSubmissionRecord;
              if (!s.submission) return <span className="text-[#64748B] text-sm">-</span>;
              return <span className="text-sm text-[#0F172A]">{s.submission.correctCount}/{s.submission.totalQuestions}</span>;
            },
          },
        ]}
      />
    </div>
  );
}

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { handleApiError } from '@/lib/error-handler'

function ExamForm({
  form,
  onSubmit,
  isPending,
  submitLabel,
  onCancel,
}: {
  form: any;
  onSubmit: (v: ExamFormValues) => Promise<void>;
  isPending: boolean;
  submitLabel: string;
  onCancel: () => void;
}) {
  const { data: classrooms = [] } = useClassrooms();
  const { control, watch } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "questions" });
  
  const selectedClassrooms = watch("classroomIds") ?? [];
  const selectedExamTypes = watch("examTypes") ?? [];

  function toggleClassroom(id: number) {
    const next = selectedClassrooms.includes(id)
      ? selectedClassrooms.filter((c: number) => c !== id)
      : [...selectedClassrooms, id];
    form.setValue("classroomIds", next, { shouldValidate: true });
  }

  function toggleExamType(type: string) {
    const next = selectedExamTypes.includes(type)
      ? selectedExamTypes.filter((t: string) => t !== type)
      : [...selectedExamTypes, type];
    form.setValue("examTypes", next, { shouldValidate: true });
  }

  function addQuestion() {
    append({
      id: `q-${Date.now()}`,
      text: "",
      type: "multiple-choice",
      image: null,
      options: [
        { id: `o-${Date.now()}-1`, label: "", isCorrect: false },
        { id: `o-${Date.now()}-2`, label: "", isCorrect: false },
        { id: `o-${Date.now()}-3`, label: "", isCorrect: false },
        { id: `o-${Date.now()}-4`, label: "", isCorrect: false },
      ],
    });
  }

  const handleFormSubmit = (data: ExamFormValues) => {
    const cleaned = { ...data, questions: data.questions.map((q) => ({ ...q, image: q.image ?? null })) };
    onSubmit(cleaned);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Judul Ujian</FormLabel>
                <FormControl>
                  <Input placeholder="UTS Semester 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="examTypes"
            render={() => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Kategori Ujian</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {EXAM_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleExamType(opt.value)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-colors duration-200 ${
                          selectedExamTypes.includes(opt.value)
                            ? 'bg-[#4B5CF0] text-white border-[#4B5CF0]'
                            : 'border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="availableDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Mulai</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="deadlineDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tenggat Waktu</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="durationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durasi (menit)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} placeholder="90" {...field} onChange={e => field.onChange(e.target.valueAsNumber || e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="classroomIds"
            render={() => (
              <FormItem>
                <FormLabel>Kelas</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border border-[#E2E8F0] rounded-md p-2">
                    {classrooms.map((c) => (
                      <label key={c.id} className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                        <Checkbox checked={selectedClassrooms.includes(c.id)} onCheckedChange={() => toggleClassroom(c.id)} />
                        {c.name}
                      </label>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Soal ({fields.length})</Label>
            <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" />Tambah Soal
            </Button>
          </div>
          {form.formState.errors.questions && <p className="text-xs text-[#EF4444]">{form.formState.errors.questions.message as string}</p>}
          
          {fields.map((field, qi) => (
            <Card key={field.id} className="border border-[#E2E8F0] bg-white shadow-sm">
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#0F172A]">Soal {qi + 1}</CardTitle>
                <Button
                  type="button" variant="ghost" size="icon"
                  className="h-7 w-7 text-[#EF4444] hover:text-[#DC2626] hover:bg-[#EF4444]/10 transition-colors duration-200"
                  onClick={() => remove(qi)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField
                  control={control}
                  name={`questions.${qi}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Teks pertanyaan..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  {((field as any).options ?? []).map((_: any, oi: any) => (
                    <div key={oi} className="flex items-center gap-2">
                      <FormField
                        control={control}
                        name={`questions.${qi}.options.${oi}.isCorrect`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`questions.${qi}.options.${oi}.label`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder={`Pilihan ${oi + 1}`} {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        </div>
      </form>
    </Form>
  );
}

export function ExamFormModal({ isOpen, onClose, exam }: {
  isOpen: boolean
  onClose: () => void
  exam?: Exam | null
}) {
  const isEditing = !!exam
  const createMutation = useCreateExam()
  const updateMutation = useUpdateExam(String(exam?.id ?? ''))
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    values: exam
      ? {
          title: exam.title,
          description: exam.description ?? undefined,
          examTypes: exam.examTypes,
          classroomIds: exam.classroomIds,
          availableDate: toLocalDatetimeString(exam.availableDate),
          deadlineDate: toLocalDatetimeString(exam.deadlineDate),
          durationMinutes: exam.durationMinutes,
          questions: exam.questions.map((q) => ({ ...q, image: q.image })),
        }
      : { 
          title: '', 
          description: '', 
          examTypes: [], 
          classroomIds: [], 
          availableDate: '', 
          deadlineDate: '', 
          durationMinutes: 0, 
          questions: [] 
        } as any,
  });

  async function onSubmit(v: ExamFormValues) {
    try {
      const payload = {
        ...v,
        availableDate: toUtcIsoString(v.availableDate),
        deadlineDate: toUtcIsoString(v.deadlineDate),
      };
      
      if (isEditing) {
        await updateMutation.mutateAsync(payload as any)
      } else {
        await createMutation.mutateAsync(payload as any)
      }
      form.reset()
      onClose()
    } catch (error) {
      handleApiError(error, form.setError)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Ujian' : 'Tambah Ujian'}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ExamForm
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
            submitLabel={isEditing ? 'Simpan Perubahan' : 'Simpan'}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
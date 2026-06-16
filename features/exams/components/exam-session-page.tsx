'use client'

import { AlertCircle, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { withStorageUrl } from '@/lib/storage'
import { useExamSession } from '@/features/exams/hooks/use-exam-session'

export function ExamSessionPage({ id }: { id: string }) {
  const {
    exam,
    examStarted,
    startExam,
    currentIndex,
    currentQuestion,
    answers,
    loading,
    error,
    submitting,
    totalQuestions,
    isFirstQuestion,
    isLastQuestion,
    handleAnswerChange,
    handleNext,
    handlePrev,
    goToQuestion,
    formattedTime,
    timeLeft,
    violationCount,
    maxViolations,
    handleSubmit,
  } = useExamSession(id)

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#64748B]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-[#EF4444]" />
        <p className="text-[#64748B]">{error}</p>
      </div>
    )
  }

  if (!exam) return null

  if (!examStarted) {
    return (
      <div className="max-w-lg mx-auto py-12 space-y-6 text-center">
        <h1 className="text-2xl font-bold text-[#0F172A]">{exam.title}</h1>
        {exam.description && <p className="text-[#64748B]">{exam.description}</p>}
        <div className="grid grid-cols-2 gap-4 text-left">
          <InfoCard label="Jumlah Soal" value={`${exam.questions.length} soal`} />
          <InfoCard label="Durasi" value={`${exam.durationMinutes} menit`} />
        </div>
        <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg text-left space-y-2">
          <p className="text-sm font-semibold text-[#92400E]">Perhatian</p>
          <ul className="text-sm text-[#92400E] space-y-1 list-disc list-inside">
            <li>Ujian akan dimulai dalam mode layar penuh</li>
            <li>Berpindah tab atau keluar layar penuh dihitung sebagai pelanggaran</li>
            <li>Maksimal {maxViolations} pelanggaran — ujian dikumpulkan otomatis</li>
            <li>Soal akan diacak</li>
          </ul>
        </div>
        <Button size="lg" className="w-full" onClick={startExam}>
          Mulai Ujian
        </Button>
      </div>
    )
  }

  const answered = Object.keys(answers).length
  const progress = totalQuestions > 0 ? (answered / totalQuestions) * 100 : 0
  const isWarning = timeLeft < 60

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-4 sticky top-14 z-10 bg-white/80 backdrop-blur py-2">
        <div className="flex items-center gap-2">
          <Clock className={cn('h-4 w-4', isWarning && 'text-[#EF4444] animate-pulse')} />
          <span className={cn('font-mono font-bold text-lg text-[#0F172A]', isWarning && 'text-[#EF4444]')}>
            {formattedTime}
          </span>
        </div>
        <div className="flex-1 max-w-48">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-[#64748B] mt-1 text-right">
            {answered}/{totalQuestions} dijawab
          </p>
        </div>
        {violationCount > 0 && (
          <Badge variant="destructive">
            Pelanggaran: {violationCount}/{maxViolations}
          </Badge>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Kumpulkan
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const q = exam.questions[i]
          const isAnswered = q ? String(q.id) in answers : false
          return (
            <button
              key={i}
              onClick={() => goToQuestion(i)}
              className={cn(
                'h-8 w-8 rounded text-xs font-medium border transition-colors',
                i === currentIndex
                  ? 'bg-[#4B5CF0] text-white border-[#4B5CF0]'
                  : isAnswered
                    ? 'bg-[#F0FDF4] border-[#22C55E] text-[#166534]'
                    : 'border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]',
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {currentQuestion && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="shrink-0 mt-0.5">
                  Soal {currentIndex + 1}
                </Badge>
                <p className="text-sm leading-relaxed text-[#0F172A]">{currentQuestion.text}</p>
              </div>
              {currentQuestion.image && (
                <img
                  src={withStorageUrl(currentQuestion.image) ?? currentQuestion.image}
                  alt="Gambar soal"
                  className="rounded-lg max-h-60 object-contain border border-[#E2E8F0]"
                />
              )}
            </div>

            <RadioGroup
              value={answers[String(currentQuestion.id)] ?? ''}
              onValueChange={handleAnswerChange}
              className="space-y-2"
            >
              {currentQuestion.options.map((opt) => (
                <div
                  key={opt.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border border-[#E2E8F0] p-3 cursor-pointer transition-colors hover:bg-[#F8FAFC]',
                    answers[String(currentQuestion.id)] === opt.id && 'border-[#4B5CF0] bg-[#EEF1FF]',
                  )}
                  onClick={() => handleAnswerChange(opt.id)}
                >
                  <RadioGroupItem value={opt.id} id={`opt-${opt.id}`} />
                  <Label htmlFor={`opt-${opt.id}`} className="cursor-pointer flex-1">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={isFirstQuestion}>
          Sebelumnya
        </Button>
        {isLastQuestion ? (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Kumpulkan Ujian
          </Button>
        ) : (
          <Button onClick={handleNext}>Selanjutnya</Button>
        )}
      </div>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
      <p className="text-xs text-[#64748B]">{label}</p>
      <p className="font-semibold text-[#0F172A] mt-0.5">{value}</p>
    </div>
  )
}
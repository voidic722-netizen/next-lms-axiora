'use client'

import { useEffect } from 'react'
import { type UseFormReturn, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { USER_ROLE } from '@/types/roles'
import type { Faculty } from '@/types/faculty'
import type { Department } from '@/types/department'
import type { Classroom } from '@/types/classroom'
import type { Subject } from '@/types/subject'
import type { CreateUserFormValues, UpdateUserFormValues } from '../schemas/user-schema'

type UserFormValues = CreateUserFormValues | UpdateUserFormValues

interface UserFormFieldsProps {
  form: UseFormReturn<UserFormValues>
  faculties: Faculty[]
  departments: Department[]
  classrooms: Classroom[]
  subjects: Subject[]
  isCreate?: boolean
}

const POSITION_OPTIONS = [
  { value: 'dosen', label: 'Dosen' },
  { value: 'kaprodi', label: 'Kaprodi' },
  { value: 'dekan', label: 'Dekan' },
]

export function UserFormFields({
  form,
  faculties,
  departments,
  classrooms,
  subjects,
  isCreate = false,
}: UserFormFieldsProps) {
  const { register, setValue, formState: { errors }, control } = form
  const role = useWatch({ control, name: 'role' })
  const facultyId = useWatch({ control, name: 'facultyId' as keyof UserFormValues })
  const departmentId = useWatch({ control, name: 'departmentId' as keyof UserFormValues })

  // Cascading resets — match original business logic
  useEffect(() => {
    setValue('departmentId' as keyof UserFormValues, undefined as never)
  }, [facultyId, setValue])

  useEffect(() => {
    setValue('classroomId' as keyof UserFormValues, undefined as never)
    setValue('subjectId' as keyof UserFormValues, undefined as never)
  }, [departmentId, setValue])

  const filteredDepts = departments.filter(
    (d) => !facultyId || d.facultyId === Number(facultyId),
  )
  const filteredClassrooms = classrooms.filter(
    (c) => !departmentId || c.departmentId === Number(departmentId),
  )
  const filteredSubjects = subjects.filter(
    (s) => !departmentId || s.departmentId === Number(departmentId),
  )

  return (
    <div className="space-y-4">
      {/* Common fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="u-name">Nama</Label>
          <Input id="u-name" placeholder="Nama lengkap" {...register('name')} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="u-email">Email</Label>
          <Input id="u-email" type="email" placeholder="email@domain.com" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="u-role">Role</Label>
          <Select
            value={role}
            onValueChange={(v) => setValue('role', v as UserFormValues['role'])}
          >
            <SelectTrigger id="u-role">
              <SelectValue placeholder="Pilih role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={USER_ROLE.Admin}>Admin</SelectItem>
              <SelectItem value={USER_ROLE.Teacher}>Teacher</SelectItem>
              <SelectItem value={USER_ROLE.Student}>Student</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="u-pass">
            Password{!isCreate && <span className="text-muted-foreground ml-1">(opsional)</span>}
          </Label>
          <Input
            id="u-pass"
            type="password"
            placeholder={isCreate ? 'Min. 6 karakter' : 'Kosongkan jika tidak diubah'}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>
      </div>

      {/* Teacher fields */}
      {role === USER_ROLE.Teacher && (
        <TeacherFormSection
          form={form}
          faculties={faculties}
          departments={filteredDepts}
          subjects={filteredSubjects}
        />
      )}

      {/* Student fields */}
      {role === USER_ROLE.Student && (
        <StudentFormSection
          form={form}
          faculties={faculties}
          departments={filteredDepts}
          classrooms={filteredClassrooms}
        />
      )}
    </div>
  )
}

function TeacherFormSection({
  form,
  faculties,
  departments,
  subjects,
}: {
  form: UseFormReturn<UserFormValues>
  faculties: Faculty[]
  departments: Department[]
  subjects: Subject[]
}) {
  const { register, setValue, formState: { errors } } = form
  return (
    <div className="space-y-4 border-t pt-4">
      <p className="text-sm font-medium text-muted-foreground">Data Pengajar</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Posisi</Label>
          <Select onValueChange={(v) => setValue('position' as keyof UserFormValues, v as never)}>
            <SelectTrigger><SelectValue placeholder="Pilih posisi" /></SelectTrigger>
            <SelectContent>
              {POSITION_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="u-nidn">NIDN</Label>
          <Input id="u-nidn" placeholder="NIDN" {...register('nidn' as keyof UserFormValues)} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Fakultas"
          options={faculties.map((f) => ({ value: f.id, label: f.name }))}
          onValueChange={(v) => setValue('facultyId' as keyof UserFormValues, Number(v) as never)}
        />
        <SelectField
          label="Jurusan"
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
          onValueChange={(v) => setValue('departmentId' as keyof UserFormValues, Number(v) as never)}
        />
      </div>
      <SelectField
        label="Mata Pelajaran"
        options={subjects.map((s) => ({ value: s.id, label: s.name }))}
        onValueChange={(v) => setValue('subjectId' as keyof UserFormValues, Number(v) as never)}
      />
    </div>
  )
}

function StudentFormSection({
  form,
  faculties,
  departments,
  classrooms,
}: {
  form: UseFormReturn<UserFormValues>
  faculties: Faculty[]
  departments: Department[]
  classrooms: Classroom[]
}) {
  const { register, setValue } = form
  return (
    <div className="space-y-4 border-t pt-4">
      <p className="text-sm font-medium text-muted-foreground">Data Mahasiswa</p>
      <div className="space-y-1.5">
        <Label htmlFor="u-nim">NIM</Label>
        <Input id="u-nim" placeholder="NIM" {...register('nim' as keyof UserFormValues)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Fakultas"
          options={faculties.map((f) => ({ value: f.id, label: f.name }))}
          onValueChange={(v) => setValue('facultyId' as keyof UserFormValues, Number(v) as never)}
        />
        <SelectField
          label="Jurusan"
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
          onValueChange={(v) => setValue('departmentId' as keyof UserFormValues, Number(v) as never)}
        />
      </div>
      <SelectField
        label="Kelas"
        options={classrooms.map((c) => ({ value: c.id, label: c.name }))}
        onValueChange={(v) => setValue('classroomId' as keyof UserFormValues, Number(v) as never)}
      />
    </div>
  )
}

function SelectField({
  label,
  options,
  onValueChange,
}: {
  label: string
  options: { value: number; label: string }[]
  onValueChange: (value: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Pilih ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={String(o.value)}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

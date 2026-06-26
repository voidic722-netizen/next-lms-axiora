'use client'

import { useEffect } from 'react'
import { type UseFormReturn, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { USER_ROLE } from '@/types/roles'
import type { Faculty } from '@/types/faculty'
import type { Department } from '@/types/department'
import type { Classroom } from '@/types/classroom'
import type { Subject } from '@/types/subject'
import type { CreateUserFormValues, UpdateUserFormValues } from '@/features/users/schemas/user-schema'

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
  const { setValue, control } = form
  const role = useWatch({ control, name: 'role' })
  const facultyId = useWatch({ control, name: 'facultyId' as keyof UserFormValues })
  const departmentId = useWatch({ control, name: 'departmentId' as keyof UserFormValues })

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
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Nama lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@domain.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={USER_ROLE.Admin}>Admin</SelectItem>
                  <SelectItem value={USER_ROLE.Teacher}>Teacher</SelectItem>
                  <SelectItem value={USER_ROLE.Student}>Student</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password{!isCreate && <span className="text-[#64748B] ml-1">(opsional)</span>}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={isCreate ? 'Min. 6 karakter' : 'Kosongkan jika tidak diubah'}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {role === USER_ROLE.Teacher && (
        <TeacherFormSection
          form={form}
          faculties={faculties}
          departments={filteredDepts}
          subjects={filteredSubjects}
        />
      )}

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
  const { control } = form

  return (
    <div className="space-y-4 border-t border-[#E2E8F0] pt-4">
      <p className="text-sm font-medium text-[#64748B]">Data Pengajar</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name={'position' as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posisi</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Pilih posisi" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {POSITION_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={'nidn' as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIDN</FormLabel>
              <FormControl>
                <Input placeholder="NIDN" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectFormField
          control={control}
          name="facultyId"
          label="Fakultas"
          options={faculties.map((f) => ({ value: f.id, label: f.name }))}
        />
        <SelectFormField
          control={control}
          name="departmentId"
          label="Jurusan"
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
        />
      </div>
      <SelectFormField
        control={control}
        name="subjectId"
        label="Mata Pelajaran"
        options={subjects.map((s) => ({ value: s.id, label: s.name }))}
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
  const { control } = form
  return (
    <div className="space-y-4 border-t border-[#E2E8F0] pt-4">
      <p className="text-sm font-medium text-[#64748B]">Data Mahasiswa</p>
      <FormField
        control={control}
        name={'nim' as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>NIM</FormLabel>
            <FormControl>
              <Input placeholder="NIM" {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectFormField
          control={control}
          name="facultyId"
          label="Fakultas"
          options={faculties.map((f) => ({ value: f.id, label: f.name }))}
        />
        <SelectFormField
          control={control}
          name="departmentId"
          label="Jurusan"
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
        />
      </div>
      <SelectFormField
        control={control}
        name="classroomId"
        label="Kelas"
        options={classrooms.map((c) => ({ value: c.id, label: c.name }))}
      />
    </div>
  )
}

function SelectFormField({
  control,
  name,
  label,
  options,
}: {
  control: any
  name: string
  label: string
  options: { value: number; label: string }[]
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : undefined}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Pilih ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={String(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
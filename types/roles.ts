export const USER_ROLE = {
  Admin: '1',
  Teacher: '2',
  Student: '3',
} as const

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE]

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  [USER_ROLE.Admin]: 'Admin',
  [USER_ROLE.Teacher]: 'Teacher',
  [USER_ROLE.Student]: 'Student',
}

export function isAdmin(role: UserRole): boolean {
  return role === USER_ROLE.Admin
}

export function isTeacher(role: UserRole): boolean {
  return role === USER_ROLE.Teacher
}

export function isStudent(role: UserRole): boolean {
  return role === USER_ROLE.Student
}

export function isTeacherOrAdmin(role: UserRole): boolean {
  return role === USER_ROLE.Admin || role === USER_ROLE.Teacher
}

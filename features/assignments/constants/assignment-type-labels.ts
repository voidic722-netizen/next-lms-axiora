/**
 * Maps assignment type keys (from the backend) to their display labels.
 * Single source of truth — was previously duplicated in 4 separate files.
 */
export const ASSIGNMENT_TYPE_LABELS: Record<string, string> = {
  kelompok: 'Kelompok',
  individu: 'Individu',
  praktek: 'Praktek',
  teori: 'Teori',
}

export const ASSIGNMENT_TYPE_OPTIONS = Object.entries(ASSIGNMENT_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
)

export function getAssignmentTypeLabel(type: string): string {
  return ASSIGNMENT_TYPE_LABELS[type] ?? type
}

export function getAssignmentTypeLabels(types: string[]): string[] {
  return types.map(getAssignmentTypeLabel)
}

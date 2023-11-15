export interface Group {
  dept_id: string,
  name: string
}

export interface GroupLesson {
  education_group_name: string,
  lesson_number: string,
  place: string, // classroom
  subgroup: string, // 0 / 1 / 2
  teacher_id: string,
  teacher_name: string,
  subject: string, // lesson name
  type: string, // lesson type
  date_lesson: string // YYYY-MM-DD
}
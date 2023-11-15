export interface Teacher {
  person_id: string,
  name: string
}

export interface TeacherLesson {
  education_group_name: string,
  education_group_id: string,
  lesson_number: string,
  place: string, // classroom
  subgroup: string, // 0 / 1 / 2
  subject: string, // lesson name
  type: string, // lesson type
  date_lesson: string // YYYY-MM-DD
}
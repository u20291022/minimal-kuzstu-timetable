import { Teacher, TeacherLesson } from "../types/teachers";
import { Request } from "./utils/request";

class Teachers {
  private apiSearchUri = "https://portal.kuzstu.ru/api/teachers";
  private apiScheduleUri = "https://portal.kuzstu.ru/api/teacher_schedule";

  public async search(teacherName: string): Promise<Teacher[]> {
    const searchRequest = this.getSearchRequestByTeacherName(teacherName);
    const teachers: Teacher[] = await searchRequest.get();
    return teachers;
  }

  private getSearchRequestByTeacherName(teacherName: string): Request {
    const teacherSearchParams = { teacher: teacherName };
    return new Request(this.apiSearchUri, teacherSearchParams);
  }

  public async getSchedule(teacherId: string): Promise<TeacherLesson[]> {
    const scheduleRequest = this.getScheduleRequestByTeacherId(teacherId);
    const teacherSchedule: TeacherLesson[] = await scheduleRequest.get();
    return teacherSchedule;
  }

  private getScheduleRequestByTeacherId(teacherId: string): Request {
    const teacherScheduleParams = { teacher_id: teacherId };
    return new Request(this.apiScheduleUri, teacherScheduleParams);
  }
}

export const teachers = new Teachers();
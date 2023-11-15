import { Group, GroupLesson } from "../types/groups";
import { Request } from "./utils/request";

class Groups {
  private apiSearchUri = "https://portal.kuzstu.ru/api/group";
  private apiScheduleUri = "https://portal.kuzstu.ru/api/student_schedule";

  public async search(groupName: string): Promise<Group[]> {
    const searchRequest = this.getSearchRequestByGroupName(groupName);
    const groups: Group[] = await searchRequest.get();
    return groups;
  }

  private getSearchRequestByGroupName(groupName: string): Request {
    const groupSearchParams = { group: groupName };
    return new Request(this.apiSearchUri, groupSearchParams);
  }

  public async getSchedule(groupId: string): Promise<GroupLesson[]> {
    const scheduleRequest = this.getScheduleRequestByGroupId(groupId);
    const groupSchedule: GroupLesson[] = await scheduleRequest.get();
    return groupSchedule;
  }

  private getScheduleRequestByGroupId(groupId: string): Request {
    const groupScheduleParams = { group_id: groupId };
    return new Request(this.apiScheduleUri, groupScheduleParams);
  }
}

export const groups = new Groups();
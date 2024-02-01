const lessonsTimes = [ "09:00", "10:50", "13:20", "15:10", "17:00", "18:50", "20:30" ];
let lessons = [];

function main() {
  inputs.setNowDateToInput();
  inputs.listenDateButtons();
  inputs.listenChangeEventOnDateInput();
  inputs.listenClickEventOnSearchButton();

  getScheduleByTypeAndId("group", "6479", "ИТб-222"); // default onload
}

function getScheduleByTypeAndId(type, id, name) {
  const request = new XMLHttpRequest();
  const requestUri = uri.getScheduleUriByType(type);
  const fullUri = requestUri + id;
  
  request.open("get", fullUri);
  request.send();

  request.onload = () => {
    lessons = JSON.parse(request.response);
    inputs.setSearchTarget(name);

    const currentDate = inputs.getCurrentDate();
    const filteredLessons = lessons.filter((lesson) => lesson.date_lesson === currentDate);

    display.displaySchedule(filteredLessons);
  }
}

class Inputs {
  searchTypeElement = document.getElementById("searchType");
  searchInputElement = document.getElementById("searchInput");
  searchButtonElement = document.getElementById("searchButton");

  timetableElement = document.getElementById("timetable");
  currentSearchTargetElement = document.getElementById("currentSearchTarget");

  dateInputElement = document.getElementById("dateInput");
  dateNextElement = document.getElementById("dateNext");
  dateBackElement = document.getElementById("dateBack");

  listenDateButtons() {
    const dayTime = 24 * 60 * 60 * 1000;

    this.dateBackElement.addEventListener("click", () => {
      const currentDate = new Date(this.getCurrentDate());
      const currentTime = currentDate.getTime();

      currentDate.setTime(currentTime - dayTime);

      const currentDateString = currentDate.toLocaleDateString("fr-CA");
      this.setCurrentDate(currentDateString);

      const filteredLessons = lessons.filter((lesson) => lesson.date_lesson === currentDateString);
      display.displaySchedule(filteredLessons);
    })

    this.dateNextElement.addEventListener("click", () => {
      const currentDate = new Date(this.getCurrentDate());
      const currentTime = currentDate.getTime();

      currentDate.setTime(currentTime + dayTime);

      const currentDateString = currentDate.toLocaleDateString("fr-CA");
      this.setCurrentDate(currentDateString);

      const filteredLessons = lessons.filter((lesson) => lesson.date_lesson === currentDateString);
      display.displaySchedule(filteredLessons);
    })
  }

  listenClickEventOnSearchButton() {
    this.searchButtonElement.addEventListener("click", () => {
      const searchText = this.getSearchText();
      if (searchText.length < 2) return;

      const searchType = this.getSearchType();
      const searchUri = uri.getSearchUriByType(searchType);
      const fullUri = searchUri + searchText;

      const request = new XMLHttpRequest();
      
      request.open("get", fullUri);
      request.send();

      request.onload = () => {
        const hintsString = request.response;
        const hints = JSON.parse(hintsString);
        display.displaySearchHints(hints);
      };
    })
  }

  listenChangeEventOnDateInput() {
    this.dateInputElement.addEventListener("change", () => {
      const currentDate = inputs.getCurrentDate();
      const filteredLessons = lessons.filter((lesson) => lesson.date_lesson === currentDate);

      display.displaySchedule(filteredLessons);
    })
  }

  getCurrentDate() {
    return this.dateInputElement.value;
  }

  setNowDateToInput() {
    const currentDateString = new Date().toLocaleDateString("fr-CA"); // fr-CA is YYYY-mm-dd
    this.setCurrentDate(currentDateString);
  }

  setCurrentDate(dateString) {
    this.dateInputElement.value = dateString;
  }
  
  getSearchType() {
    return this.searchTypeElement.value; // group || teacher
  }

  getSearchText() {
    return this.searchInputElement.value;
  }

  setSearchTarget(target) {
    this.currentSearchTargetElement.textContent = target;
  }
}

const inputs = new Inputs();

class URI {
  searchGroup = "https://api.u20291022.info/timetable/searchGroup?groupName=";
  getGroupSchedule = "https://api.u20291022.info/timetable/getGroupSchedule?groupId=";
  searchTeacher = "https://api.u20291022.info/timetable/searchTeacher?teacherName=";
  getTeacherSchedule = "https://api.u20291022.info/timetable/getTeacherSchedule?teacherId=";

  getSearchUriByType(searchType) {
    return searchType === "group" ? this.searchGroup : this.searchTeacher;
  }

  getScheduleUriByType(searchType) {
    return searchType === "group" ? this.getGroupSchedule : this.getTeacherSchedule;
  }
}

const uri = new URI();

class Display {
  displaySearchHints(hints) {    
    const html = new HTML();

    for (let hint of hints) {
      const scheduleType = hint.dept_id ? "group" : "teacher";
      const scheduleId = scheduleType === "group" ? hint.dept_id : hint.person_id;

      html.openTableRowTag();
      {
        html.openTableDataTag("align='center'");
        {
          html.link(hint.name, "#", `onclick="getScheduleByTypeAndId('${scheduleType}', '${scheduleId}', '${hint.name}')"`);
        }
        html.closeTableDataTag();
      }
      html.closeTableRowTag();
    }

    html.display();
  }

  displaySchedule(lessons) {
    const html = new HTML();

    if (lessons.length === 0) {
      html.paragraph("Нет пар на этот день!", "align='center'");
    }

    for (let lessonId = 0; lessonId < lessons.length; lessonId++) {
      const lesson = lessons[lessonId];
      const previousLesson = lessonId > 0 ? lessons[lessonId - 1] : null;
      const scheduleType = lesson.teacher_id ? "group" : "teacher";

      html.openTableTag();
      {
        // time and lesson number
        if (!previousLesson || lesson.lesson_number !== previousLesson.lesson_number) {
          // add empty row between lessons
          if (lessonId > 0) {
            html.openTableRowTag();
            {
              html.openTableDataTag("colspan='2'");
              {
                html.paragraph("");
              }
              html.closeTableDataTag();
            }
            html.closeTableRowTag();
          }
          
          html.openTableRowTag();
          {
            html.openTableDataTag(`align="center" colspan="2"`);
            {
              html.text(`${lesson.lesson_number} пара - ${lessonsTimes[lesson.lesson_number - 1]}`);
            }
            html.closeTableDataTag();
          }
          html.closeTableRowTag();
        }

        // subgroup
        if (lesson.subgroup !== "0") {
          html.openTableRowTag();
          {
            html.openTableDataTag(`align="center" colspan="2"`);
            {
              html.text(`${lesson.subgroup} подгруппа`);
            }
            html.closeTableDataTag();
          }
          html.closeTableRowTag();
        }

        // subject
        html.openTableRowTag("colspan='2'");
        {
          html.openTableDataTag("width='50%' align='center'");
          {
            html.text("Дисциплина");
          }
          html.closeTableDataTag();
    
          html.openTableDataTag("width='50%' align='center'");
          {
            html.text(`${lesson.type} ${lesson.subject}`);
          }
          html.closeTableDataTag();
        }
        html.closeTableRowTag();

        // teacher || group
        html.openTableRowTag();
        {
          if (scheduleType === "group") {
            html.openTableDataTag(`width="50%" align="center"`);
            {
              html.text("Преподаватель");
            }
            html.closeTableDataTag();

            html.openTableDataTag(
              `width="50%" align="center" onclick="getScheduleByTypeAndId('teacher', '${lesson.teacher_id}', '${lesson.teacher_name}')"`
            );
            {
              html.link(`${lesson.teacher_name}`);
            }
            html.closeTableDataTag();
          }
          else {
            html.openTableDataTag(`width="50%" align="center"`);
            {
              html.text("Группа");
            }
            html.closeTableDataTag();

            html.openTableDataTag(
              `width="50%" align="center" onclick="getScheduleByTypeAndId('group', '${lesson.education_group_id}', '${lesson.education_group_name}')"`
            );
            {
              html.link(`${lesson.education_group_name}`);
            }
            html.closeTableDataTag();
          }
        }
        html.closeTableRowTag();

        html.openTableRowTag("colspan='2'");
        {
          html.openTableDataTag("width='50%' align='center'");
          {
            html.text("Аудитория");
          }
          html.closeTableDataTag();
    
          html.openTableDataTag("width='50%' align='center'");
          {
            html.text(`${lesson.place}`);
          }
          html.closeTableDataTag();
        }
        html.closeTableRowTag();
      }
      html.closeTableTag();
    }
  
    html.display();
  }
}

const display = new Display();

class HTML {
  currentHtml = "";

  text(text) {
    this.currentHtml += text;
  }

  paragraph(text, attributes = "") {
    this.currentHtml += `<p ${attributes}>${text}</p>`;
  }

  link(text, url="#", attributes="") {
    this.currentHtml += `<a href=${url} ${attributes}>${text}</a>`;
  }
  
  openTableDataTag(attributes = "") {
    this.currentHtml += `<td ${attributes}>`;
  }
  
  closeTableDataTag() {
    this.currentHtml += `</td>`;
  }
  
  openTableRowTag(attributes = "") {
    this.currentHtml += `<tr ${attributes}>`;
  }
  
  closeTableRowTag() {
    this.currentHtml += `</tr>`;
  }
  
  openTableTag(attributes = "") {
    this.currentHtml += `<table ${attributes}>`;
  }
  
  closeTableTag() {
    this.currentHtml += `</table>`;
  }

  clear() {
    inputs.timetableElement.innerHTML = "";
    this.currentHtml = "";
  }

  display() {
    inputs.timetableElement.innerHTML = this.currentHtml;
  }
}

main();
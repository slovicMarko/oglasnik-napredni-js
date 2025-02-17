import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateTimeFormat",
})
export class DateTimeFormatPipe implements PipeTransform {
  transform(
    value: string | Date,
    format: string = "dd.MM.yyyy. HH:mm"
  ): string {
    if (!value) return "";

    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return new Intl.DateTimeFormat("hr-HR", options).format(date);
  }
}

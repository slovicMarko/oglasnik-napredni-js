import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "currencyFormat",
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currency: string = "€"): string {
    if (value == null) return "";
    return (
      new Intl.NumberFormat("hr-HR", { minimumFractionDigits: 2 }).format(
        value
      ) + ` ${currency}`
    );
  }
}

export class CreateRoutineDto {
  category: string;
  name: string;
  date: string;
  sets: {
    series: number;
    repetitions: number;
    weight?: string;
    time?: string;
    rest?: string;
  }[];
  observations?: string;
}

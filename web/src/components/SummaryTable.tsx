import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDates } from "../utils/generate-dates";
import HabitDay from "./HabitDay";

const weekDays: string[] = [
  'D', 'S', 'T',
  'Q', 'Q', 'S', 'S'
];

const summaryDates = generateDates();

const minimumSummryDatesSize = 18 * 7 //18 Semanas
const amountOfDatesToFill = minimumSummryDatesSize - summaryDates.length;

type Summary = Array<{
  id: string;
  data: string;
  amount: number;
  completed: number
}>

export default () => {

  const [summary, setSummary] = useState<Summary>([]);

  useEffect(() => {

    api.get('summary').then(res => {
      setSummary(res.data);
    })

  }, []);

  return(
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {
          weekDays.map((day, key) => (
            <div 
              key={key}
              className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold"
            >
              {day}
            </div>
          ))
        }
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 && summaryDates.map(date => {

            //VERIFICAR SE EXISTE HÁBITOS NAS DATAS DO MÊS
            const dayInSummary = summary.find(day => {
              return dayjs(date).isSame(day.data, 'day')
            })

            return (
              <HabitDay 
                key={date.toString()}
                date={date}
                amount={dayInSummary?.amount} 
                defaultCompleted={dayInSummary?.completed} 
              />
            )
          })}   

        {
          amountOfDatesToFill > 0 && Array.from({ length: amountOfDatesToFill }).map((_, i) => (
            <div key={i} className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40
            cursor-not-allowed"/>
          ))
        }     
      </div>
    </div>
  );
}
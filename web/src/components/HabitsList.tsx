import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitsListProps{
  date: Date;
  onCompletedChanged: (completed: number) => void;
}

interface HabitsInfo{
  possibleHabits: {
    id: string;
    title: string;
    created_at: string
  }[],
  completedHabits: string[]
}

export default ({ date, onCompletedChanged }: HabitsListProps) => {

  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  useEffect(() => {
    
    api.get('day', {
      params: {
        date: date.toISOString()
      }
    })
    .then(res => {
      setHabitsInfo(res.data);
    });
    
  }, []);

  const isDateInPast = dayjs(date)
  .endOf('day')
  .isBefore(new Date());

  const handleToggleHabit = async (habitId: string) => {
    await api.patch(`/habits/${habitId}/toggle`);

    const isAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId);

    let completedHabits: string[] = []

    if(isAlreadyCompleted){
      completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId);
    } else{
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    });

    onCompletedChanged(completedHabits.length);
  }

  return(
    <div>
      <div className="mt-6 flex flex-col gap-3">
        {habitsInfo?.possibleHabits.map(habit => (
          <Checkbox.Root
            key={habit.id}
            disabled={isDateInPast}
            onCheckedChange={() => handleToggleHabit(habit.id)}
            defaultChecked={habitsInfo.completedHabits.includes(habit.id)}
            className="flex items-center gap-3 group"
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zing-900
            border-2 border-zinc-800 group-data-[state=checked]:bg-green-500
            group-data-[state=checked]:border-green-500">
              <Checkbox.Indicator>
                <Check size={20} color="#FFF"/>
              </Checkbox.Indicator>
            </div>

            <span className="group-data-[state=checked]:line-through font-semibold text-xl text-white 
            leading-tight group-data-[state=checked]:text-zinc-400">
              {habit.title}
            </span>
          </Checkbox.Root>
        ))}
      </div>
    </div>
  );
}
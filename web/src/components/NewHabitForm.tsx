import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';

import { Check, Plus, X } from 'phosphor-react';
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

const avaliableWeekDays: string[] = [
  'Domingo', 'Segunda-feira',
  'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira',
  'Sábado'
]

export default () => {

  const [title, setTitle] = useState<string>("");
  const [weekDays, setWeekDays] = useState<number[]>([]);

  const createNewHabit = async (e: FormEvent) => {
    e.preventDefault();

    if(!title || weekDays.length === 0){
      return
    } 

    await api.post('habits', {
      title,
      weekDays
    })

    setTitle('');
    setWeekDays([]);
    
    alert("Hábito criado com sucesso!")
  }

  const handleToggleWeekDay = (weekDay: number) => {
    if(weekDays.includes(weekDay)){
      const weekDayWithRemovedOnde = weekDays.filter(day => day !== weekDay);

      setWeekDays(weekDayWithRemovedOnde)
    } else{
      setWeekDays([...weekDays, weekDay]);
    }
  }

  return(
    <Dialog.Root>
        <Dialog.Trigger 
          type="button"
          className="rounded-lg border border-violet-500 font-semibold px-4 py-3
          flex items-center gap-3 hover:border-violet-400"
        >
          <Plus size={20} className="text-violet-500"/>

          Novo hábito
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0"/>

          <Dialog.Content className="absolute top-1/2 left-1/2 p-5 -translate-x-1/2 -translate-y-1/2
          bg-zinc-900 rounded-2xl w-full max-w-md">
            <Dialog.Close className="w-7 h-7 flex items-center justify-center bg-zinc-800 rounded 
            absolute top-5 right-6 text-zinc-400 hover:text-zinc-200">
              <X
                size={24}
                aria-label="Fechar"
              />  
            </Dialog.Close>

            <Dialog.Title className="text-2xl leading-tight font-bold">
              Criar hábito
            </Dialog.Title>

            <form onSubmit={e => createNewHabit(e)} className="w-full flex flex-col mt-6">
              <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu comprometimento?
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="ex.:Exercícios, dormi bem, etc..."
                autoFocus
                className="p-3 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
              />

              <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência?
              </label>

              <div className="mt-3 flex flex-col gap-2">
                {
                  avaliableWeekDays.map((weekDay, index) => (
                    <Checkbox.Root 
                      key={index} 
                      checked={weekDays.includes(index)}
                      className="flex items-center gap-3 group"
                      onCheckedChange={() => handleToggleWeekDay(index)}
                    >
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zing-900
                      border-2 border-zinc-800 group-data-[state=checked]:bg-green-500
                      group-data-[state=checked]:border-green-500">
                        <Checkbox.Indicator>
                          <Check size={20} color="#FFF"/>
                        </Checkbox.Indicator>
                      </div>

                      <span className="text-white leading-tight">
                        {weekDay}
                      </span>
                    </Checkbox.Root>
                  ))
                }
              </div>
              
              <button type="submit" className="mt-6 rounded-lg p-3 gap-3 flex items-center font-semibold
              justify-center bg-green-600 hover:bg-green-500 transition-colors focus:outline-gray-700">
                <Check size={20} weight="bold"/>

                Confirmar
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
  );
}
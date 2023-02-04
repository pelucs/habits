import { Plus, X } from 'phosphor-react';

import logo from '../assets/logo.svg'
import NewHabitForm from './NewHabitForm';

export default () => {
  return(
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
      <img src={logo} alt="Habit"/>

      <NewHabitForm/>
    </div>
  )
}
import React from 'react';
import { createQuestion } from '../../assets/functions';
import { STRINGS } from '../../assets/strings';

const question = createQuestion(STRINGS.ADDITION);

export default function Home() {
   console.log(question);

   return (
      <div>Home</div>
   );
}

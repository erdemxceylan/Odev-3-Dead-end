import React, { useEffect, useState } from 'react';
import { STRINGS } from '../../assets/strings';
import { useNavigate } from 'react-router-dom';
import { useAnswer } from '../../context/use-answer';
import { useRound } from '../../context/use-round';
import { useResult } from '../../context/use-result';
import { useTotals } from '../../context/use-totals';
import Legend from '../legend';
import Choices from '../choices';
import * as svgs from '../../assets/svgs';
import './styles.scss';

const { CORRECT, INCORRECT } = STRINGS;
const face = { success: svgs.face.happy, fail: svgs.face.sad, default: svgs.face.thinking };
const initialQuestion = { first: 7, operation: 'x', second: 8, points: 3, choices: [56, 49, 64] };

export default function Round() {
   const { answer, setAnswer, set } = useAnswer();
   const { setTotals } = useTotals();
   const { round, setRound } = useRound();
   const { setResult } = useResult();
   const navigate = useNavigate();

   const { score, no, questions } = round;

   const [isSelected, setIsSelected] = useState(null);
   const [questionCounter, setQuestionCounter] = useState(1);
   const [question, setQuestion] = useState(questions[questionCounter - 1]);

   const { first, operation, second, points, choices } = question || initialQuestion;

   function onChoiceSelect(isCorrect, choice, index) {
      if (!answer) {
         setAnswer(isCorrect ? CORRECT : INCORRECT);
         setIsSelected(index);
         setRound(previous => {
            const { score, ...rest } = previous;
            const newScore = isCorrect ? score + points : score;
            return { score: newScore, ...rest };
         });
         setTotals(previous => {
            return {
               score: isCorrect ? previous.score + points : previous.score,
               correctAnswers: isCorrect ? previous.correctAnswers + 1 : previous.correctAnswers + 0,
               wrongAnswers: isCorrect ? previous.wrongAnswers + 0 : previous.wrongAnswers + 1,
               questionsSolved: previous.questionsSolved + 1
            };
         });
         setResult(previous => {
            return {
               score: previous.score,
               correctAnswers: isCorrect ? previous.correctAnswers + 1 : previous.correctAnswers + 0,
               wrongAnswers: isCorrect ? previous.wrongAnswers + 0 : previous.wrongAnswers + 1,
               results: [...previous.results, { first, operation, second, choice, isCorrect }]
            };
         });
      }
   }

   useEffect(() => {
      if (answer) {
         setTimeout(() => {
            setAnswer(null);
            setIsSelected(null);

            if (questionCounter < 10) {
               setQuestionCounter(x => x + 1);
               setQuestion(questions[questionCounter]);
            } else {
               setResult(previous => {
                  return {
                     score,
                     correctAnswers: previous.correctAnswers,
                     wrongAnswers: previous.wrongAnswers,
                     results: previous.results
                  };
               });
               navigate('/result');
            }
         }, 1000);
      }
   }, [round, score, setResult, answer, setAnswer, questions, questionCounter, setQuestionCounter, navigate]);

   return (
      <>
         <div className='schema'>
            {svgs.schema}
            {set(face)}
            <Legend score={score} no={no} questionCounter={questionCounter} />
            <Choices choices={choices} isSelected={isSelected} onClick={onChoiceSelect} />
            <p className='question'>{operation === 'x' ? `${first} ${operation} ${second}` : `${first}${operation}${second}`}</p>
         </div>
         {/* {svgs.check} */}
      </>
   );
}
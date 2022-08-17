import { STRINGS } from '../strings';

const { ADDITION, SUBSTRACTION, MULTIPLICATION, DIVISION } = STRINGS;

const randomIntegerBetween = (min, max) => Math.floor(min + (max - min + 1) * Math.random());

const findDivisors = number => {
   let divisors = [];

   for (let i = 2; i < 10; i++) {
      if (!(number % i)) divisors.push(i);
   }

   return divisors;
};

function createOperands(type) {
   let first; let second; let divisors;

   const lowerBound = type !== MULTIPLICATION ? 10 : 2;
   const upperBound = [SUBSTRACTION, DIVISION].includes(type) ? 99 : type === ADDITION ? 49 : 9;

   first = randomIntegerBetween(lowerBound, upperBound);
   second = randomIntegerBetween(lowerBound, upperBound);

   if ([SUBSTRACTION, MULTIPLICATION].includes(type)) {
      const max = Math.max(first, second);
      const min = Math.min(first, second);
      first = max; second = min;
   }

   if (type === DIVISION) {
      while (true) {
         first = randomIntegerBetween(lowerBound, upperBound);
         divisors = findDivisors(first);
         if (divisors.length > 0) break;
      }
      second = Math.max(...divisors);
   }

   return { first, second };
};

function createQuestion(type) {
   let answer; let decoy1; let decoy2; let points; let operation;

   let { first, second } = createOperands(type);

   switch (type) {
      case ADDITION:
         answer = first + second;
         decoy1 = answer >= 90 ? answer - 10 : answer + 10;
         decoy2 = answer + 1;
         points = 2;
         operation = '+';
         break;
      case SUBSTRACTION:
         answer = first - second;
         decoy1 = answer + 10;
         decoy2 = answer + 1;
         points = 3;
         operation = '-';
         break;
      case MULTIPLICATION:
         answer = first * second;
         decoy1 = (first - 1) * second;
         decoy2 = first * (second + 1);
         points = 4;
         operation = 'x';
         break;
      case DIVISION:
         answer = first / second;
         decoy1 = answer + 1;
         decoy2 = answer - 1;
         operation = '/';
         points = 5;
         break;
      default:
         break;
   }

   return { first, operation, second, points, choices: [answer, decoy1, decoy2] };
};

export const createQuestions = type => new Array(10).fill(null).map(() => createQuestion(type));

export const checkAnswer = (q, a) => q.choices[0] === a;
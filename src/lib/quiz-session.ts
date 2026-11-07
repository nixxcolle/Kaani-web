import type { QuizQuestion } from './data';

function shuffle<T>(values: T[]) {
  const result=[...values];
  for(let i=result.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
  return result;
}

export function validModuleQuestion(question: QuizQuestion, moduleId: string) {
  const choices=[question.choice_a,question.choice_b,question.choice_c,question.choice_d];
  return !!moduleId && question.module_id===moduleId && !!question.id && !!question.question?.trim() && !!question.explanation?.trim() && /^[ABCD]$/.test(question.correct_answer) && choices.every(c=>typeof c==='string' && c.trim()) && new Set(choices.map(c=>c.trim().toLowerCase())).size===4;
}

export function prepareModuleQuiz(questions: QuizQuestion[], moduleId: string) {
  const unique=[...new Map(questions.filter(q=>validModuleQuestion(q,moduleId)).map(q=>[q.id,q])).values()];
  return shuffle(unique).slice(0,10).map(q=>{
    const choices=[q.choice_a,q.choice_b,q.choice_c,q.choice_d];
    const correct=choices['ABCD'.indexOf(q.correct_answer)];
    const mixed=shuffle(choices);
    return {...q,choice_a:mixed[0],choice_b:mixed[1],choice_c:mixed[2],choice_d:mixed[3],correct_answer:'ABCD'[mixed.indexOf(correct)]};
  });
}

export function gradeModuleQuiz(questions: QuizQuestion[], answers: Record<string,string>, moduleId: string) {
  if(questions.some(q=>!validModuleQuestion(q,moduleId)) || new Set(questions.map(q=>q.id)).size!==questions.length) throw new Error('Quiz questions do not match the selected module. Please restart.');
  const correct=questions.filter(q=>answers[q.id]===q.correct_answer).length;
  return { correct,total:questions.length,percentage:questions.length?Math.round(correct/questions.length*100):0 };
}

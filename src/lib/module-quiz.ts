import type { QuizQuestion } from './data';

const ignored = new Set('about after again against also among because before being below between could during every first further given have having into learning material module more most other ought shall should some such than that their them then there these they this those through under until very what when where which while whose will with would your objectives introduction university chapter contents references copyright answer questions activity assessment includes contains provides requires means refers consists helps understanding applying'.split(' '));

export function cleanModulePages(pages: string[]) {
  const lines = pages.map(page=>page.split('\n').map(line=>line.trim()).filter(Boolean));
  const counts = new Map<string,number>();
  const key = (line: string) => line.replace(/\d+/g,'#').replace(/\s+/g,' ').toLowerCase();
  for (const page of lines) for (const header of new Set([...page.slice(0,4),...page.slice(-4)].map(key))) counts.set(header,(counts.get(header)||0)+1);
  return lines.map(page=>page.filter((line,i)=>{
    if (i>=4 && i<page.length-4) return true;
    return !/^\d+$/.test(line) && (counts.get(key(line))||0)<Math.max(2,Math.ceil(pages.length/2));
  }).join('\n')).join('\n');
}

/** Extractive recall: every answer and explanation is an exact span of this module, never a shared question bank. */
export function generateModuleQuestions(moduleId: string, text: string, category = 'Module Content'): QuizQuestion[] {
  const clean = text.replace(/(\p{L})-\s*\n\s*(\p{L})/gu,'$1$2').replace(/\s+/g,' ').trim();
  const sentences = [...new Set((clean.match(/[^.!?]+[.!?](?:\s|$)/g) || []).map(s=>s.trim()))]
    .filter(s=>s.length>=65 && s.length<=450 && /\b(is|are|refers|consists|contains|provides|helps|requires|uses|means|includes|can|has|have|was|were|ay|mga|ng|an|han)\b/i.test(s) && !/https?:|www\.|copyright|all rights reserved|learning outcomes|at the end of|references|this learning|student|course subject|information sheet|learning packet|begin by|intended learning/i.test(s));
  const words = [...new Set(sentences.join(' ').match(/\b[A-Za-z][A-Za-z-]{4,24}\b/g) || [])].filter(word=>!ignored.has(word.toLowerCase()));
  const questions: QuizQuestion[] = [];
  const usedAnswers = new Set<string>();
  for (const sentence of sentences) {
    const candidates = (sentence.match(/\b[A-Za-z][A-Za-z-]{4,24}\b/g) || []).filter(word=>!ignored.has(word.toLowerCase()) && !usedAnswers.has(word.toLowerCase()));
    const answer = candidates.sort((a,b)=>b.length-a.length)[0];
    if (!answer) continue;
    const distractors = words.filter(word=>word.toLowerCase()!==answer.toLowerCase() && !sentence.toLowerCase().includes(word.toLowerCase()));
    const unique = [...new Map(distractors.map(word=>[word.toLowerCase(),word])).values()];
    if (unique.length<3) continue;
    usedAnswers.add(answer.toLowerCase());
    const difficulty = sentence.length>240 ? 'Hard' : sentence.length>140 ? 'Medium' : 'Easy';
    questions.push({ id: `${moduleId}-recall-${questions.length}`, module_id: moduleId, category, difficulty,
      question: `Complete this statement from the selected module: “${sentence.replace(new RegExp(`\\b${answer}\\b`,'g'),'_____')}”`,
      choice_a: answer, choice_b: unique[0], choice_c: unique[Math.floor(unique.length/2)], choice_d: unique[unique.length-1], correct_answer: 'A', explanation: sentence, image_url: null });
    if (questions.length===60) break;
  }
  return questions;
}

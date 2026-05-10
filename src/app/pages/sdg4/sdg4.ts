import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sdg4',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sdg4.html',
  styleUrl: './sdg4.css'
})
export class Sdg4Component {

  targets = [
    { id: '4.1', title: 'Universal Primary & Secondary Education', text: 'Ensure all girls and boys complete free, equitable and quality primary and secondary education leading to relevant and effective learning outcomes.', icon: '' },
    { id: '4.2', title: 'Early Childhood Development', text: 'Ensure all girls and boys have access to quality early childhood development, care and pre-primary education so they are ready for primary education.', icon: '' },
    { id: '4.3', title: 'Technical & Vocational Education', text: 'Ensure equal access for all women and men to affordable and quality technical, vocational and tertiary education, including university.', icon: '' },
    { id: '4.4', title: 'Skills for Employment', text: 'Substantially increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment and entrepreneurship.', icon: '' },
    { id: '4.5', title: 'Gender Equality in Education', text: 'Eliminate gender disparities in education and ensure equal access to all levels of education and vocational training for the vulnerable, including persons with disabilities and indigenous peoples.', icon: '' },
    { id: '4.6', title: 'Literacy & Numeracy', text: 'Ensure that all youth and a substantial proportion of adults, both men and women, achieve literacy and numeracy by 2030.', icon: '' },
    { id: '4.7', title: 'Education for Sustainable Development', text: 'Ensure that all learners acquire the knowledge and skills needed to promote sustainable development, including education for human rights, gender equality, peace, and global citizenship.', icon: '' },
  ];

  contributions = [
    { icon: '', title: 'Promotes Self-Directed Learning', text: 'Subject tracking and goal-setting build the intrinsic motivation that quality education research identifies as key to lifelong learning — directly supporting SDG 4.4.' },
    { icon: '', title: 'Open Access Resources', text: 'Using the Open Library API, EduTrack connects students to millions of free books — removing the financial barrier to quality educational materials and supporting SDG 4.1 and 4.3.' },
    { icon: '', title: 'Evidence-Based Study Methods', text: 'The Pomodoro technique is backed by cognitive science research. EduTrack makes it accessible to every student without expensive software, supporting SDG 4.4.' },
    { icon: '', title: 'Raising SDG Awareness', text: 'Every EduTrack user learns about the global education crisis, fostering the global citizenship mindset that SDG 4.7 explicitly calls for.' },
    { icon: '', title: 'Goal-Oriented Education', text: 'Daily goal tracking mirrors the structured learning habits that UNESCO identifies as critical for academic success among disadvantaged learners.' },
    { icon: '', title: 'Barrier-Free Access', text: 'EduTrack is free, web-based, and requires no downloads — making quality study tools accessible regardless of economic background, aligned with SDG 4.5.' },
  ];

  globalFacts = [
    { emoji: '', fact: 'Sub-Saharan Africa has the highest rates of education exclusion — over 1 in 5 children of primary school age are out of school.' },
    { emoji: '', fact: 'Girls are more likely than boys to never set foot in a classroom. In some regions, only 1 in 5 girls completes lower secondary school.' },
    { emoji: '', fact: 'Children from the poorest households are 3x more likely to be out of school than those from the richest households.' },
    { emoji: '', fact: 'Even children who go to school are not always learning — 6 out of 10 children and adolescents worldwide cannot read or do basic math.' },
    { emoji: '', fact: 'COVID-19 caused the largest disruption to education in history — over 1.6 billion learners were affected at its peak.' },
    { emoji: '', fact: 'Every additional year of schooling increases an individual\'s earnings by roughly 10%, yet millions are denied this opportunity.' },
  ];

  quizQuestions = [
    {
      question: 'How many children and youth are currently out of school worldwide?',
      options: ['58 million', '128 million', '258 million', '400 million'],
      correct: 2,
      explanation: 'According to UNESCO, approximately 258 million children and youth were out of school before the COVID-19 pandemic made the crisis even worse.'
    },
    {
      question: 'What does SDG 4.7 specifically call for?',
      options: ['More school buildings', 'Education for sustainable development and global citizenship', 'Higher teacher salaries', 'Free university tuition'],
      correct: 1,
      explanation: 'SDG 4.7 focuses on ensuring learners acquire knowledge for sustainable development, human rights, gender equality, peace, and global citizenship.'
    },
    {
      question: 'By 2030, what proportion of countries are projected to lack sufficient trained teachers?',
      options: ['10%', '20%', '40%', '60%'],
      correct: 2,
      explanation: 'UNESCO projects that 40% of countries will not have enough trained teachers to achieve universal primary and secondary education by 2030.'
    },
    {
      question: 'How many adults worldwide lack basic literacy skills?',
      options: ['273 million', '500 million', '773 million', '1 billion'],
      correct: 2,
      explanation: '773 million adults — two-thirds of whom are women — lack basic literacy skills, severely limiting their economic and social opportunities.'
    },
    {
      question: 'Which group faces the most barriers to education globally?',
      options: ['Urban youth', 'Girls and women in low-income countries', 'College graduates', 'Children in wealthy nations'],
      correct: 1,
      explanation: 'Girls and women in low-income countries face compounded barriers including poverty, cultural norms, early marriage, and lack of safe schools.'
    },
  ];

  currentQuestion = signal(0);
  selectedAnswer = signal<number | null>(null);
  showResult = signal(false);
  score = signal(0);
  quizComplete = signal(false);
  answeredQuestions = signal<boolean[]>([false, false, false, false, false]);

  selectAnswer(index: number) {
    if (this.showResult()) return;
    this.selectedAnswer.set(index);
    this.showResult.set(true);
    if (index === this.quizQuestions[this.currentQuestion()].correct) {
      this.score.update(s => s + 1);
    }
  }

  nextQuestion() {
    const next = this.currentQuestion() + 1;
    if (next >= this.quizQuestions.length) {
      this.quizComplete.set(true);
    } else {
      this.currentQuestion.set(next);
      this.selectedAnswer.set(null);
      this.showResult.set(false);
    }
  }

  restartQuiz() {
    this.currentQuestion.set(0);
    this.selectedAnswer.set(null);
    this.showResult.set(false);
    this.score.set(0);
    this.quizComplete.set(false);
  }

  getScoreMessage(): string {
    const s = this.score();
    if (s === 5) return 'Perfect score! You truly understand SDG 4.';
    if (s >= 3) return 'Great job! You have a solid understanding of SDG 4.';
    if (s >= 2) return '📖 Not bad — review the facts above and try again!';
    return '🌱 Keep learning — SDG 4 knowledge is the first step to change.';
  }
}
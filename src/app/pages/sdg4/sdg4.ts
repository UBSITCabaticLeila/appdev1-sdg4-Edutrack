import { Component } from '@angular/core';
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
    { id: '4.1', title: 'Universal Primary & Secondary Education', text: 'Ensure all girls and boys complete free, equitable and quality primary and secondary education.' },
    { id: '4.2', title: 'Early Childhood Development', text: 'Ensure all girls and boys have access to quality early childhood development and pre-primary education.' },
    { id: '4.3', title: 'Technical & Vocational Education', text: 'Ensure equal access for all to affordable and quality technical, vocational and tertiary education.' },
    { id: '4.4', title: 'Skills for Employment', text: 'Substantially increase the number of youth and adults who have relevant skills for employment and entrepreneurship.' },
    { id: '4.5', title: 'Gender Equality in Education', text: 'Eliminate gender disparities in education and ensure equal access for all, including persons with disabilities.' },
    { id: '4.6', title: 'Literacy & Numeracy', text: 'Ensure all youth and a substantial proportion of adults achieve literacy and numeracy.' },
    { id: '4.7', title: 'Education for Sustainable Development', text: 'Ensure learners acquire knowledge and skills needed to promote sustainable development and global citizenship.' },
  ];

  contributions = [
    { icon: '📊', title: 'Promotes Self-Directed Learning', text: 'Subject tracking and goal-setting build the intrinsic motivation that quality education research identifies as key to lifelong learning.' },
    { icon: '📚', title: 'Open Access Resources', text: 'Using the Open Library API, EduTrack connects students to millions of free books — reducing the financial barrier to quality educational materials.' },
    { icon: '⏱️', title: 'Evidence-Based Study Methods', text: 'The Pomodoro technique is backed by cognitive science research — EduTrack makes it accessible to every student without expensive software.' },
    { icon: '🌍', title: 'Raising SDG Awareness', text: 'Every user of EduTrack learns about the global education crisis, fostering the global citizenship mindset that SDG 4.7 calls for.' },
  ];
}
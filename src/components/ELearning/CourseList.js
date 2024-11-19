// components/ELearning/CourseList.js
import Link from 'next/link';

export default function CourseList({ courses }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <div key={course.id} className="bg-[#0C1A0E] rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#F0EDE5] mb-2">{course.title}</h2>
            <p className="text-[#A1A0A0] mb-4">{course.description}</p>
            <Link href={`/elearning/course/${course.id}`}>
              <a className="inline-block bg-[#C29022] text-[#0C0C0C] py-2 px-4 rounded hover:bg-[#A37E2B] transition duration-300">
                Inizia il corso
              </a>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
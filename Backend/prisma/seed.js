import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clean the database
  await prisma.completedLecture.deleteMany();
  await prisma.courseProgress.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.courseRating.deleteMany();
  await prisma.lecture.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleared.");

  // Create Users
  const educator = await prisma.user.create({
    data: {
      id: "user_educator_123",
      name: "Professor John Doe",
      email: "johndoe@example.com",
      imgUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    }
  });

  const student = await prisma.user.create({
    data: {
      id: "user_student_456",
      name: "Jane Smith",
      email: "janesmith@example.com",
      imgUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    }
  });

  console.log("Users created:", educator.name, student.name);

  // Create Course
  const course = await prisma.course.create({
    data: {
      courseTitle: "Introduction to JavaScript",
      courseDescription: "Learn JavaScript from scratch. Covers variables, control flow, functions, objects, DOM manipulation and ES6+ features.",
      courseThumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=640&q=80",
      coursePrice: 99.99,
      isPublished: true,
      discount: 10,
      educatorId: educator.dbId,
      courseContent: {
        create: [
          {
            chapterId: "chapter_1",
            chapterOrder: 1,
            chapterTitle: "Getting Started",
            chapterContent: {
              create: [
                {
                  lectureId: "lecture_1_1",
                  lectureTitle: "Course Introduction",
                  lectureDuration: 5,
                  lectureUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  isPreviewFree: true,
                  lectureOrder: 1,
                },
                {
                  lectureId: "lecture_1_2",
                  lectureTitle: "Setting up your IDE",
                  lectureDuration: 10,
                  lectureUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  isPreviewFree: false,
                  lectureOrder: 2,
                }
              ]
            }
          },
          {
            chapterId: "chapter_2",
            chapterOrder: 2,
            chapterTitle: "JavaScript Fundamentals",
            chapterContent: {
              create: [
                {
                  lectureId: "lecture_2_1",
                  lectureTitle: "Variables and Data Types",
                  lectureDuration: 15,
                  lectureUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  isPreviewFree: true,
                  lectureOrder: 1,
                },
                {
                  lectureId: "lecture_2_2",
                  lectureTitle: "Control Flow & Loops",
                  lectureDuration: 20,
                  lectureUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  isPreviewFree: false,
                  lectureOrder: 2,
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("Course created:", course.courseTitle);

  // Create Purchase
  const purchase = await prisma.purchase.create({
    data: {
      userId: student.id,
      courseId: course.id,
      amount: 89.99,
      status: "completed"
    }
  });

  console.log("Purchase created for student.");

  // Enroll Student in Course (implicit relation)
  await prisma.user.update({
    where: { id: student.id },
    data: {
      enrolledCourses: {
        connect: { id: course.id }
      }
    }
  });

  console.log("Student enrolled in Course.");

  // Create Course Rating
  const rating = await prisma.courseRating.create({
    data: {
      userId: student.dbId,
      courseId: course.id,
      rating: 5
    }
  });

  console.log("Course rating created.");

  // Create Course Progress & Completed Lectures
  const progress = await prisma.courseProgress.create({
    data: {
      userId: student.id,
      courseId: course.id,
      completed: false,
      lecturesCompleted: {
        create: [
          { lectureId: "lecture_1_1" },
          { lectureId: "lecture_1_2" }
        ]
      }
    }
  });

  console.log("Course progress created.");
  console.log("Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

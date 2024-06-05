import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

const EnrollmentForm = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch students and courses
  useEffect(() => {
    fetch("http://127.0.0.1:5555/students")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error('Error fetching students:', error));

    fetch("http://127.0.0.1:5555/courses")
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error('Error fetching courses:', error));
  }, []);

  const formSchema = yup.object().shape({
    student: yup.string().required("Student is required"),
    course: yup.string().required("Course is required"),
    grade: yup.number().required("Grade is required").max(100).min(0)
  });

  const formik = useFormik({
    initialValues: {
      student: '',
      course: '',
      grade: '',
    },
    validationSchema: formSchema,
    onSubmit: async (formData, { resetForm }) => {
      try {
        const selectedStudent = students.find(student => student.id === parseInt(formData.student));
        const selectedCourse = courses.find(course => course.id === parseInt(formData.course));

        if (!selectedStudent || !selectedCourse) {
          throw new Error('Invalid student or course selection');
        }

        const postData = {
          student_id: selectedStudent.id,
          course_id: selectedCourse.id,
          grade: formData.grade,
        };

        console.log(postData);

        const response = await fetch("http://127.0.0.1:5555/enrollments", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          throw new Error('Failed to submit form. Please check if the student/course combination exists.');
        }

        const data = await response.json();
        console.log(data);
        resetForm();
        setErrorMessage('');
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrorMessage('Error, Student/course combination does not exist.');
      }
    }
  });

  return (
    <div>
      <h2>Set Student Final Grade</h2>
      <form onSubmit={formik.handleSubmit}>
        <label>Student </label>
        <select
          id="student"
          name="student"
          onChange={formik.handleChange}
          value={formik.values.student}
        >
          <option value="" label="Select student" />
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        <p style={{ color: "red" }}> {formik.errors.student}</p>
        
        <label>Course </label>
        <select
          id="course"
          name="course"
          onChange={formik.handleChange}
          value={formik.values.course}
        >
          <option value="" label="Select course" />
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <p style={{ color: "red" }}> {formik.errors.course}</p>

        <label>Grade </label>
        <input
          id="grade"
          name="grade"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.grade}
        />
        <p style={{ color: "red" }}> {formik.errors.grade}</p>
        
        <button type="submit">Submit</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default EnrollmentForm;

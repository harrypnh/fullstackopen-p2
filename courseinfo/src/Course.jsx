const Course = ({ courses }) => {
  return (
    <div>
      {courses.map(course =>
        <div>
          <Header key={course.id} course={course.name} />
          <Content key={course.id} parts={course.parts} />
          <Total key={course.id} parts={course.parts} />
        </div>
      )}
    </div>
  )
}
  
const Header = (props) => {
  return (
    <h2>{props.course}</h2>
  )
}
  
const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}
  
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}
  
const Total = ({ parts }) => {
  const total = parts.map(part =>
    part.exercises
  ).reduce((total, exercises) =>
    total + exercises
  )
  return (
    <b>
      total of {total} exercises
    </b>
  )
}

export default Course
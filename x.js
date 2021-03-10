const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
bcrypt.genSalt(10, function (err, salt) {
  console.log(salt);
  bcrypt.hash("B4c0//", salt, function (err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });
});

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    authors: [authorSchema],
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find()
    .populate("author", "name -_id")
    .populate("category");
  console.log(courses);
}

async function updateCourse(id) {
  const course = await Course.updateOne(
    { _id: id },
    {
      $set: {
        "author.name": "7ay",
      },
    }
  );
}

async function addAuthorToCourse(id, author) {
  const course = await Course.findOne({ _id: id });
  course.authors.push(author);
  course.save();
}

async function removeAuthorFromCourse(id_course, id_author) {
  const course = await Course.findOne({ _id: id_course });
  const author = course.authors.id(id_author);
  author.remove();
  course.save();
}

// addAuthorToCourse("6043fe0d5d049f6c4409f91b", { name: "Tuna" });
// removeAuthorFromCourse("6043fe0d5d049f6c4409f91b", "60440215df14536f66e7c76d");

// createAuthor("Mosh", "My bio", "My Website");

// createCourse("Node Course", [
//   {
//     name: "Ronaldo",
//   },
//   {
//     name: "Messi",
//   },
// ]);

// updateCourse("6043f8f135be6c680da6981d");

// listCourses();

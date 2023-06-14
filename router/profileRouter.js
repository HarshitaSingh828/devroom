const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const User = require("../models/User");
const authenticate = require("../middlewares/authenticate");

/*
    @usage : Get a Profile
    @url : /api/profiles/me
    @fields : no-fields
    @method : GET
    @access : PRIVATE
 */
router.get("/me", authenticate, async (request, response) => {
  try {
   
    let profile = await Profile.findOne({ user: request.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return response.status(201).json({ msg: "No Profile Found" });
    }
    response.status(200).json({ profile: profile });
  } catch (error) {
    console.error(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});

// @usage : Create a Profile
// @url : /api/profiles/
// @fields : company , website , location , designation , skills , bio , githubUsername, youtube , facebook , twitter , linkedin , instagram
// @method : POST
// @access : PRIVATE

router.post("/", authenticate, async (request, response) => {
try {
let {
  image,
  company,
  website,
  location,
  designation,
  skills,
  bio,
  githubUserName,
  youtube,
  facebook,
  twitter,
  linkedin,
  instagram,
} = request.body;

let profileObj = {};
profileObj.user = request.user.id; // id gets from Token

if (company) profileObj.company = company;
else profileObj.company = "";
if (website) profileObj.website = website;
else profileObj.website = "";
if (location) profileObj.location = location;
else profileObj.location = "";
if (designation) profileObj.designation = designation;
else profileObj.designation = "";
if (skills)
  profileObj.skills = skills
    .toString()
    .split(",")
    .map((skill) => skill.trim());
else profileObj.skills = "";
if (bio) profileObj.bio = bio;
else profileObj.bio = "";
if (githubUserName) profileObj.githubUserName = githubUserName;
else profileObj.githubUserName = "https://github.com/";

// social Obj
profileObj.social = {};
if (youtube) profileObj.social.youtube = youtube;
else profileObj.social.youtube = "https://www.youtube.com/";
if (facebook) profileObj.social.facebook = facebook;
else profileObj.social.facebook = "https://www.facebook.com/";
if (twitter) profileObj.social.twitter = twitter;
else profileObj.social.twitter = "https://www.twitter.com/";
if (linkedin) profileObj.social.linkedin = linkedin;
else profileObj.social.linkedin = "https://www.linkedin.com/";
if (instagram) profileObj.social.instagram = instagram;
else profileObj.social.instagram = "https://www.instagram.com/";

// insert to db
let profile = new Profile(profileObj);
profile = await profile.save();
profile.populate("user");
if (image == "undefined" || image == "" || image == null)
  image =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOkHm3_mPQ5PPRvGtU6Si7FJg8DVDtZ47rw&usqp=CAU";

await User.findOneAndUpdate({ _id: request.user.id }, { avatar: image });
response.status(200).json({
  msg: "Profile is Created Successfully",
  profile: profile,
});
} catch (error) {
console.error(error);
response.status(500).json({ errors: [{ msg: error.message }] });
}
});

// @usage : Update Profile
// @url : /api/profiles/
// @fields : company , website , location , designation , skills , bio , githubUsername, youtube , facebook , twitter , linkedin , instagram
// @method : PUT
// @access : PRIVATE

router.put("/", authenticate, async (request, response) => {
try {
let {
  image,
  company,
  website,
  location,
  designation,
  skills,
  bio,
  githubUserName,
  youtube,
  facebook,
  twitter,
  linkedin,
  instagram,
} = request.body;

// check if profile exists
let profile = await Profile.findOne({user: request.user.id});
if (!profile) {
  return response
    .status(401)
    .json({ errors: [{ msg: "No Profile Found" }] });
}

let profileObj = {};
profileObj.user = request.user.id; // id gets from Token
if (company) profileObj.company = company;
else profileObj.company = "";
if (website) profileObj.website = website;
else profileObj.website = "";
if (location) profileObj.location = location;
else profileObj.location = "";
if (designation) profileObj.designation = designation;
else profileObj.designation = "";
if (skills)
  profileObj.skills = skills
    .toString()
    .split(",")
    .map((skill) => skill.trim());
else profileObj.skills = "";
if (bio) profileObj.bio = bio;
else profileObj.bio = "";
if (githubUserName) profileObj.githubUserName = githubUserName;
else profileObj.githubUserName = "https://github.com/";

// social Obj
profileObj.social = {};
if (youtube) profileObj.social.youtube = youtube;
else profileObj.social.youtube = "https://www.youtube.com/";
if (facebook) profileObj.social.facebook = facebook;
else profileObj.social.facebook = "https://www.facebook.com/";
if (twitter) profileObj.social.twitter = twitter;
else profileObj.social.twitter = "https://www.twitter.com/";
if (linkedin) profileObj.social.linkedin = linkedin;
else profileObj.social.linkedin = "https://www.linkedin.com/";
if (instagram) profileObj.social.instagram = instagram;
else profileObj.social.instagram = "https://www.instagram.com/";

// update to db
profile = await Profile.findOneAndUpdate(
  { user: request.user.id },
  {
    $set: profileObj,
  },
  { new: true }
);

profile.populate("user");
if (image == "undefined" || image == "" || image == null)
  image =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOkHm3_mPQ5PPRvGtU6Si7FJg8DVDtZ47rw&usqp=CAU";
await User.findOneAndUpdate({ _id: request.user.id }, { avatar: image });

response.status(200).json({
  msg: "Profile is Updated Successfully",
  profile: profile,
});
} catch (error) {
console.error(error);
response.status(500).json({ errors: [{ msg: error.message }] });
}
});
// @usage : GET Profile of a user
// @url : /api/profiles/users/:userId
// @fields : no-fields
// @method : GET
// @access : PUBLIC

router.get("/users/:userId", async (request, response) => {
try {
let userId = request.params.userId.toString();
let profile = await Profile.findOne({ user: userId }).populate("user", [
  "name",
  "avatar",
]);
if (!profile) {
  return response
    .status(400)
    .json({ errors: [{ msg: "No Profile Found for this user" }] });
}
response.status(200).json({ profile: profile });
} catch (error) {
console.error(error);
response.status(500).json({ errors: [{ msg: error.message }] });
}
});


// @usage : Add Experience of a profile
// @url : /api/profiles/experience/
// @fields : title , company , location , from , to , current , description
// @method : PUT
// @access : PRIVATE

router.put(
"/experience",
authenticate,
async (request, response) => {
try {
  let { title, company, location, from, description, to, current } =
    request.body;
  let newExperience = {
    title: title,
    company: company,
    location: location,
    from: from,
    description: description,
    to: to ? to : " ",
    current: current ? current : false,
  };
  // get profile of a user
  let profile = await Profile.findOne({ user: request.user.id });
  if (!profile) {
    return response
      .status(400)
      .json({ errors: [{ msg: "No Profile is Found" }] });
  }
  profile.experience.unshift(newExperience);
  profile = await profile.save();
  response.status(200).json({ profile: profile });
} catch (error) {
  console.error(error);
  response.status(500).json({ errors: [{ msg: error.message }] });
}
}
);
module.exports = router;
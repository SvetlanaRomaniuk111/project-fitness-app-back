const { User } = require("../models/user");
const { ctrlWrapper } = require("../helpers");
const { Customer } = require("../models/customer");
const jwt = require("jsonwebtoken");
const { Types } = require("mongoose");
require("dotenv").configDotenv();
const getAllUsers = async (req, res) => {
  const users = await User.find({})
  res.json(users);
}

const setProfileSettings = async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const [bearer, token] = req.headers.authorization.split(' ')
  const { id } = jwt.verify(token, process.env.SECRET_KEY)
  const user = await User.findOne({ _id: id })
  const levelActivityCof = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 }
  const calcBMR = ({ sex, height, currentWeight, levelActivity, birthday }) => {
    const age = (new Date()).getFullYear() - (new Date(Number(birthday))).getFullYear() 
    if (sex === 'male') {
      return (10 * Number(currentWeight) + 6.25 * Number(height) - 5 * age + 5) * levelActivityCof[levelActivity]
    } else {
      return (10 * Number(currentWeight) + 6.25 * Number(height) - 5 * age - 161) * levelActivityCof[levelActivity]
    }
  }
  const bmr = Math.floor(calcBMR(req.body))
  const isCustomerSettings = await Customer.findOne({
    'user._id': Types.ObjectId(id)
  })
  if (isCustomerSettings) {
    await Customer.findByIdAndUpdate({ _id: isCustomerSettings._id }, { ...req.body, user, bmr })
    const settings = await Customer.findOne({ 'user._id': Types.ObjectId(id) })
    res.json({ settings })
  } else {
    const settings = await Customer.create({ ...req.body, user, bmr })
    res.json({ settings })
  }
}

module.exports = {
  getAllUsers: ctrlWrapper(getAllUsers),
  setProfileSettings: ctrlWrapper(setProfileSettings)
};
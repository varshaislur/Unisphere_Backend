import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";



export const hashString = async (useValue) => {
  const salt = await bcrypt.genSalt(10);

  const hashedpassword = await bcrypt.hash(useValue, salt);
  return hashedpassword;
};

export const compareString = async (userPassword, password) => {
  const isMatch = await bcrypt.compare(userPassword, password);
  return isMatch;
};

//JSON WEBTOKEN
export function createJWT(id) {
  console.log(process.env.JWT_SECRET)
  return JWT.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}
import bcryptjs from "bcryptjs";

export const hashPassword = async (password, salt) => {
  await bcryptjs.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  await bcryptjs.compare(password, hashedPassword);
};

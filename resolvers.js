import pc from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";

const prisma = new pc.PrismaClient();

console.log(process.env.JWT_SECRET);
const resolvers = {
  Query: {},

  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await prisma.user.findUnique({
        where: { email: userNew.email },
      });
      if (user)
        throw new AuthenticationError(
          "User already exists with that email address"
        );
      const hashedPassword = await bcrypt.hash(userNew.password, 10);
      const newUser = await prisma.user.create({
        data: {
          ...userNew,
          password: hashedPassword,
        },
      });
      return newUser;
    },
    signinUser: async (_, { userSignin }) => {
      const user = await prisma.user.findUnique({
        where: { email: userSignin.email },
      });
      if (!user)
        throw new AuthenticationError(
          "User does not exists with that email address"
        );
      const doMatch = await bcrypt.compare(userSignin.password, user.password);
      if (!doMatch)
        throw new AuthenticationError("email or password is invalid");
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      return { token };
    },
  },
};

export default resolvers;

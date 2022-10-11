import pc from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new pc.PrismaClient();
import { ApolloError, AuthenticationError } from "apollo-server";

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
  },
};

export default resolvers;

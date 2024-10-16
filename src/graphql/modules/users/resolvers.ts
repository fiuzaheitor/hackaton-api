import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import auth from "../../../util/auth";
import { Users } from "../../../models/User";

const User = {
  kids: async (user: any) => {
    try {
      return await Users.find({ _id: { $in: user.kids } });
    } catch (error: any) {
      throw new GraphQLError(error);
    }
  },
  gestations: async (user: any) => {
    try {
      return await Users.find({ _id: { $in: user.gestations } });
    } catch (error: any) {
      throw new GraphQLError(error);
    }
  },
  createdBy: async (user: any) => {
    try {
      const u = await Users.findById(user.createdBy);
      if (u) {
        return u;
      }
    } catch (error: any) {
      throw new GraphQLError(error);
    }
  },
  updatedBy: async (user: any) => {
    try {
      const u = await Users.findById(user.updateBy);
      if (u) {
        return u;
      }
    } catch (error: any) {
      throw new GraphQLError(error);
    }
  },
};

const Query = {
  async user(_: any, { id }: { id: string }) {
    try {
      const user = await Users.findById(id);
      if (user) {
        return user;
      } else {
        throw new GraphQLError("Esse usuário não existe");
      }
    } catch (error: any) {
      throw new GraphQLError(error);
    }
  },
  async users() {
    try {
      return await Users.find({});
    } catch (error: any) {
      throw new GraphQLError(error);
    }
  },
};
const Mutation = {
  async createUser(_: any, { data }: { data: any }, context: any) {
    const { email, name, phone, password, cpf } = data;
    const userAuth = auth(context);

    const emailExists = await Users.findOne({ email, phone, password });
    if (emailExists) {
      throw new GraphQLError("Já existe um usuário com esse email");
    }

    const passwordEncrypted = (await bcrypt.hash(password, 12)) as any;

    const newUser = {
      name,
      email,
      cpf,
      phone,
      isActive: true,
      password: passwordEncrypted,
      updateBy: typeof userAuth === "string" ? userAuth : userAuth.id,
      updateAt: new Date().valueOf(),
    };

    return await Users.create(newUser);
  },
  async loginUser(_: any, { data }: { data: any }) {
    const { email, password } = data;

    if (!email) {
      throw new GraphQLError("Informe o nome de usuário ou email.");
    }

    const user = await Users.findOne({ email: email });

    if (!user) {
      throw new GraphQLError("Usuário não encontrado.");
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      throw new GraphQLError("Senha incorreta.");
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.REACT_APP_SKEY as string,
      { expiresIn: "30d" },
    );

    return {
      token,
    };
  },
  async updateUser(
    _: any,
    { id, data }: { id: string; data: any },
    context: any,
  ) {
    const { name, cpf, kids, gestations, phone, isActive, email, password, oldPassword, lastActive } = data;
    const userAuth = auth(context);

    const user = await Users.findById(id);
    if (!user) {
      throw new GraphQLError("Esse usuário não existe");
    }

    try {
      Users.findByIdAndUpdate(
        id,
        {
          name,
          cpf,
          kids,
          gestations,
          phone,
          isActive,
          email,
          password,
          oldPassword,
          lastActive,
          updateBy: typeof userAuth === "string" ? userAuth : userAuth.id,
          updateAt: new Date().valueOf(),
        },
        { new: true },
      );
    }
    catch (error: any) {
      throw new GraphQLError(error);
    }
  },
  async deleteUser(_: any, { id }: { id: string }, context: any) {
    auth(context);

    const user = !!Users.findByIdAndDelete(id);
    if (user) {
      return await Users.findByIdAndDelete(id);
    }
  },
};

const resolvers = {
  User,
  Query,
  Mutation,
};

export default resolvers;

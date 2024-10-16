import { GraphQLError } from "graphql";
import { Users } from "../../../models/User";
import { Kids } from "../../../models/Kid";
import auth from "../../../util/auth";
import { VaccineCards } from "../../../models/VaccineCard";

const Kid = {
  mom: async (kid: any) => {
    try {
      return await Users.findById(kid.mom);
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  createdBy: async (kid: any) => {
    try {
      const user = await Users.findById(kid.createdBy);
      if (user) {
        return user;
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  updatedBy: async (kid: any) => {
    try {
      const user = await Users.findById(kid.updatedBy);
      if (user) {
        return user;
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
};

const Query = {
  async kid(_: any, { id }: { id: string }, context: any) {
    try {
      const kid = await Kids.findById(id);
      if (kid) {
        return kid;
      } else {
        throw new GraphQLError("Essa criança não existe");
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async kids() {
    try {
      return await Kids.find();
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async kidsByMom(_: any, { userId }: { userId: string }) {
    try {
      return await Kids.find({ mom: userId });
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
};

const Mutation = {
  async createKid(_: any, { data }: { data: any }, context: any) {
    const userAuth = auth(context);

    const newKid = new Kids({
      ...data,
      createdBy: typeof userAuth === "string" ? userAuth : userAuth.id,
    });

    return await newKid.save();
  },
  async updateKid(
    _: any,
    { id, data }: { id: string; data: any },
    context: any,
  ) {
    const kidAuth = auth(context);

    const updateKid = {
      ...data,
      updatedAt: new Date().valueOf(),
      updatedBy: typeof kidAuth === "string" ? kidAuth : kidAuth.id,
    };

    return await Kids.findByIdAndUpdate(id, updateKid, {
      new: true,
    });
  },
  async deleteKid(_: any, { id }: { id: string }, context: any) {
    auth(context);

    const kid = !!Kids.findByIdAndDelete(id);
    if (kid) {
      return await Kids.findByIdAndDelete(id);
    }
  },
};

const resolvers = {
  Kid,
  Query,
  Mutation,
};

export default resolvers;

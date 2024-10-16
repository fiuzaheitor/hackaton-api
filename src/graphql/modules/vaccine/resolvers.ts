import { GraphQLError } from "graphql";
import { Users } from "../../../models/User";
import { Kids } from "../../../models/Kid";
import auth from "../../../util/auth";
import { Vaccines } from "../../../models/Vaccine";

const Vaccine = {
  kid: async (vaccine: any) => {
    try {
      const kid = await Kids.findById(vaccine.kid);
      if (kid) {
        return kid;
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  createdBy: async (vaccine: any) => {
    try {
      const user = await Users.findById(vaccine.createdBy);
      if (user) {
        return user;
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  updatedBy: async (vaccine: any) => {
    try {
      const user = await Users.findById(vaccine.updatedBy);
      if (user) {
        return user;
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
};

const Query = {
  async vaccine(_: any, { id }: { id: string }, context: any) {
    try {
      const vaccine = await Vaccines.findById(id);
      if (vaccine) {
        return vaccine;
      } else {
        throw new GraphQLError("Essa vacina não existe");
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async vaccines() {
    try {
      return await Vaccines.find();
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
};

const Mutation = {
  async createVaccine(_: any, { data }: { data: any }, context: any) {
    const userAuth = auth(context);
    try {
      const user = await auth(context);
      const newVaccine = new Kids({
        ...data,
        createdBy: typeof userAuth === "string" ? userAuth : userAuth.id,
      });
      return await newVaccine.save();
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async updateVaccine(
    _: any,
    { id, input }: { id: string; input: any },
    context: any,
  ) {
    try {
      await auth(context);
      const vaccine = await Vaccines.findByIdAndUpdate(
        id,
        { ...input, updatedAt: Date.now() },
        { new: true },
      );
      if (vaccine) {
        return vaccine;
      } else {
        throw new GraphQLError("Essa vacina não existe");
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async deleteVaccine(_: any, { id }: { id: string }, context: any) {
    try {
      await auth(context);
      const vaccine = await Vaccines.findByIdAndDelete(id);
      if (vaccine) {
        return vaccine;
      } else {
        throw new GraphQLError("Essa vacina não existe");
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
};

const resolvers = {
  Vaccine,
  Query,
  Mutation,
};

export default resolvers;

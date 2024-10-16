import { GraphQLError } from "graphql";
import { Users } from "../../../models/User";
import { Kids } from "../../../models/Kid";
import auth from "../../../util/auth";
import { Vaccines } from "../../../models/Vaccine";
import { VaccineCards } from "../../../models/VaccineCard";

const Vaccine = {
  vaccineCard: async (vaccine: any) => {
    try {
      return await VaccineCards.findById(vaccine.vaccineCard);
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
  async vaccinesByVaccineCard(_: any, { vaccineCardId }: { vaccineCardId: string }) {
    try {
      return await Vaccines.find({ vaccineCard: vaccineCardId });
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  }
};

const Mutation = {
  async createVaccine(_: any, { data }: { data: any }, context: any) {
    const userAuth = auth(context);
    try {
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
    const userAuth = auth(context);
    try {
      const vaccine = await Vaccines.findByIdAndUpdate(
        id,
        { ...input, updatedAt: Date.now(), updatedBy: typeof userAuth === "string" ? userAuth : userAuth.id },
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

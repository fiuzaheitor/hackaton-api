import { GraphQLError } from "graphql";
import { Users } from "../../../models/User";
import { Kids } from "../../../models/Kid";
import auth from "../../../util/auth";
import { create } from "lodash";
import { VaccineCards } from "../../../models/VaccineCard";

const VaccineCard = {
    kid: async (vaccineCard: any) => {
        try {
            const kid = await Kids.findById(vaccineCard.kid)
            if(kid) {
                return kid
            }
        } catch (err: any){
            throw new GraphQLError(err.message);
        }
    },
  createdBy: async (vaccineCard: any) => {
    try {
      const user = await Users.findById(vaccineCard.createdBy);
      if (user) {
        return user;
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  updatedBy: async (vaccineCard: any) => {
    try {
      const user = await Users.findById(vaccineCard.updatedBy);
      if (user) {
        return user;
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
};

const Query = {
  async vaccineCard(_: any, { id }: { id: string }, context: any) {
    try {
      const vaccineCard = await VaccineCards.findById(id);
      if (vaccineCard) {
        return vaccineCard;
      } else {
        throw new GraphQLError("Esse cartão de vacina não existe");
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async vaccineCards() {
    try {
      return await VaccineCards.find();
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async vaccineCardByKid(_: any, { kidId }: { kidId: string }) {
    try {
      return await VaccineCards.find({ kid: kidId });
    }
    catch (err: any) {
      throw new GraphQLError(err.message);
    }
    },
};

const Mutation = {
  async createVaccineCard(_: any, { data }: { data: any }, context: any) {
    const userAuth = auth(context);
    try {
      const newVaccineCard = new VaccineCards({
        ...data,
        createdBy: typeof userAuth === "string" ? userAuth : userAuth.id,
      });
      return await newVaccineCard.save();
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async updateVaccineCard(_: any, { id, data }: { id: string; data: any }, context: any) {
    const userAuth = auth(context);
    try {
      const vaccineCard = await VaccineCards.findById(id);
      if (!vaccineCard) {
        throw new GraphQLError("Esse cartão de vacina não existe");
      }
      return await VaccineCards.findByIdAndUpdate(
        id,
        { ...data, updatedBy: typeof userAuth === "string" ? userAuth : userAuth.id },
        { new: true }
      );
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async deleteVaccineCard(_: any, { id }: { id: string }) {
    const vaccineCard = await VaccineCards.findById(id);
    if (!vaccineCard) {
      throw new GraphQLError("Esse cartão de vacina não existe");
    }

    return await VaccineCards.findByIdAndDelete(id);
  },
};

const resolvers = {
    VaccineCard,
    Query,
    Mutation,
}

export default resolvers;

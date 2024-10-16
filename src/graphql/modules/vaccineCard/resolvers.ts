import { GraphQLError } from "graphql";
import { Users } from "../../../models/User";
import { Kids } from "../../../models/Kid";
import auth from "../../../util/auth";
import { create } from "lodash";
import { VaccineCards } from "../../../models/VaccineCard";
import resolvers from "../kids/resolvers";

const VaccineCard = {
  kid: async (vaccineCard: any) => {
    try {
      const kid = await Kids.findById(vaccineCard.kid);
      if (kid) {
        return kid;
      }
    } catch (err: any) {
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
  async vaccineCardsByKid(_: any, { kid }: { kid: string }) {
    try {
      return await VaccineCards.find({ kid });
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
};

const Mutation = {
  async createVaccineCard(_: any, { data }: { data: any }, context: any) {
    const { kid, vaccines, date, createdBy } = data;
    const userAuth = auth(context);

    const vaccineCardExists = await VaccineCards.findOne({
      kid,
      vaccines,
      date,
    });
    if (vaccineCardExists) {
      throw new GraphQLError("Esse cartão de vacina já existe");
    }

    const newVaccineCard = {
      kid,
      vaccines,
      date,
      createdBy: typeof userAuth === "string" ? userAuth : userAuth.id,
    };

    return await VaccineCards.create(newVaccineCard);
  },
  async updateVaccineCard(
    _: any,
    { id, data }: { id: string; data: any },
    context: any,
  ) {
    const { kid, vaccines, date, updatedBy } = data;
    const userAuth = auth(context);

    const vaccineCard = await VaccineCards.findById(id);
    if (!vaccineCard) {
      throw new GraphQLError("Esse cartão de vacina não existe");
    }

    return await VaccineCards.findByIdAndUpdate(
      id,
      {
        kid,
        vaccines,
        date,
        updatedBy: typeof userAuth === "string" ? userAuth : userAuth.id,
      },
      { new: true },
    );
  },
  async deleteVaccineCard(_: any, { id }: { id: string }) {
    const vaccineCard = await VaccineCards.findById(id);
    if (!vaccineCard) {
      throw new GraphQLError("Esse cartão de vacina não existe");
    }

    return await VaccineCards.findByIdAndDelete(id);
  },
};

export default resolvers;

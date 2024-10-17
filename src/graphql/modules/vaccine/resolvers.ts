import { GraphQLError } from "graphql";
import { Users } from "../../../models/User";
import { Kids } from "../../../models/Kid";
import auth from "../../../util/auth";
import { Vaccines, VaccineTemplates } from "../../../models/Vaccine";
import { VaccineCards } from "../../../models/VaccineCard";

const Vaccine = {
  vaccineTemplate: async (vaccine: any) => {
    try {
      return await VaccineCards.findById(vaccine.vaccineTemplate);
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
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

const VaccineTemplate = {
  createdBy: async (vaccineTemplate: any) => {
    try {
      const user = await Users.findById(vaccineTemplate.createdBy);
      if (user) {
        return user;
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  updatedBy: async (vaccineTemplate: any) => {
    try {
      const user = await Users.findById(vaccineTemplate.updatedBy);
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
  async vaccinesByVaccineCard(
    _: any,
    { vaccineCardId }: { vaccineCardId: string },
  ) {
    try {
      return await Vaccines.find({ vaccineCard: vaccineCardId });
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async vaccineTemplate(_: any, { id }: { id: string }, context: any) {
    try {
      const vaccineTemplate = await VaccineTemplates.findById(id);
      if (vaccineTemplate) {
        return vaccineTemplate;
      } else {
        throw new GraphQLError("Esse modelo de vacina não existe");
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async vaccineTemplates() {
    try {
      return await VaccineTemplates.find();
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
};

const Mutation = {
  async createVaccine(_: any, { data }: { data: any }, context: any) {
    const userAuth = auth(context);
    try {
      const newVaccine = new Vaccines({
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
        {
          ...input,
          updatedAt: Date.now(),
          updatedBy: typeof userAuth === "string" ? userAuth : userAuth.id,
        },
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
  async createVaccineTemplate(_: any, { data }: { data: any }, context: any) {
    const userAuth = auth(context);
    try {
      const newVaccineTemplate = new VaccineTemplates({
        ...data,
        createdBy: typeof userAuth === "string" ? userAuth : userAuth.id,
      });
      return await newVaccineTemplate.save();
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async updateVaccineTemplate(
    _: any,
    { id, input }: { id: string; input: any },
    context: any,
  ) {
    const userAuth = auth(context);
    try {
      const vaccineTemplate = await VaccineTemplates.findByIdAndUpdate(
        id,
        {
          ...input,
          updatedAt: Date.now(),
          updatedBy: typeof userAuth === "string" ? userAuth : userAuth.id,
        },
        { new: true },
      );
      if (vaccineTemplate) {
        return vaccineTemplate;
      } else {
        throw new GraphQLError("Esse modelo de vacina não existe");
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  async deleteVaccineTemplate(_: any, { id }: { id: string }, context: any) {
    try {
      const vaccineTemplate = await VaccineTemplates.findByIdAndDelete(id);
      if (vaccineTemplate) {
        return vaccineTemplate;
      } else {
        throw new GraphQLError("Esse modelo de vacina não existe");
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
};

const resolvers = {
  Vaccine,
  VaccineTemplate,
  Query,
  Mutation,
};

export default resolvers;

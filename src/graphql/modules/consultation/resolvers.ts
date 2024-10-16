import { GraphQLError } from "graphql";
import { Users } from "../../../models/User";
import auth from "../../../util/auth";
import { Consultations } from "../../../models/Consultation";

const Consultation = {
  createdBy: async (consultation: any) => {
    try {
      const user = await Users.findById(consultation.createdBy);
      if (user) {
        return user;
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  updatedBy: async (consultation: any) => {
    try {
      const user = await Users.findById(consultation.updatedBy);
      if (user) {
        return user;
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
};

const Query = {
  async consultation(_: any, { id }: { id: string }) {
    try {
      const consultation = await Consultations.findById(id);
        if (consultation) {
            return consultation;
        } else {
            throw new GraphQLError("Consultation não existe");
        }
    }
    catch (err: any) {
        throw new GraphQLError(err.message);
    }
    },
    async consultations() {
        try {
            return await Consultations.find({});
        } catch (err: any) {
            throw new GraphQLError(err.message);
        }
    },
    async consultationsByGestation(_: any, { gestationId }: { gestationId: string }) {
        try {
            return await Consultations.find({ gestation: gestationId });
        } catch (err: any) {
            throw new GraphQLError(err.message);
        }
    },
};

const Mutation = {
    async createConsultation(_: any, { data }: { data: any }, context: any) {
        try {
            const userAuth = auth(context);
            const newConsultation = new Consultations({ ...data, createdBy: typeof userAuth === "string" ? userAuth : userAuth.id,});
            return await newConsultation.save();
        } catch (err: any) {
            throw new GraphQLError(err.message);
        }
    },
    async updateConsultation(_: any, { id, data }: { id: string, data: any }, context: any) {
        try {
            const userAuth = auth(context);
            const consultation = await Consultations.findById(id);
            if (!consultation) {
                throw new GraphQLError("Consultation não existe");
            }
            return Consultations.findByIdAndUpdate(id, { ...data, updatedBy: typeof userAuth === "string" ? userAuth : userAuth.id }, {new: true});
        } catch (err: any) {
            throw new GraphQLError(err.message);
        }
    },
    async deleteConsultation(_: any, { id }: { id: string }) {
        try {
            const consultation = await Consultations.findById(id);
            if (!consultation) {
                throw new GraphQLError("Consultation não existe");
            }
            return await Consultations.findByIdAndDelete(id);
        } catch (err: any) {
            throw new GraphQLError(err.message);
        }
    },
};

const resolvers = {
    Consultation,
    Query,
    Mutation,
}

export default resolvers;
import { GraphQLError } from "graphql";
import { Users } from "../../../models/User";
import auth from "../../../util/auth";
import { Gestations } from "../../../models/Gestation";

const Gestation = {
  createdBy: async (gestation: any) => {
    try {
      const user = await Users.findById(gestation.createdBy);
      if (user) {
        return user;
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
  updatedBy: async (gestation: any) => {
    try {
      const user = await Users.findById(gestation.updatedBy);
      if (user) {
        return user;
      }
    } catch (err: any) {
      throw new GraphQLError(err.message);
    }
  },
};

const Query = {
  async gestation(_: any, { id }: { id: string }) {
    try {
      const gestation = await Gestations.findById(id);
        if (gestation) {
            return gestation;
        } else {
            throw new GraphQLError("Gestation não existe");
        }
    }
    catch (err: any) {
        throw new GraphQLError(err.message);
    }
    },
    async gestations() {
        try {
            return await Gestations.find({});
        } catch (err: any) {
            throw new GraphQLError(err.message);
        }
    },
};

const Mutation = {
    async createGestation(_: any, { data }: { data: any }, context: any) {
        try {
            const userAuth = await auth(context);
            const newGestation = new  Gestations({ ...data, createdBy: typeof userAuth === "string" ? userAuth : userAuth.id,});
            return await newGestation.save();
        } catch (err: any) {
            throw new GraphQLError(err.message);
        }
    },
    async updateGestation(_: any, { id, data: data }: { id: string, data: any }, context: any) {
        try {
            const userAuth = await auth(context);
            const gestation = await Gestations.findById(id);
            if (gestation) {
                gestation.updateOne({ ...data,updatedAt: new Date().valueOf(), updatedBy: typeof userAuth === "string" ? userAuth : userAuth.id,});
                return gestation;
            } else {
                throw new GraphQLError("Gestation não existe");
            }
        } catch (err: any) {
            throw new GraphQLError(err.message);
        }
    },
    async deleteGestation(_: any, { id }: { id: string }, context: any) {
        try {
            const user = await auth(context);
            const gestation = await Gestations.findById(id);
            if (gestation) {
                gestation.deleteOne();
                return gestation;
            } else {
                throw new GraphQLError("Gestation não existe");
            }
        } catch (err: any) {
            throw new GraphQLError(err.message);
        }
    },
};

const resolvers = {
    Gestation,
    Query,
    Mutation,
  };
  
  export default resolvers;
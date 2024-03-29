import { GraphQLError } from "graphql";
import {
  countJobs,
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompanyId,
  updateJob,
} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
export const resolvers = {
  Query: {
    jobs: async (_root, { limit, offset }) => {
      const items = await getJobs(limit, offset);
      const totalCount = await countJobs();
      return { items, totalCount };
    },
    job: async (_, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError("job not found with id " + id);
      }
      return job;
    },
    company: async (_, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError("company not found with id " + id);
      }
      return company;
    },
  },
  Mutation: {
    //third parameter is context
    createJob: (_root, { input: { title, description } }, { user }) => {
      console.log("NEW LINE", user);
      if (!user) {
        throw unAuthorizedError("missing authentication");
      }
      //code is executed if user is authorized
      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (_, { id }, { user }) => {
      if (!user) {
        throw unAuthorizedError("Missing authentication");
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw notFoundError("No Job found with id " + id);
      }
      return job;
    },
    updateJob: async (_, { input: { id, title, description } }, { user }) => {
      if (!user) {
        throw unAuthorizedError("Missing authentication");
      }
      const job = await updateJob({
        id,
        title,
        description,
        companyId: user.companyId,
      });
      if (!job) {
        throw notFoundError("No Job found with id " + id);
      }
      return job;
    },
  },

  Job: {
    date: (job) => toISODate(job.createdAt),
    //loads from database directly
    // company: (job) => getCompany(job.companyId),
    company: (job, _args, { companyLoader }) =>
      companyLoader.load(job.companyId),
  },
  Company: {
    job: (company) => getJobsByCompanyId(company.id),
  },
};

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: "NOT_FOUND",
    },
  });
}
function unAuthorizedError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: "UNAUTHORIZED",
    },
  });
}

function toISODate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}

import { GraphQLError } from "graphql";
import {
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
    jobs: () => getJobs(),
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
    createJob: (_root, { input: { title, description } }, { auth }) => {
      if (!auth) {
        throw unAuthorizedError("missing authentication");
      }
      //code is executed if user is authorized
      const companyId = "FjcJCHJALA4i";
      return createJob({ companyId, title, description });
    },
    deleteJob: (_, { id }) => deleteJob(id),
    updateJob: (_, { input: { id, title, description } }) =>
      updateJob({ id, title, description }),
  },

  Job: {
    date: (job) => toISODate(job.createdAt),
    company: (job) => getCompany(job.companyId),
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

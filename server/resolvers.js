import { getJob, getJobs } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: (_, { id }) => getJob(id),
    company: (_, { id }) => getCompany(id),
  },

  Job: {
    date: (job) => toISODate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },
};

function toISODate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}

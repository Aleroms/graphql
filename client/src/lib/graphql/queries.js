import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  concat,
  createHttpLink,
  gql,
} from "@apollo/client";
import { getAccessToken } from "../auth";

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();
  if (token) {
    // return { Authorization: `Bearer ${token}` };
    operation.setContext({
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  headers: () => {},
});

//fetch jobs
export async function getJobs() {
  const query = gql`
    query Jobs {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;
  const { data } = await apolloClient.query({ query });
  return data.jobs;
}

export async function getJob(id) {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        date
        company {
          id
          name
        }
        title
        description
      }
    }
  `;
  const { data } = await apolloClient.query({ query, variables: { id } });
  return data.job;
}

export async function getCompany(id) {
  const query = gql`
    query CompanyById($id: ID!) {
      company(id: $id) {
        id
        name
        description
        job {
          date
          id
          description
          title
        }
      }
    }
  `;
  const { data } = await apolloClient.query({ query, variables: { id } });
  return data.company;
}
export async function createJob({ title, description }) {
  const mutation = gql`
    mutation createJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { input: { title, description } },
  });
  return data.job;
}

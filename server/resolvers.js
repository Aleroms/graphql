export const resolvers = {
  Query: {
    job: () => {
      return {
        id: "test-id",
        title: "title",
        description: "desc",
      };
    },
  },
};

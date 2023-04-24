import { gql, request } from "../index.js";

const endpoint = `https://hub.snapshot.org/graphql`;

export const proposalsQuery = gql`
  query Proposals($timestamp_offset: Int, $space: String) {
    proposals(
      first: 1000
      where: { space: $space, created_gte: $timestamp_offset }
      orderBy: "created"
      orderDirection: asc
    ) {
      id
      state
      created
    }
  }
`;

export const votesQuery = gql`
  query Votes($timestamp_offset: Int, $proposalId: String) {
    votes(
      first: 1000
      where: { proposal: $proposalId, created_gte: $timestamp_offset }
      orderBy: "created"
      orderDirection: asc
    ) {
      voter
      created
    }
  }
`;

interface Data {
  proposals: Array<{ id: string; state: string; created: number }>;
  votes: Array<{ voter: string; created: number }>;
}

export const getProposals = async (offset: number, space: string) => {
  const variables = {
    timestamp_offset: offset,
    space: space,
  };
  return await request<Data>(endpoint, proposalsQuery, variables);
};

export const getVotes = async (offset: number, propId: string) => {
  const variables = {
    timestamp_offset: offset,
    proposalId: propId,
  };
  return await request<Data>(endpoint, votesQuery, variables);
};

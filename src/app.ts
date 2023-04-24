import {
  writeDataToFile,
  loadDataFromFile,
  loadTypedSetDataFromFile,
} from "./utils/fileUtils.js";
import { getProposals, getVotes } from "./utils/queries.js";

const maxResponseSize = 1000;
const participationMap = new Map(); // { voter_address: num_votes }
const proposalsProgress = new Map(); // { proposal_id: last_timestamp_checked (0 -> not processed, -1 -> status closed and all votes counted) }
const proposalVoters = new Map(); // { proposal_id: Set<voters> } used to save/reload voters on a proposal for deduping if crashed
const proposalsList = new Array(); // { proposalId, state, created }
const space = "aave.eth";
var numProposals = 0;

// update vote count for voter if address has not already votes on proposal
const processVotes = (
  votes: Array<{ voter: string; created: number }>,
  voters: Set<string>
) => {
  for (var vote of votes) {
    if (!voters.has(vote.voter)) {
      var numVotes = participationMap.has(vote.voter)
        ? participationMap.get(vote.voter) + 1
        : 1;
      participationMap.set(vote.voter, numVotes);
      voters.add(vote.voter);
    }
  }
};

// set up proposalsList with remaining proposals to check
const processProposals = (
  proposals: Array<{ id: string; state: string; created: number }>
) => {
  for (var proposal of proposals) {
    proposalsList;
    // proposal has not been checked, set last_timestamp_checked to 0
    if (!proposalsProgress.has(proposal.id)) {
      proposalsList[proposalsList.length] = proposal;
      proposalsProgress.set(proposal.id, 0);
      // proposal has been checked but not finished, set last_timestamp_checked to cached value
    } else if (proposalsProgress.get(proposal.id) != -1) {
      proposal.created = proposalsProgress.get(proposal.id);
      proposalsList[proposalsList.length] = proposal;
      // proposal has been checked, increment count of proposals processed
    } else {
      numProposals++;
    }
  }
};

const checkVotesForProposal = async (proposal: {
  id: string;
  state: string;
  created: number;
}) => {
  var startingTimestamp = proposalsProgress.get(proposal.id);
  var votesResp = await getVotes(startingTimestamp, proposal.id);
  var votersForProposal;
  // reload stored list of voters for proposal id
  if (proposalVoters.has(proposal.id)) {
    votersForProposal = new Set<string>(proposalVoters.get(proposal.id));
  } else {
    votersForProposal = new Set<string>();
  }
  // paginate queries with created_gte: created timestamp
  while (votesResp.votes.length === 1000) {
    processVotes(votesResp.votes, votersForProposal);
    startingTimestamp = votesResp.votes[maxResponseSize - 1].created;
    proposalsProgress.set(proposal.id, startingTimestamp);
    proposalVoters.set(proposal.id, Array.from(votersForProposal));
    votesResp = await getVotes(startingTimestamp, proposal.id);
  }
  processVotes(votesResp.votes, votersForProposal);
  proposalVoters.set(proposal.id, Array.from(votersForProposal));
  // set last_timestamp_checked to 0 if voting not started
  var lastTimestamp = 0;
  // set last_timestamp_checked to -1 if proposal closed and all votes counted
  if (proposal.state == "closed") {
    lastTimestamp = -1;
    // finished processing this proposal - no need to save list of voters
    proposalVoters.delete(proposal.id);
    // set last_timestamp_checked to last timestamp checked if proposal not closed
  } else if (votesResp.votes.length > 0) {
    lastTimestamp = votesResp.votes[votesResp.votes.length - 1].created;
  }
  proposalsProgress.set(proposal.id, lastTimestamp);
};

// load cached proposals, fetch other proposals
const getAllRemainingProposals = async (space: string) => {
  try {
    const cachedProposalData = await loadDataFromFile(
      "./data/" + space + "-proposals.json"
    );
    if (cachedProposalData) {
      for (var proposal of cachedProposalData.entries()) {
        proposalsProgress.set(proposal[0], proposal[1]);
      }
    }
  } catch (err) {
    console.log("no cached proposal data to load");
  }
  var startingTimestamp = 0;
  var proposalsResp = await getProposals(startingTimestamp, space);
  // paginate queries with created_gte: created timestamp
  while (proposalsResp.proposals.length === 1000) {
    processProposals(proposalsResp.proposals);
    startingTimestamp = proposalsResp.proposals[maxResponseSize - 1].created;
    proposalsResp = await getProposals(startingTimestamp, space);
  }
  processProposals(proposalsResp.proposals);
};

// load cached voters into participationMap and list of voters for unfinished proposals into proposalVoters map
const loadCachedVoters = async (space: string) => {
  try {
    const cachedVoterData = await loadDataFromFile(
      "./data/" + space + "-voters.json"
    );
    const cachedVoterDataDedup = await loadTypedSetDataFromFile(
      "./data/" + space + "-voters-dedup.json"
    );
    if (cachedVoterData) {
      for (var voter of cachedVoterData.entries()) {
        participationMap.set(voter[0], voter[1]);
      }
    }
    if (cachedVoterDataDedup) {
      for (var proposalVoterSet of cachedVoterDataDedup.entries()) {
        proposalVoters.set(
          proposalVoterSet[0],
          Array.from(proposalVoterSet[1])
        );
      }
    }
  } catch (err) {
    console.log(err);
    console.log("no cached voter data to load");
  }
};

await loadCachedVoters(space);
await getAllRemainingProposals(space);
console.log("cached votes - " + participationMap.size);
var proposalsRemaining = proposalsList.length;
console.log("proposals remaining - " + proposalsRemaining);
try {
  for (var proposal of proposalsList) {
    numProposals += 1;
    proposalsRemaining -= 1;
    console.log("proposals remaining - " + proposalsRemaining);
    await checkVotesForProposal(proposal);
  }
} catch (err) {
  console.log(err);
  console.log(
    "error - saving current stats and returning results for first " +
      numProposals +
      " proposals\n" +
      "if err is 429 - run program again after 1 min to continue processing"
  );
}

// save current state
writeDataToFile("./data/" + space + "-voters-dedup.json", [...proposalVoters]);
writeDataToFile("./data/" + space + "-voters.json", [...participationMap]);
writeDataToFile("./data/" + space + "-proposals.json", [...proposalsProgress]);

// calculate top 20
let sortedParticipation = new Map(
  [...participationMap.entries()].sort((a, b) => b[1] - a[1])
);
console.log("----- Top 20 adresses by participation -----");
var numAddresses = 0;
for (var address of sortedParticipation) {
  numAddresses++;
  console.log(
    numAddresses +
      ". " +
      address[0] +
      " - " +
      address[1] +
      " votes on " +
      numProposals +
      " proposals"
  );
  if (numAddresses == 20) {
    break;
  }
}

// get UPenn
console.log("----- UPenn participation -----");
const upenn_address = "0x070341aA5Ed571f0FB2c4a5641409B1A46b4961b";
if (participationMap.has(upenn_address)) {
  console.log(
    "UPenn has voted on " +
      participationMap.get(upenn_address) +
      " of the first " +
      numProposals +
      " proposals"
  );
} else {
  console.log("UPenn did not vote on the first " + numProposals + " proposals");
}

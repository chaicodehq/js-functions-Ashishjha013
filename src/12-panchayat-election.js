/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  const candidateList = Array.isArray(candidates) ? candidates.slice() : [];
  const candidateById = new Map(candidateList.map((c) => [c?.id, c]));
  const candidateIndex = new Map(candidateList.map((c, idx) => [c?.id, idx]));

  let votes = {};
  const registeredVoters = new Set();
  const votedVoters = new Set();

  const isValidVoter = (voter) => {
    if (!voter || typeof voter !== 'object') return false;
    if (typeof voter.id !== 'string' || voter.id.length === 0) return false;
    if (typeof voter.name !== 'string' || voter.name.length === 0) return false;
    if (!Number.isFinite(voter.age) || voter.age < 18) return false;
    return true;
  };

  const registerVoter = (voter) => {
    if (!isValidVoter(voter)) return false;
    if (registeredVoters.has(voter.id)) return false;
    registeredVoters.add(voter.id);
    return true;
  };

  const castVote = (voterId, candidateId, onSuccess, onError) => {
    const successCb = typeof onSuccess === 'function' ? onSuccess : () => undefined;
    const errorCb = typeof onError === 'function' ? onError : () => undefined;

    if (!registeredVoters.has(voterId)) {
      return errorCb('voter not registered');
    }
    if (!candidateById.has(candidateId)) {
      return errorCb('invalid candidate');
    }
    if (votedVoters.has(voterId)) {
      return errorCb('voter already voted');
    }

    votes = tallyPure(votes, candidateId);
    votedVoters.add(voterId);
    return successCb({ voterId, candidateId });
  };

  const getResults = (sortFn) => {
    const results = candidateList.map((c) => ({
      id: c.id,
      name: c.name,
      party: c.party,
      votes: votes[c.id] ?? 0,
    }));

    if (typeof sortFn === 'function') {
      return results.sort(sortFn);
    }

    return results.sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      return (candidateIndex.get(a.id) ?? 0) - (candidateIndex.get(b.id) ?? 0);
    });
  };

  const getWinner = () => {
    const results = getResults();
    if (results.length === 0) return null;
    if (results[0].votes === 0) return null;
    const winner = candidateById.get(results[0].id);
    return winner ? { ...winner } : null;
  };

  return {
    registerVoter,
    castVote,
    getResults,
    getWinner,
  };
}

export function createVoteValidator(rules) {
  const minAge = rules && Number.isFinite(rules.minAge) ? rules.minAge : 18;
  const requiredFields = rules && Array.isArray(rules.requiredFields) ? rules.requiredFields : [];

  return (voter) => {
    if (!voter || typeof voter !== 'object') {
      return { valid: false, reason: 'invalid voter' };
    }

    for (const field of requiredFields) {
      const value = voter[field];
      if (value === undefined || value === null) {
        return { valid: false, reason: `missing field: ${field}` };
      }
      if (typeof value === 'string' && value.length === 0) {
        return { valid: false, reason: `missing field: ${field}` };
      }
    }

    if (!Number.isFinite(voter.age) || voter.age < minAge) {
      return { valid: false, reason: 'underage' };
    }

    return { valid: true };
  };
}

export function countVotesInRegions(regionTree) {
  if (!regionTree || typeof regionTree !== 'object') return 0;
  const ownVotes = Number.isFinite(regionTree.votes) ? regionTree.votes : 0;
  const subs = Array.isArray(regionTree.subRegions) ? regionTree.subRegions : [];
  return ownVotes + subs.reduce((sum, child) => sum + countVotesInRegions(child), 0);
}

export function tallyPure(currentTally, candidateId) {
  const safe = currentTally && typeof currentTally === 'object' ? currentTally : {};
  const current = Number.isFinite(safe[candidateId]) ? safe[candidateId] : 0;
  return {
    ...safe,
    [candidateId]: current + 1,
  };
}

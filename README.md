# AAVE Governance Proposals Participation

### Dependencies

- Node v16 or greater (I recommend using NVM - `nvm use 16`)
- NPM v7 or greater

### Building

```
npm i
npm run build
```

### Running

```
npm run start
```

**Note**: program may crash after rate limit response from snapshot. Re-run program to reload cached data and process remaining proposals. It typically takes 2 runs to go through all votes.

#### Assumptions / Implementation Details

1. Votes on closed proposals do not change
2. Multiple votes on one proposal are only counted once
3. Script iterates through proposals one by one starting with first proposal created
4. Progress is saved after each run inside `/data`
5. Process will take several minutes to finish

#### Progress saved inside /data

There are 3 files stored inside the `/data` directory

`<space>-proposals.json` stores a map of proposal ids and the last timestamp votes were counted for. A -1 means that this proposal is closed and all votes have been counted. A 0 means no votes have been counted.

`<space>-voters.json` stores a map of voter addresses and vote counts.

`<space>-voters-dedup.json` stores a map of proposal ids and voter address arrays. For proposals that have started counting but not yet finished, we need to track the voter addresses already counted so that we don't count multiple votes for a single proposal.

## Answers

#### Top 20 Addresses by participation in Aave governance proposals on snapshot.org

1. 0x0516cf37B67235E07aF38ad8E388d0E68089b0F2 - 261 votes on 288 proposals
2. 0x7A3BdeE62dd34faC317Ae61cd8B3bA7c27ada145 - 261 votes on 288 proposals
3. 0x9Ba6baA919BAc9Acd901dF3Bfde848FE006D3caE - 260 votes on 288 proposals
4. 0xbDa0136ea391e24a938793972726f8763150c7C3 - 260 votes on 288 proposals
5. 0x35E6fc00e3F190A8dFe15faa219368a01028ec14 - 260 votes on 288 proposals
6. 0x0fF9B6AB6Ec58ceB6D5ae8a1690dd5a0959aD002 - 260 votes on 288 proposals
7. 0x344b1E4Ac175f16D3bA40A688cA928E3768E275a - 260 votes on 288 proposals
8. 0x70Ddb5AbF21202602b57F4860eE1262a594a0086 - 260 votes on 288 proposals
9. 0xc97370F22eD5ac4c7B24A8E1ca9D81FEbb3b9457 - 260 votes on 288 proposals
10. 0x707D306714FF28560f32bF9DAE973BD33cd851c5 - 260 votes on 288 proposals
11. 0x1b5b4fCEDF1252cd92496a2fd5C593b39aC49b01 - 260 votes on 288 proposals
12. 0x2D5823E8e8B4dfbf599a97566ff2A121Cc141d60 - 260 votes on 288 proposals
13. 0x76AC6Ad4e4E7c2e0b4Ceeb30745bd53df3a85774 - 260 votes on 288 proposals
14. 0x00432772Ed25d4Eb3C6EB26Dc461239b35cf8760 - 260 votes on 288 proposals
15. 0x972a8B7D891B88220780421fE4D11f174354cEEd - 260 votes on 288 proposals
16. 0xD03Ad690ed8065EDfdC1E08197a3ebC71535A7ff - 260 votes on 288 proposals
17. 0x1B9DA462D07512Fa37021973d853B59dEbB761Dd - 247 votes on 288 proposals
18. 0x79ccEDbEFbfE6c95570d85e65f8B0aC0D6bd017B - 244 votes on 288 proposals
19. 0x06c4865ab16c9C760622f19a313a2E637E2e66a2 - 243 votes on 288 proposals
20. 0x770BEbe5946907CeE4DFE004F1648ac435A9d5bb - 232 votes on 288 proposals

#### UPenn participation

UPenn (0x070341aA5Ed571f0FB2c4a5641409B1A46b4961b) has voted on 182 of 288 proposals

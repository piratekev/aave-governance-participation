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

**Note**: program may crash after rate limit response from snapshot. Re-run program to reload cached data and process remaining proposals.

## Answers

#### Assumptions / Implementation Decisions

1. Votes on closed proposals do not change
2. Multiple votes on one proposal are only counted once
3. Script iterates through proposals one by one starting with first proposal created
4. Progress is saved after each run inside `/data`

#### Top 20 Addresses by participation

1. 0x0516cf37B67235E07aF38ad8E388d0E68089b0F2 - 261 votes
2. 0x7A3BdeE62dd34faC317Ae61cd8B3bA7c27ada145 - 261 votes
3. 0x9Ba6baA919BAc9Acd901dF3Bfde848FE006D3caE - 260 votes
4. 0xbDa0136ea391e24a938793972726f8763150c7C3 - 260 votes
5. 0x35E6fc00e3F190A8dFe15faa219368a01028ec14 - 260 votes
6. 0x0fF9B6AB6Ec58ceB6D5ae8a1690dd5a0959aD002 - 260 votes
7. 0x344b1E4Ac175f16D3bA40A688cA928E3768E275a - 260 votes
8. 0x70Ddb5AbF21202602b57F4860eE1262a594a0086 - 260 votes
9. 0xc97370F22eD5ac4c7B24A8E1ca9D81FEbb3b9457 - 260 votes
10. 0x707D306714FF28560f32bF9DAE973BD33cd851c5 - 260 votes
11. 0x1b5b4fCEDF1252cd92496a2fd5C593b39aC49b01 - 260 votes
12. 0x2D5823E8e8B4dfbf599a97566ff2A121Cc141d60 - 260 votes
13. 0x76AC6Ad4e4E7c2e0b4Ceeb30745bd53df3a85774 - 260 votes
14. 0x00432772Ed25d4Eb3C6EB26Dc461239b35cf8760 - 260 votes
15. 0x972a8B7D891B88220780421fE4D11f174354cEEd - 260 votes
16. 0xD03Ad690ed8065EDfdC1E08197a3ebC71535A7ff - 260 votes
17. 0x1B9DA462D07512Fa37021973d853B59dEbB761Dd - 247 votes
18. 0x79ccEDbEFbfE6c95570d85e65f8B0aC0D6bd017B - 244 votes
19. 0x06c4865ab16c9C760622f19a313a2E637E2e66a2 - 243 votes
20. 0x770BEbe5946907CeE4DFE004F1648ac435A9d5bb - 232 votes

#### UPenn participation

UPenn has voted on 182 of 288 proposals

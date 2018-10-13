# Virtual-Machine TODO
-------------------

* [ ] - Proof of Concept : GLOBAL ID management

 * [ ] - frontend UI to create new ID [edit](./src/server.js)
   * [ ] - accept parameters to update contract
   * [ ] - new ID generated on IDChain if not there then return location on IDChain

 * [ ] - SmartContract to create ID [edit](./jobworker/jobs/SimpleComponent.js)
   * [ ] - CRUD my chain - READ is free, some data require permission

 * [ ] - miner work and get pay [edit](./jobworker/src/jobWorker.js)
   * [ ] - incoming request to execute a contract
   * [ ] - if GAS >= myGASLimit to accept and do work
   * [ ] - update the result to a location on the resultChain and let requester know


------------------
## Update diagram application flow
-------------------
- TARGET : CPU/GPU miners
- Where does contract come from : miner host - pay per contract stored on local
  miner.  Need a minimum number of quorum to persist like
  [RAID](https://en.wikipedia.org/wiki/Standard_RAID_levels) level
- contract management and metrics 
- data flow read and write owner
- color blocks for essential vs optional (storage)

-  what's in the global chain (and is on every miner)
  - transaction logs
  - chain attributes (states,...)
  - index to other chains

-  LRU chains - attribute chains (stack of chains attributes) - pay for LRU level - prepay #GAS to keep min LRU(RAID) #alive...
-  reusable contracts (stack of contracts), sets of contracts -> t0-c1-c2-c3-(c1,c2)=c3-c4-(c3,c4)=c5-c6-c7-... 
-  IPFS -> future storage option (storage-miner)

-------------------
NOTES
-  complete user case for create ID
-------------------

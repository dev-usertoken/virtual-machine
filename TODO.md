# Virtual-Machine TODO

---

* [ ] * Proof of Concept : GLOBAL ID management

* [ ] * frontend UI to create new ID [edit](./src/server.js)

  - [ ] * accept parameters to update contract
  - [ ] * new ID generated on IDChain if not there then return location on IDChain

* [ ] * SmartContract to create ID [edit](./jobworker/jobs/SimpleComponent.js)

  - [ ] * CRUD my chain - READ is free, some data require permission

* [ ] * miner work and get pay [edit](./jobworker/src/jobWorker.js)
  - [ ] * incoming request to execute a contract
  - [ ] * if GAS >= myGASLimit to accept and do work
  - [ ] * update the result to a location on the resultChain and let requester know

---

## Update diagram application flow

---

* TARGET : CPU/GPU and storage miners
* JavaScript is selected since it is everywhere vs other languages
* browser miners can contribute CPU/GPU memory and localstorage resources
* desktop miners can contribute the above plus bandwidth as relays resources for the ecosystem
* Pay for resources spread over responses

* Virtual-Machine is a portal providing miner contract management and metrics
* Allows users to manage, see metrics and logs about contracts.
* Get/Exchange GAS
* Editor for contracts -> connects to virtual-machine in ecosystem for dev testnet and deploy prod.
* Create contracts (visual plumbing) re-use from pool of global contracts (clear contract re-use API definition).
* Push out and execute the SAME evicted contract to refresh LRU for the evicted contract chain.

* Where does contract come from : storage miners
* A minimum number of miners will always have the latest contract chains.
* LRU evicts as new contract chains are added.
* Contract chains are (RADIX?) trees where the root(SEED?) is a link on the GlobalChain.

* Each contract is a contract chain (SEMVER?).
* Miners provide resources such as storage and/or cpu/gpu/asic
* Miner attribute chains are a links on the GlobalChain
* Attributes include ID, resourceCapacity, reachAbility, etc...
* Storage provider : memory storage, disk storage
* prepaid contract could be used to refresh LRU. Pay could be divided into tiers of responders : 1st->1/5pay,2nd->1/10pay based on
  [RAID](https://en.wikipedia.org/wiki/Standard_RAID_levels) levels

* add directional arrows showing data flow for read and write on application flow
* use shaded color blocks for essential vs optional (storage)

---

## Chain info

---

* The GlobalChain holds global states to enable miners to execute SmartContracts (A ledger miners to select and execute contracts)
* What's in the global chain

- [ ] * transaction logs
- [ ] * chain attributes (states,...)
- [ ] * chain indexes

* Attribute chains are LRU chains where each update refreshes the LRU level - (shown as stack of chains attributes). These are limited to the miner's resources.

* What's in the LRU chains

- [ ] * transaction logs
- [ ] * chain attributes (states,...)
- [ ] * chain indexes

- [ ] * prepay GAS to keep LRU liveliness where 1GAS = 1LRU hit
- [ ] * Or pay-each-execution by the user (executioner)

  - [ ] * payment distributes over a number of miners using RAID to persist...
  - [ ] * pay to the first-few fastest or a fix numbers of responders...
  - [ ] * We may use ML to validate/normalize the fastest or X-numbers results from all the results...

* reusable contracts (shown as stack of contracts)

- [ ] * Contract(c1..cn) starting at t(0) -> t0-c1-c2-c3-(c1,c2)=c3-c4-(c3,c4)=c5-c6-c7-...
    where c3 is the set of (c1,c2) and c5 is the set of (c3, c4) contracts
    if the result is known will pay a single GAS each execution.

* IPFS -> future storage option (storage-miner)

---

NOTES

* complete user case for create ID

---

# UserToken Virtual Machine

---

### Why

* To run smartcontract using JS

### Process

* The backend server nodejs [src](./src/server.js) file.

* The virtual machine is using [hypernova](https://github.com/airbnb/hypernova) for smartcontracts

  * example [contracts](./jobworker) can be access at

    [ ] - http://localhost:8080/s/aphrodite

    [ ] - http://localhost:8080/s/simple

### Prerequisite

* nodejs 8.11.4 : use a version [manager](https://github.com/jasongin/nvs) for local install

### Usage

* build (automated dev) : web browser to http://localhost:8080 for frontend
  client

* compiled result at build-done

```
 npm start
```

### Layout

* [configs](./configs) : application global configs

* [docs](./docs) : collected documents

* [jobworker](./jobworker/minerjobs-dev) : virtual machine processing contracts

* [public](./public): static web frontend

* [scripts](./scripts) : deployment scripts

* [src](./src) : code to server

  * [config.js](./src/config.js) : server port and other server states

* [test](./test) : not much yet

* [tools](./tools) : tools for compilation

---

* refs: [react-server](README-orig.md)
* usertoken @2018

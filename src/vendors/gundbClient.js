import UUID from "uuid/v4";
import Gun from "gun";
import "gun/lib/path";
import levelup from 'levelup';
import leveldown from 'leveldown';
import levelHyper from 'level-hyper';
import './gun-level';
import { DATA_FILE, DEVICE_ID } from "../configs/localconfigs";
import { CLOUD_MEMORIES } from '../configs/clientMemories';

Gun.log.squelch = true;


const GLOBAL_STATE_ID = DEVICE_ID ? DEVICE_ID : UUID();

const levelDB = levelHyper(DATA_FILE);

const gun = Gun({
  level: levelDB,
  file: false,
  peers: CLOUD_MEMORIES
});

gun.on("out", { get: { "#": { "*": "" } } });

const gunLocal = Gun();

const appState = gunLocal.get(GLOBAL_STATE_ID);
const cloudState = gun.get(GLOBAL_STATE_ID);

export default { Gun, gun, appState, cloudState };

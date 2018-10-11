import Gun from 'gun';
import "gun/lib/path";
import 'gun/lib/not.js';
import 'gun-unset';
import './gun-level/';
import levelup from 'levelup';
import leveldown from 'leveldown';
import levelHyper from 'level-hyper';
import { DATA_FILE, DEVICE_ID } from "../configs/localconfigs";
import { ROOT_MEMORIES } from '../configs/serverMemories';


const levelDB = levelHyper(DATA_FILE);
const gunLocalOptions = {
  level: levelDB,
  file: false
};
const gunRootOptions = {
  peer: ROOT_MEMORIES
};
const gun = Gun(gunRootOptions);
gun.on("out", { get: { "#": { "*": "" } } });

const gunLocal = Gun(gunLocalOptions);

// local channels
const appState = gunLocal.get(`${DEVICE_ID}/state`);

// cloud channels
const cloudAlive = gun.get('alive');
const cloudState = gun.get(`${DEVICE_ID}/state`);
const cloudPeers = gun.get(`${DEVICE_ID}/peers`);

const getAppState = key => {
  //  console.log('1.commChannels getAppState ', key);
  appState.get(key).val(v => {
    //    console.log('1.commChannels getAppState ', key, v);
    return v;
  });
};
const getCloudState = key => {
  //  console.log('1.commChannels getCloudState ', key);
  cloudState.get(key).val(v => {
    //    console.log('1.commChannels getCloudState ', key, v);
    return v;
  });
};
const putAppState = (key, value) => {
  //  console.log('1.commChannels putAppState ', key, value)
  appState.get(key).put(value);
};
const putCloudState = (key, value) => {
  //  console.log('1.commChannels putCloudState ', key, value)
  cloudState.get(key).put(value);
};
//
//const registerWorker = id => {
//  const currentDate = new Date().toISOString();
//  console.log('1.commChannels registerWorker : ', id);
//  // ignore myself
//  //  if (id === DEVICE_ID) {
//  //    console.log('2.commChannels registerWorker ignoring MYSELF : ', id);
//  //    return;
//  //  }
//  try {
//    let newPeer = gun.get(id);
//    // first timer heard from this peer
//    cloudPeers
//      .get('peers-radius-1')
//      .set(newPeer)
//      .get('alive')
//      .not(key => {
//        console.log('3.commChannels registerWorker NEW peer : ', key, id);
//        // add this peer to peer-radius-1
//        cloudPeers
//          .get('peers-radius-1')
//          .set(newPeer)
//          .get('alive')
//          .put(currentDate);
//      });
//    // heard from this worker before
//    cloudPeers
//      .get('peers-radius-1')
//      .set(newPeer)
//      .get('alive')
//      .val(lastAlive => {
//        console.log(
//          '4.commChannels registerWorker ',
//          id,
//          ' lastAlive ',
//          lastAlive,
//        );
//        cloudPeers
//          .get('peers-radius-1')
//          .set(newPeer)
//          .get('lastAlive')
//          .put(lastAlive);
//      });
//    cloudPeers
//      .get('peers-radius-1')
//      .set(newPeer)
//      .get('alive')
//      .put(currentDate);
//    console.log('5.commChannels registerWorker ', id, ' now ', currentDate);
//  } catch (e) {}
//};

export {
  Gun,
  appState,
  cloudState,
  getCloudState,
  putCloudState,
  getAppState,
  putAppState,
};

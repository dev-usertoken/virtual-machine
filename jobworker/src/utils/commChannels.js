import { DEVICE_ID } from '../configs/localconfigs';
import { ROOT_MEMORIES, MY_MEMORY } from '../configs/serverMemories';

console.log('0.jobworker commChannels : ', DEVICE_ID, ROOT_MEMORIES, MY_MEMORY);

const Gun = require('gun');
require('gun/lib/not.js');
require('gun/lib/path.js');
require('gun-unset');

const gunOptions = {
  peer: ROOT_MEMORIES,
};
const gun = Gun(gunOptions);

gun.on('out', { get: { '#': { '*': '' } } });

const gunLocal = Gun(MY_MEMORY);

// local channels
const appState = gunLocal.get(`${DEVICE_ID}/state`);

// cloud channels
const cloudAlive = gun.get('alive');
const cloudState = gun.get(`${DEVICE_ID}/state`);
const cloudPeers = gun.get(`${DEVICE_ID}/peers`);

const getAppState = key => {
  //  console.log('1.jobworker commChannels getAppState ', key);
  appState.get(key).val(v => {
    console.log('1.jobworker commChannels getAppState ', key, v);
    return v;
  });
};
const getCloudState = key => {
  //  console.log('1.jobworker commChannels getCloudState ', key);
  cloudState.get(key).val(v => {
    console.log('1.jobworker commChannels getCloudState ', key, v);
    return v;
  });
};
const putAppState = (key, value) => {
  console.log('1.jobworker commChannels putAppState ', key, value);
  appState.get(key).put(value);
};
const putCloudState = (key, value) => {
  console.log('1.jobworker commChannels putCloudState ', key, value);
  cloudState.get(key).put(value);
};
const heartBeat = () => {
  const beat = new Date().toISOString();
  //  console.log('1.jobworker commChannels heartBeat : ', beat);
  try {
    cloudAlive.path('HEART_BEAT').put({ id: DEVICE_ID, date: beat });
  } catch (e) {}
};
const registerWorker = id => {
  const currentDate = new Date().toISOString();
  console.log('1.jobworker commChannels registerWorker : ', id);
  try {
    let newPeer = gun.get(id);
    // first timer heard from this peer
    cloudPeers
      .get('peers-radius-1')
      .set(newPeer)
      .get('alive')
      .not(key => {
        console.log(
          '3.jobworker commChannels registerWorker NEW peer : ',
          key,
          id,
        );
        // add this peer to peer-radius-1
        cloudPeers
          .get('peers-radius-1')
          .set(newPeer)
          .get('alive')
          .put(currentDate);
      });
    // heard from this worker before
    cloudPeers
      .get('peers-radius-1')
      .set(newPeer)
      .get('alive')
      .val(lastAlive => {
        console.log(
          '4.jobworker commChannels registerWorker ',
          id,
          ' lastAlive ',
          lastAlive,
        );
        cloudPeers
          .get('peers-radius-1')
          .set(newPeer)
          .get('lastAlive')
          .put(lastAlive);
      });
    cloudPeers
      .get('peers-radius-1')
      .set(newPeer)
      .get('alive')
      .put(currentDate);
    console.log(
      '5.jobworker commChannels registerWorker ',
      id,
      ' now ',
      currentDate,
    );
  } catch (e) {}
};

var timeout;

const heartbeat_stop = () => {
  clearInterval(timeout);
  console.log('1.jobworker commChannels The heartbeat has been stopped');
};

const heartbeat_start = () => {
  const beat_interval = 3000; // 3 sec
  timeout = setInterval(heartBeat, beat_interval);
  //  console.log(
  //    '1.jobworker commChannels heartbeat_start at',
  //    beat_interval / 1000,
  //    'second intervals',
  //  );
};
//const HYPER_PORT = process.env.HYPER_PORT || 3030;
//const HYPER_HOST = process.env.HYPER_HOST || 'localhost';
//const HYPER_URL = `http://${HYPER_HOST}:${HYPER_PORT}/batch`;
//
//cloudState.get('HYPER_URL').put(HYPER_URL)

heartbeat_start();
cloudAlive
  .path('HEART_BEAT')
  .get('id')
  .on(id => {
    if (id !== DEVICE_ID) registerWorker(id);
  });

export { getCloudState, putCloudState, getAppState, putAppState };

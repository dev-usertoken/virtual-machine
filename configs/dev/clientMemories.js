// ///
// exports.HOSTNAME = "memory02-dev.alex2006hw.com";

// exports.ROOT_MEMORIES = [
//  "https://tropospheric.mybluemix.net/gun",
//  "https://tropospheric-tropospheric.193b.starter-ca-central-1.openshiftapps.com/gun"
// ];

const DEV_CLOUD_MEMORIES = [
  'https://dev-ut-redhat.193b.starter-ca-central-1.openshiftapps.com/gun',
  'https://dev-ut-memtwo.193b.starter-ca-central-1.openshiftapps.com/gun',
];
const MY_MEMORY =
  !window ||
  !window.location ||
  !window.location.protocol ||
  !window.location.host
    ? DEV_CLOUD_MEMORIES
    : `${window.location.protocol}//${window.location.host}/gun`;

exports.CLOUD_MEMORIES = MY_MEMORY;

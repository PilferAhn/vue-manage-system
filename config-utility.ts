import * as os from 'os';

export const getServerIpAddress = (): string => {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName of Object.keys(networkInterfaces)) {
    const networkInterface = networkInterfaces[interfaceName];
    if (networkInterface) {
      for (const interfaceDetails of networkInterface) {
        const { family, address, internal } = interfaceDetails;
        if (family === 'IPv4' && !internal) {
          return address;
        }
      }
    }
  }
  return 'Unable to determine IP address';
};

console.log(getServerIpAddress());

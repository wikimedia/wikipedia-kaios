export const generateRandomId = () => {
  const rnds = new Uint16Array(5)
  crypto.getRandomValues(rnds)
  return (rnds[0] + 0x10000).toString(16).slice(1) +
          (rnds[1] + 0x10000).toString(16).slice(1) +
          (rnds[2] + 0x10000).toString(16).slice(1) +
          (rnds[3] + 0x10000).toString(16).slice(1) +
          (rnds[4] + 0x10000).toString(16).slice(1)
}

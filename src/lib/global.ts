export const audioContext = {
  isMuted: false,
  setMuted: (muted: boolean) => {
    audioContext.isMuted = muted;
  }
};

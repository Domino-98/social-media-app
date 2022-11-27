export const useScroll = () => {
  const checkIfScrolledBottom = (target: Element) => {
    const { scrollTop, clientHeight, scrollHeight } = target;
    const isBottomReached =
      Math.abs(scrollHeight - scrollTop - clientHeight) <= 3.0;
    if (isBottomReached) {
      return true;
    }
    return false;
  };

  return {
    checkIfScrolledBottom,
  };
};

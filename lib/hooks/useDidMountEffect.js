/**
 * custom hook for useEffect that won't run on first render
 * @see {@link https://stackoverflow.com/a/57941438}
 */

import { useEffect, useRef } from "react";

const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export default useDidMountEffect;

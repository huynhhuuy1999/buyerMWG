import { RefObject } from 'react';

import useEventListener from './useEventListener';

type Handler = (event: MouseEvent) => void;

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
	ref: RefObject<T>,
	handler: Handler,
	mouseEvent: 'mousedown' | 'mouseup' = 'mousedown',
): void {
	useEventListener(mouseEvent, (event) => {
		const el = ref?.current;

		// Do nothing if clicking ref's element or descendent elements
		if (!el || el.contains(event.target as Node)) {
			return;
		}

		handler(event);
	});
}

export default useOnClickOutside;

/*Usage:

1. import hook
2. define ref for component
3. define handler
4. use hook as:  useOnClickOutside(ref, handleClickOutside)

examples: 
import { useOnClickOutside } from 'hooks'
import { useRef } from 'react'

export default function Component() {
  const ref = useRef(null)

  const handleClickOutside = () => {
    // Your custom logic here
    console.log('clicked outside')
  }

  const handleClickInside = () => {
    // Your custom logic here
    console.log('clicked inside')
  }

  useOnClickOutside(ref, handleClickOutside)

  return (
    <button
      ref={ref}
      onClick={handleClickInside}
      style={{ width: 200, height: 200, background: 'cyan' }}
    />
  )
}

*/

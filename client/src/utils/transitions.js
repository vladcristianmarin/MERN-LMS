import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

const Transitions = ({ children }) => {
	const [transition, setTransition] = useState(false);

	useEffect(() => {
		setTransition(true);
	}, []);

	return (
		<CSSTransition in={transition} classNames='anim_mobile_selectors' timeout={300} unmountOnExit>
			{children}
		</CSSTransition>
	);
};

export default Transitions;

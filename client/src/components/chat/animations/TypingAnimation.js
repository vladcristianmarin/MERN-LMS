import animationData from './typing.json';
import { useLottie } from 'lottie-react';

const TypingAnimation = () => {
	const { View } = useLottie({
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	});

	return View;
};

export default TypingAnimation;

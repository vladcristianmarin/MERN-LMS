import io from 'socket.io-client';
import { ENDPOINT } from './constants/extra';

export const ws = io(ENDPOINT);

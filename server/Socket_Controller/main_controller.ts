import WebSocket from 'ws';
import socketAnalyser from './socket_analyzer';

export default  function mainController(message: WebSocket.Data){
    return  socketAnalyser(message);
}
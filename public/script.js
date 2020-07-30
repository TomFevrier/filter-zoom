const socket = io('/');
const peer = new Peer(undefined, {
	host: '/',
	port: '3001'
});

const peers = {};

const grid = document.getElementById('video-grid');

const userVideo = document.createElement('video');
userVideo.muted = true;

navigator.mediaDevices.getUserMedia({
	video: true,
	audio: true
})
.then(stream => {
	addVideoStream(userVideo, stream);

	peer.on('call', call => {
		call.answer(stream);
		const video = document.createElement('video');
		call.on('stream', userVideoStream => {
			addVideoStream(video, userVideoStream);
		});
	});

	socket.on('user-connected', userId => {
		connectToNewUser(userId, stream);
	});
});

socket.on('user-disconnected', userId => {
	console.log(userId, peers, userId in peers)
	if (userId in peers) {
		peers[userId].close();
		// delete peers[userId];
	}
});

peer.on('open', userId => {
	socket.emit('join-room', ROOM_ID, userId);
});

const addVideoStream = (video, stream) => {
	video.srcObject = stream;
	video.addEventListener('loadedmetadata', () => {
		video.play();
	});
	video.style.display = 'none';
	grid.append(video);
	Filters.go();
}

const connectToNewUser = (userId, stream) => {
	const call = peer.call(userId, stream);

	const video = document.createElement('video');

	call.on('stream', userVideoStream => {
		addVideoStream(video, userVideoStream);
	});

	call.on('close', () => video.remove());

	peers[userId] = call;
}

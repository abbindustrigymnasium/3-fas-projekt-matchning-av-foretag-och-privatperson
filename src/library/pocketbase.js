import PocketBase from 'pocketbase';

const pb = new PocketBase('https://student-match-pb.cloud.spetsen.net');

pb.autoCancellation(false);

export default pb;
// Importing the PocketBase library to interact with the backend
import PocketBase from 'pocketbase';

// Create an instance of PocketBase, pointing to the provided backend URL
const pb = new PocketBase('https://student-match-pb.cloud.spetsen.net');

// Disable automatic cancellation for requests (to ensure requests aren't automatically canceled)
// This can be useful when you want to handle requests manually, for example, in long-running operations.
pb.autoCancellation(false);

// Export the PocketBase instance so it can be used throughout the app
export default pb;

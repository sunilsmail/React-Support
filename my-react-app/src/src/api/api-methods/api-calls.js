import axios from '../axios';

// Accept endpoint and payload as parameters
async function createPost(endpoint, payload) {
  try {
    const response = await axios.post(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error(`❌ Error creating ${endpoint}:`, error);
    return { error: true, endpoint, message: error.message };
  }
}

// Example usage: mockPostCalls with dynamic endpoint and payload
export const mockPostCalls = Array.from(
  { length: 14 },
  (_, i) => () =>
    createPost(
      '/posts',
      {
        title: `Post ${i + 1}`,
        body: `This is the content for post ${i + 1}`,
        userId: 1,
      }
    )
);

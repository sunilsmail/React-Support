import { useEffect } from 'react';
import { mockPostCalls } from './src/api/api-methods/api-calls';

function App() {
  useEffect(() => {
    const runPosts = async () => {
      const firstTen = mockPostCalls.slice(0, 10);
      const remaining = mockPostCalls.slice(10);

      // 🔹 Run first 10 in parallel
      const firstResults = await Promise.all(firstTen.map((call) => call()));
      console.log('First 10 Results:', firstResults);

      // 🔸 Run remaining 4 sequentially
      const remainingResults = [];
      for (const call of remaining) {
        const result = await call();
        remainingResults.push(result);
      }

      console.log('Remaining 4 Results:', remainingResults);
    };

    runPosts();
  }, []);

  return (
    <div>
      <h1>Mock POST API Demo</h1>
      <p>Check the console for POST request results.</p>
    </div>
  );
}

export default App;

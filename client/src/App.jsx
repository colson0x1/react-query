import { useQuery, useMutation } from '@tanstack/react-query';

// useQuery - Allows to get data
// useMutation - Allows to change data
const POSTS = [
  { id: 1, title: 'Post 1' },
  { id: 2, title: 'Post 2' },
];

function App() {
  console.log(POSTS);

  const postsQuery = useQuery({
    // queryKey is key that uniquely identifies this query
    queryKey: ['posts'],
    // This is the fn that runs to actually query our data
    // This fn always accepts a Promise (Any asynchronous code)
    // So We just want to return a promise
    queryFn: () => wait(1000).then(() => [...POSTS]),

    // For some reason if this returns an error, what we can do is we can
    // just make this reject a Promise
    // This makes 'Loading...' appear for a while and eventually its going to
    // return our error message.
    // We can notice that the loading is taking a bit longer that's because
    // it constantly retries over and over and over again to make sure our
    // function fails multiple times
    // So it does mutliple retries of our queryFn and it'll wait between each
    // retry until it fails multiple times in a row and then it'll return to our
    // error
    // That's a really usefull feature to have those automatic retries built
    // into the system
    /* queryFn: () => Promise.reject('Error Message'), */
  });

  const newPostMutation = useMutation({
    // Same, mutationFn expects to return a promise
    mutationFn: (title) => {
      return wait(1000).then(() =>
        POSTS.push({ id: crypto.randomUUID(), title }),
      );
    },
  });

  if (postsQuery.isLoading) return <h1>Loading...</h1>;
  if (postsQuery.isError) {
    return <pre>{JSON.stringify(postsQuery.error)}</pre>;
  }

  return (
    <div>
      {postsQuery.data.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button onClick={() => newPostMutation.mutate('New Post')}>
        Add New
      </button>
    </div>
  );
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;

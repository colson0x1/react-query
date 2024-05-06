import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// useQuery - Allows to get data
// useMutation - Allows to change data
const POSTS = [
  { id: 1, title: 'Post 1' },
  { id: 2, title: 'Post 2' },
];

// query keys pattern for endpoint
// break apart our url
// everytime we have /, we can think of it as a new element inside our array
// and we just pass the value into it.
// @ /posts -> ['posts']
// Here add same posts in the beginning but also add 1 i.e its `id` (post.id)
// @ /posts/1 -> ['posts', post.id]
// Whenever there's filtering, its better to put inside of an object
// { authorId: 1 }
// that's going to be the filter that we use for this one route
// @ /posts?authorId=1 -> ['posts', { authorId: 1 }]
// here also add comments at the end of it along with post id
// @ /posts/2/comments -> ['posts', post.id, 'comments']
// NOTE:
// The maain thing that we want to realize is, whenever we pass data like a
// postId or an authorId into our queryKey here. We wanna make sure that
// whatever function we define in queryFn, actually uses that data. That way
// we can make sure that our actual key (in queryKey) and the thing that we're
// quering and our function (queryFn), they're synced up together.
// That way when we need to do some type of invalidation, we're invalidating
// all the queries that have that particular key.

function App() {
  console.log(POSTS);
  // This is just going to return the thing that we created on main.jsx but
  // it does have some nice functions on it
  // i.e const queryClient = new QueryClient()
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    // queryKey is key that uniquely identifies this query
    queryKey: ['posts'],
    // This is the fn that runs to actually query our data
    // This fn always accepts a Promise (Any asynchronous code)
    // i.e queryFn must always return a promise cause this is going to be for
    // asynchronous data
    // we get an obj for queryFn as the argument
    queryFn: (obj) =>
      wait(1000).then(() => {
        // console.log(obj);

        return [...POSTS];
      }),

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

  // postsQuery.status === 'loading'

  /*
  const newPostMutation = useMutation({
    // Same, mutationFn expects to return a promise
    // This mutation is changing our underlying data for this queryKey i.e. ['posts']
    // So what we need to really do is, we need to setup onSuccess
    // onSuccess is whenever we have successful data, what we want to do.
    // In our case, we want to invalidate the query we have there i.e queryKey: ['posts']
    //
    mutationFn: (title) => {
      return wait(1000).then(() =>
        POSTS.push({ id: crypto.randomUUID(), title }),
      );
    },
    onSuccess: () => {
      // what we want to do is, we want to invalidate our 'posts' query
      // so whenever we have a successful mutation when we add a new post,
      // we want to invalidate our old post so now if we click add new button,
      // and we wait for 1 sec, we can see it refetch that data immediately for us
      queryClient.invalidateQueries(['posts']);
    },
  });
  */

  if (postsQuery.isLoading) return <h1>Loading...</h1>;
  if (postsQuery.isError) {
    return <pre>{JSON.stringify(postsQuery.error)}</pre>;
  }

  return (
    <div>
      {postsQuery.data.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
      {/* <button
        disabled={newPostMutation.isLoading}
        onClick={() => newPostMutation.mutate('New Post')}
      >
        Add New
      </button> */}
    </div>
  );
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;

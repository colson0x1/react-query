import { useQueries, useQuery } from '@tanstack/react-query';
import { getPost, getPosts } from './api/posts';

export default function PostsList1() {
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    // staleTime: 1000,
    // Every 1 second, refetch our data
    refetchInterval: 1000,
  });

  // If we need to do a bunch of different queries inside of an array, we need
  // to use useQueries instead of using an actual array syntax and then we pass
  // the array inside right here
  // Thisis much more common if we for example have a list of IDs that we want
  // to render, we probably would do in a scenario like this
  /*
  const queries = useQueries({
    queries: (postsQuery?.data ?? []).map((post) => {
      return {
        queryKey: ['posts', post.id],
        queryFn: () => getPost(post.id),
      };
    }),
  });
  */

  // console.log(queries.map((q) => q.data));

  // Anytime that we're refetching our query, it is going to be in that
  // `fetching` status
  /* postsQuery.fetchStatus === 'fetching' */

  // If we're currently not doing anything, so for example we're not fetching
  // and its already done, it'll be in the `idle` status
  /* postsQuery.fetchStatus === 'idle' */

  // Or for some rason like we lose connectivity to our internet, it'll be in
  // the `paused` status if it was in the process of fetching and then for
  // some reason was not able to finish
  /* postsQuery.fetchStatus === 'paused' */

  // How `.fetchStatus` and normal `.status` work together is when our component
  // very first mounts, what's going to happen is our `.fetchStatus` is going
  // to be in that `fetching` status, and our `.status` is going to be in our
  // `loading` state.
  // Because the first time we load the page, its going to fetch the data
  // and its going to load the data.
  // Then if our data comes back successful,
  /* postsQuery.fetchStatus === 'idle' */
  /* postsQuery.status === 'success'  */
  // While this is error, this will change to error and the data or error property
  // will be set accordingly depending on if we have an error or success
  /* postsQuery.status === 'error' */

  if (postsQuery.status === 'loading') return <h1>Loading...</h1>;
  if (postsQuery.status === 'error') {
    return <h1>{JSON.stringify(postsQuery.error)}</h1>;
  }

  return (
    <div>
      <h1>Posts List 1</h1>
      <ol>
        {postsQuery.data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ol>
    </div>
  );
}

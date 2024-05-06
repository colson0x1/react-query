import { useQuery } from '@tanstack/react-query';
import { getPost } from './api/posts';
import { getUser } from './api/users';

export default function Post({ id }) {
  const postQuery = useQuery({
    queryKey: ['posts', id],
    queryFn: () => getPost(id),
  });

  // We only want to run this userQuery after our postQuery has finished
  // because otherwise we don't have a userId to reference.
  // That is where the enabled key comes in
  // We can write expression that evaluates to true or false
  // We only want this query to be enabled, when this is not equal to null.
  // So whenever we have a userId, then we actually want to run this function
  // otherwise don't run this at all.
  const userQuery = useQuery({
    queryKey: ['users', postQuery?.data?.userId],
    // Enable key: Make sure we only render queries when we want them so if
    // one query depends on another query, we can really easily do that with
    // enabled or if we just wanna disable query for some reason, we can do
    // that as well.
    enabled: postQuery?.data?.userId != null,
    queryFn: () => getUser(postQuery.data.userId),
  });

  if (postQuery.status === 'loading') return <h1>Loading...</h1>;
  if (postQuery.status === 'error') {
    return <h1>{JSON.stringify(postQuery.error)}</h1>;
  }

  return (
    <>
      <h1>
        {postQuery.data.title} <br />
        <small>
          {userQuery.isLoading
            ? 'Loading User...'
            : useQuery.isError
              ? 'Error Loading User'
              : userQuery.data.name}
        </small>
      </h1>
      <p>{postQuery.data.body}</p>
    </>
  );
}

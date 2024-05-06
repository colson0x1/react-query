import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { createPost } from './api/posts';
import Post from './Post';

export function CreatePost({ setCurrentPage }) {
  const titleRef = useRef();
  const bodyRef = useRef();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    // This is going to happen anytime we have a success
    // onSuccess: (data, variables, context) => {}
    onSuccess: (data) => {
      // console.log(context);

      // Manually update the cache
      // Here we created a brand new post inside of our query
      // So what this one line of code does right here is that, it allows us
      // to create a brand new entry in our cache that is pointing to this
      // query (ie. ['posts', data.id]) with this data (i.e data)
      // Now when we click on New Post and create a new post on browser, we
      // can see, it instantly loads the post name and description but it will
      // take a while for loading username because user was in our cache.
      // But all the data for the post was instantaneously showing  because it
      // was already set manually inside of our cache.
      // Now the only other thing we can do with setQueryData is, we can actually
      // pass a function and this function will take in the old data as its
      // property right bere
      //  queryClient.setQueryData(['posts', data.id], (oldData) => {})
      //  That's really useful if we need to make changes to the old data
      //  by passing in some new data so we could combine it together the two
      //  things. The only key here is that, we need to make sure that we don't
      //  change the old data, we can't mutate it. It must be immutable just
      //  like when we're working with react state.
      //  So that's one other thing we can do but most often, we're probably
      //  just going to be passing in the data just like this.
      queryClient.setQueryData(['posts', data.id], data);

      // Now if we create new post and go to post list, it does not show it and
      // it won't show up until this data is no longer fresh and it becomes stale
      // which is  going to take five minutes as set up in the main.jsx for staleTime
      // It's obviously a horrible user experience, which is why we want to invalidate
      // our queries and pretty much anytime we do a mutation, we're almost always
      // going to want to invalidate any query related to that mutation because
      // we're obviously changing the data of that query.
      // In order to do that, we need to import useQueryClient hook
      // exact: true means this is ONLY going to invalidate quries that has the
      // exact query here
      queryClient.invalidateQueries(['posts'], { exact: true }),
        setCurrentPage(<Post id={data.id} />);
    },
    // That context is going to be whatever we return from onMutate
    // onMutate is really great if we need to do something before our mutationFn
    // or if we need to set some data inside our context
    // Another important thing about useMutation is if we make our mutation
    // and it fails, it doesn't do any type of retry like we would normally
    // get with a query. This is to make sure that we don't accidentally create
    // seven posts if it retries seven times. even thought it returns an error
    // if it still creates it on the backend
    // We can also pass- retry: 3
    // retry: 3,
    // and that will retry 3 times before actually showing as an error
    // Generally we wouldn't do this with mutations
    //
    // onMutate: (variables) => {
    //   return { hi: 'bye' };
    // },
  });

  // createPostMutation.status === 'idle'
  // we also have mutate fn in async version which uses promises
  // So if we want to do specific things when we mutate, we can use the
  // mutateAsync instead if we really want
  // createPostMutation.mutateAsync().then(() => {})

  // mutate fn also takes an second object so we can do things like
  // onSuccess, or onError inline for each individual mutations that we're doing
  // Generally we don't do this way but instead we do that onSuccess in our
  // actual createMutation there but if we need to do it at the actual moment
  // we call mutate, we can do that as well by passing a second property to the
  // mutate function
  // createPostMutation.mutate({}, { onError });

  function handleSubmit(e) {
    e.preventDefault();
    createPostMutation.mutate({
      title: titleRef.current.value,
      body: bodyRef.current.value,
    });
  }

  return (
    <div>
      {createPostMutation.isError && JSON.stringify(createPostMutation.error)}
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='title'>Title</label>
          <input id='title' ref={titleRef} />
        </div>
        <div>
          <label htmlFor='body'>Body</label>
          <input id='body' ref={bodyRef} />
        </div>
        <button disabled={createPostMutation.isLoading}>
          {createPostMutation.isLoading ? 'Loading...' : 'Create'}
        </button>
      </form>
    </div>
  );
}

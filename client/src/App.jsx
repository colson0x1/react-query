import { useState } from 'react';

// PostList1 and PostList2 Component use exact same `queryKey` but they are on
// different page and they cause an entire App refresh.
// So these are the same queryKey but in two different location of our application.

import PostsList1 from './PostsList1';
import PostsList2 from './PostsList2';
import Post from './Post';
import { CreatePost } from './CreatePost';
import { PostListPaginated } from './PostListPaginated';
import { PostListInfinite } from './PostListInfiniteScrolling';

export default function App() {
  const [currentPage, setCurrentPage] = useState(<PostsList1 />);

  return (
    <div>
      <button onClick={() => setCurrentPage(<PostsList1 />)}>
        Posts List 1
      </button>
      <button onClick={() => setCurrentPage(<PostsList2 />)}>
        Posts List 2
      </button>
      <button onClick={() => setCurrentPage(<Post id={1} />)}>
        First Post
      </button>
      <button
        onClick={() =>
          setCurrentPage(<CreatePost setCurrentPage={setCurrentPage} />)
        }
      >
        New Post
      </button>
      <button onClick={() => setCurrentPage(<PostListPaginated />)}>
        Post List Paginated
      </button>
      <button onClick={() => setCurrentPage(<PostListInfinite />)}>
        Post List Infinite Scrolling
      </button>
      <br />
      {currentPage}
    </div>
  );
}

import Card from "../../components/card/Card";
import Filter from "../../components/filter/Filter";
import Map from "../../components/map/Map";
import "./listpage.scss";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense, useState } from "react";

function ListPage() {
  const data = useLoaderData();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />

          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => {
                const posts = [...postResponse.data].reverse();
                const totalPages = Math.ceil(posts.length / postsPerPage);
                const startIndex = (currentPage - 1) * postsPerPage;
                const currentPosts = posts.slice(
                  startIndex,
                  startIndex + postsPerPage
                );

                return (
                  <>
                    {currentPosts.map((post) => (
                      <Card key={post.id} item={post} />
                    ))}

                    {/* Pagination Controls */}
                    <div className="pagination">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>

                      <span>
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>

      <div className="mapContainer">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading posts!</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;

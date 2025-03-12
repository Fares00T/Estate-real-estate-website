import "./list.scss";
import Card from "../card/Card";

function List({ posts = [], onDelete, currentUser }) {
  return (
    <div className="list">
      {posts.length > 0 ? (
        posts.map((item) => (
          <Card
            key={item.id}
            item={item}
            onDelete={currentUser?.id === item.userId ? onDelete : null} // Check before accessing properties
          />
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}

export default List;

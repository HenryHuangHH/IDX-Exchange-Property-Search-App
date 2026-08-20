import { useState } from 'react';

function PropertyImageCarousel({ photos }) {
  const [index, setIndex] = useState(0);

  let list = [];
  try {
    const parsed = typeof photos === 'string' ? JSON.parse(photos) : photos;
    if (Array.isArray(parsed)) {
      list = parsed.map((p) => (typeof p === 'string' ? p : p?.MediaURL || p?.url)).filter(Boolean);
    }
  } catch {
    list = [];
  }

  if (list.length === 0) {
    return <div>No photo</div>;
  }

  function prev(e) {
    e.stopPropagation();
    setIndex(index === 0 ? list.length - 1 : index - 1);
  }

  function next(e) {
    e.stopPropagation();
    setIndex(index === list.length - 1 ? 0 : index + 1);
  }

  return (
    <div>
      <img src={list[index]} alt="property" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
      {list.length > 1 && (
        <div>
          <button type="button" onClick={prev}>prev</button>
          <span> {index + 1} / {list.length} </span>
          <button type="button" onClick={next}>next</button>
        </div>
      )}
    </div>
  );
}

export default PropertyImageCarousel;

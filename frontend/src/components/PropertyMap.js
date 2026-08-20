function PropertyMap({ latitude, longitude }) {
  const src = `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}`;

  return (
    <iframe
      title="map"
      src={src}
      width="100%"
      height="300"
      style={{ border: 0 }}
    />
  );
}

export default PropertyMap;

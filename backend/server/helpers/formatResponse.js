function formatResponse(data, ...otherStuff) {
  return { data, ...otherStuff };
}
module.exports = formatResponse;

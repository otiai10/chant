
export function api_imageUpload(file) {
  return (dispatch) => {
    let body = new FormData();
    body.append('image', file);
    // TODO: https://github.com/otiai10/chant/issues/256
    fetch('/api/messages/image', {method: 'POST', credentials: 'include', body})
    .then(res => res.status < 400 ? Promise.resolve(res.json()) : Promise.reject(res.json()))
    .then(json => console.log(json))
    .catch(err => console.log(err));
    dispatch({type:'IGNORE'});
  };
}
